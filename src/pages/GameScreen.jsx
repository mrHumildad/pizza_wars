import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import GameHUD from '../components/GameHUD'
import GameArea from '../components/GameArea'
import GameFooter from '../components/GameFooter'
import MarketTab from '../components/tabs/MarketTab'
import HangarTab from '../components/tabs/HangarTab'
import LodgeTab from '../components/tabs/LodgeTab'
import CharacterTab from '../components/tabs/CharacterTab'
import TravelMode from '../components/TravelMode'
import { places } from '../logics/places'
import { products } from '../logics/products'
import { planes } from '../logics/planes'
import { 
  generateLocationPrices, 
  advanceAllPrices,
  initializeInventory,
  buyItem,
  sellItem,
  updateInventoryBuy,
  updateInventorySell
} from '../gameMechanics'

const INITIAL_MONEY = 666
const START_MONTH = 3 // April (0-indexed: 0=Jan, 3=April)
const START_YEAR = 2026

const TABS = [
  { id: 'market', label: '🏪 Market' },
  { id: 'hangar', label: '🔧 Hangar' },
  { id: 'lodge', label: '🏠 Lodge' },
  { id: 'character', label: '👤 Character' },
]

// Format number with dot as thousands separator (no decimals)
function formatWithDots(num) {
  const rounded = Math.floor(num).toString()
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Format money like "666 $"
function formatMoney(money) {
  return formatWithDots(money) + ' $'
}

function GameScreen() {
  const location = useLocation()
  const { t, getMonth } = useLanguage()
  
  // Get game config from navigation state
  const gameConfig = location.state || {}
  const { playerName, character, startingPlace } = gameConfig
  
  const initialLocationId = startingPlace?.id || 1
  
  // Start with cheapest plane
  const cheapestPlane = planes[0]
  
  const [money, setMoney] = useState(INITIAL_MONEY)
  const [month, setMonth] = useState(START_MONTH)
  const [year, setYear] = useState(START_YEAR)
  const [currentLocation, setCurrentLocation] = useState(startingPlace?.name || 'Unknown')
  const [currentLocationId, setCurrentLocationId] = useState(initialLocationId)
  const [currentPlane, setCurrentPlane] = useState(cheapestPlane)
  const [activeTab, setActiveTab] = useState('market')
  const [locationPrices, setLocationPrices] = useState({})
  const [inventory, setInventory] = useState({})
  const [travelMode, setTravelMode] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(null)
  
  // Get translated tab labels
  const getTabLabel = (tabId) => {
    switch (tabId) {
      case 'market': return t('tabMarket')
      case 'hangar': return t('tabHangar')
      case 'lodge': return t('tabLodge')
      case 'character': return t('tabCharacter')
      default: return tabId
    }
  }
  
  // Initialize prices and inventory on mount
  useEffect(() => {
    const prices = generateLocationPrices(places, products)
    setLocationPrices(prices)
    setInventory(initializeInventory(products))
  }, [])
  
  // Format date for display
  const formattedDate = getMonth(month) + ' ' + year
  
  // Handle buy item
  const handleBuy = (productId, quantity, price) => {
    const result = buyItem(money, products.find(p => p.id === productId), quantity, price)
    if (result.success) {
      setMoney(result.newMoney)
      setInventory(updateInventoryBuy(inventory, productId, quantity, price))
    } else {
      alert(result.message)
    }
  }
  
  // Handle sell item
  const handleSell = (productId, quantity, price) => {
    const result = sellItem(inventory[productId], quantity, price)
    if (result.success) {
      setMoney(money + result.revenue)
      setInventory(updateInventorySell(inventory, productId, quantity, price))
    } else {
      alert(result.message)
    }
  }
  
  // Handle buy plane
  const handleBuyPlane = (plane) => {
    if (money >= plane.price) {
      if (confirm(t('confirmBuyPlane'))) {
        setMoney(money - plane.price + Math.floor(currentPlane.price * 0.5)) // 50% trade-in
        setCurrentPlane(plane)
      }
    } else {
      alert(t('notEnoughMoney'))
    }
  }
  
  // Handle travel to new location
  const handleTravel = (newLocationId, travelCost) => {
    if (travelCost > 0 && money < travelCost) {
      alert(t('notEnoughFuel'))
      return
    }
    
    // Deduct fuel cost
    if (travelCost > 0) {
      setMoney(money - travelCost)
    }
    
    // Update location if traveling
    if (newLocationId) {
      const newPlace = places.find(p => p.id === newLocationId)
      if (newPlace) {
        setCurrentLocation(newPlace.name)
        setCurrentLocationId(newLocationId)
      }
    } else {
      // Staying - still advance month
      setCurrentLocationId(currentLocationId)
    }
    
    // Advance month/year for new turn
    setMonth((m) => {
      const newMonth = (m + 1) % 12
      if (newMonth === 0) {
        setYear((y) => y + 1)
      }
      return newMonth
    })
    
    // Generate new prices for ALL places for next turn and log to console
    const newPrices = advanceAllPrices(places, products, locationPrices)
    setLocationPrices(newPrices)
    
    // Exit travel mode and show tabs for new turn
    setTravelMode(false)
    setSelectedDestination(null)
  }
  
  // Enter travel mode (hide tabs, show destination selection)
  const handleEnterTravelMode = () => {
    setSelectedDestination(null)
    setTravelMode(true)
  }
  
  // Handle destination selection in travel mode
  const handleSelectDestination = (destinationId) => {
    setSelectedDestination(destinationId)
  }
  
  // Confirm travel and start new turn
  const handleConfirmTravel = () => {
    const travelCost = selectedDestination ? currentPlane.fuelCost : 0
    handleTravel(selectedDestination, travelCost)
  }
  
  // Listen for nextMonth event from footer button
  useEffect(() => {
    const handleNextMonth = () => {
      // Enter travel mode when Next button is pressed
      handleEnterTravelMode()
    }
    
    window.addEventListener('nextMonth', handleNextMonth)
    return () => window.removeEventListener('nextMonth', handleNextMonth)
  }, [])
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'market':
        return (
          <MarketTab 
            locationPrices={locationPrices}
            inventory={inventory}
            money={money}
            onBuy={handleBuy}
            onSell={handleSell}
            locationId={currentLocationId}
            planeCapacity={currentPlane.capacity}
          />
        )
      case 'hangar':
        return (
          <HangarTab 
            money={money}
            currentPlane={currentPlane}
            onBuyPlane={handleBuyPlane}
          />
        )
      case 'lodge':
        return <LodgeTab />
      case 'character':
        return (
          <CharacterTab 
            character={character} 
            playerName={playerName} 
            inventory={inventory}
            currentPlane={currentPlane}
          />
        )
      default:
        return null
    }
  }

  // Get travel mode text
  const travelConfirmText = travelMode ? t('confirmBtn') : t('goBtn')
  
  return (
    <div className="game-screen">
      <GameHUD money={formatMoney(money)} date={formattedDate} location={currentLocation} />
      
      <GameArea>
        <div className="game-layout">
          {/* Show tab navigation only when not in travel mode */}
          {!travelMode && (
            <div className="tab-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={'tab-btn ' + (activeTab === tab.id ? 'active' : '')}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {getTabLabel(tab.id)}
                </button>
              ))}
            </div>
          )}
          
          {/* Show TravelMode component when in travel mode */}
          <div className="tab-panel">
            {!travelMode ? renderTabContent() : (
              <TravelMode 
                currentPlaceId={currentLocationId}
                fuelCost={currentPlane.fuelCost}
                money={money}
                onTravel={handleTravel}
              />
            )}
          </div>
        </div>
      </GameArea>
      
      <GameFooter 
        onBack={() => window.history.back()}
        onSelectDestination={handleSelectDestination}
        onConfirm={handleConfirmTravel}
        currentPlaceId={currentLocationId}
        places={places}
        fuelCost={currentPlane.fuelCost}
        money={money}
        selectedDestination={selectedDestination}
        travelMode={travelMode}
        confirmText={travelConfirmText}
      />
    </div>
  )
}

export default GameScreen
