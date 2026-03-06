import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useGameHeader } from '../contexts/GameHeaderContext'
import GameArea from '../components/GameArea'
import GameFooter from '../components/GameFooter'
import MarketTab from '../components/tabs/MarketTab'
import HangarTab from '../components/tabs/HangarTab'
import LodgeTab from '../components/tabs/LodgeTab'
import CharacterTab from '../components/tabs/CharacterTab'
import MailTab from '../components/tabs/MailTab'
import LocationTab from '../components/tabs/LocationTab'
import ClubsTab from '../components/tabs/ClubsTab'
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

const SAVE_KEY = 'pizzaWarsSave'

const INITIAL_MONEY = 666
const START_MONTH = 3 // April (0-indexed: 0=Jan, 3=April)
const START_YEAR = 2026

const TABS = [
  { id: 'character', label: '👤' },
  { id: 'market', label: '🏪' },
  { id: 'hangar', label: '🔧' },
  { id: 'lodge', label: '🏠' },
  { id: 'clubs', label: '🎱' },
  { id: 'mail', label: '📧' },
  { id: 'location', label: '📍' },
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
  const { setGameHeaderInfo } = useGameHeader()
  
  // Get game config from navigation state
  const gameConfig = location.state || {}
  const { playerName, character, startingPlace, friend } = gameConfig
  
  const initialLocationId = startingPlace?.id || 1
  
  // Start with cheapest plane
  const cheapestPlane = planes[0]
  
  const [money, setMoney] = useState(INITIAL_MONEY)
  const [month, setMonth] = useState(START_MONTH)
  const [year, setYear] = useState(START_YEAR)
  const [currentLocation, setCurrentLocation] = useState(startingPlace?.name || 'Unknown')
  const [currentLocationId, setCurrentLocationId] = useState(initialLocationId)
  const [currentPlane, setCurrentPlane] = useState(cheapestPlane)
  const [activeTab, setActiveTab] = useState('location')
  const [locationPrices, setLocationPrices] = useState({})
  const [locationAvailability, setLocationAvailability] = useState({})
  const [inventory, setInventory] = useState({})
  const [travelMode, setTravelMode] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(null)
  
  // Grade system - starts at grade 1
  const [grade, setGrade] = useState(1)
  // Lodge is disabled after use until next turn/month
  const [lodgeEnabled, setLodgeEnabled] = useState(true)
  // Clubs is disabled after use until next turn/month
  const [clubsEnabled, setClubsEnabled] = useState(true)
  // Previous turn's special (applied to current prices)
  const [previousSpecial, setPreviousSpecial] = useState(null)
  // Player mails
  const [mails, setMails] = useState([])
  // Track if there's new mail for the current turn (animates the mail tab button)
  const [hasNewMail, setHasNewMail] = useState(false)
  // Friends list - starts with the initial friend from new game
  const [friends, setFriends] = useState(() => friend ? [friend] : [])
  
  // Function to save game state to localStorage
  const saveGame = () => {
    const gameState = {
      money,
      month,
      year,
      currentLocation,
      currentLocationId,
      currentPlane,
      locationPrices,
      locationAvailability,
      inventory,
      grade,
      lodgeEnabled,
      clubsEnabled,
      previousSpecial,
      mails,
      friends,
      // Also save the game config (playerName, character, startingPlace, friend)
      playerName,
      character,
      startingPlace,
      friend
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState))
    console.log('Game saved!')
  }
  
  // Function to load game state from localStorage
  const loadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const gameState = JSON.parse(saved)
        setMoney(gameState.money)
        setMonth(gameState.month)
        setYear(gameState.year)
        setCurrentLocation(gameState.currentLocation)
        setCurrentLocationId(gameState.currentLocationId)
        setCurrentPlane(gameState.currentPlane)
        setLocationPrices(gameState.locationPrices)
        setLocationAvailability(gameState.locationAvailability)
        setInventory(gameState.inventory)
        setGrade(gameState.grade)
        setLodgeEnabled(gameState.lodgeEnabled)
        setClubsEnabled(gameState.clubsEnabled)
        setPreviousSpecial(gameState.previousSpecial)
        setMails(gameState.mails || [])
        setFriends(gameState.friends || [])
        console.log('Game loaded!')
        return true
      } catch (e) {
        console.error('Failed to load game:', e)
        return false
      }
    }
    return false
  }
  
  // Try to load saved game on mount
  useEffect(() => {
    const loaded = loadGame()
    if (!loaded) {
      // Only initialize prices if not loading a saved game
      const result = generateLocationPrices(places, products, friend)
      setLocationPrices(result.prices)
      setLocationAvailability(result.availability)
      setInventory(initializeInventory(products))
    }
  }, []) // Empty dependency array - only run on mount
  
  // Auto-save game state when key game data changes
  useEffect(() => {
    // Only save if we have meaningful data (not initial empty state)
    if (money !== INITIAL_MONEY || Object.keys(locationPrices).length > 0) {
      saveGame()
    }
  }, [money, month, year, currentLocation, currentLocationId, currentPlane, locationPrices, locationAvailability, inventory, grade, lodgeEnabled, clubsEnabled, previousSpecial, mails, friends])
  
  // Handle location click to show location tab
  const handleLocationClick = () => {
    setActiveTab('location')
  }
  
  // Get translated tab labels
  const getTabLabel = (tabId) => {
    switch (tabId) {
      case 'market': return t('tabMarket')
      case 'hangar': return t('tabHangar')
      case 'lodge': return t('tabLodge')
      case 'clubs': return t('tabClubs')
      case 'character': return t('tabCharacter')
      case 'location': return t('tabLocation') || '📍 Location'
      default: return tabId
    }
  }
  
  // Format date for display
  const formattedDate = getMonth(month) + ' ' + year
  
  // Update header info when game state changes
  useEffect(() => {
    setGameHeaderInfo({
      money: formatMoney(money),
      location: currentLocation,
      date: formattedDate
    })
    return () => setGameHeaderInfo(null)
  }, [money, currentLocation, formattedDate, setGameHeaderInfo])
  
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
    
    // Generate new prices with previous special applied, and next special
    const result = advanceAllPrices(places, products, locationPrices, previousSpecial, friend)
    setLocationPrices(result.prices)
    setLocationAvailability(result.availability)
    setPreviousSpecial(result.nextSpecial)
    
    // Check if friend's location has special next week (using result.nextSpecial)
    if (friend && result.nextSpecial) {
      const friendPlace = places.find(p => p.name === friend.location)
      if (friendPlace && friendPlace.id === result.nextSpecial.placeId) {
        // Friend is at the location of next week's special!
        const isFavProduct = friend.favProduct && 
          friend.favProduct.toLowerCase() === result.nextSpecial.productName.toLowerCase()
        
        const direction = result.nextSpecial.isMultiplier ? 'UP' : 'DOWN'
        
        let mailSubject = 'Heads up!'
        let mailBody = ''
        
        if (isFavProduct) {
          // Knows exact product - give more info
          mailSubject = ' insider info!'
          mailBody = `Hey! I heard something big is happening at ${result.nextSpecial.locationName} next week. `
          mailBody += `The price of ${result.nextSpecial.productName} is going ${direction}! `
          mailBody += `I know because it's my favorite! You should look into it!`
        } else {
          mailBody = `Hey! I heard something big is happening at ${result.nextSpecial.locationName} next week. `
          mailBody += `Something with prices... you might want to check it out!`
        }
        
        const newMail = {
          from: friend.name,
          date: getMonth(month) + ' ' + year,
          subject: mailSubject,
          body: mailBody,
          turn: month + '-' + year // Track which turn this mail was received
        }
        
        setMails(prev => [...prev, newMail])
        setHasNewMail(true) // Mark that there's new mail for the animation
        console.log('MAIL RECEIVED:', newMail)
      }
    }
    
    // Reset lodge for new turn
    setLodgeEnabled(true)
    setClubsEnabled(true)
    
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
  
  // Handle grade up when player wins at the lodge
  const handleGradeUp = () => {
    setGrade(prev => prev + 1)
    setLodgeEnabled(false)
    setActiveTab('location')
  }
  
  // Handle lodge completion (loss or any result goes back to market)
  const handleLodgeComplete = () => {
    setLodgeEnabled(false)
    setActiveTab('location')
  }
  
  // Handle clubs completion (return to market)
  const handleClubsComplete = () => {
    setClubsEnabled(false)
    setActiveTab('location')
  }
  
  // Handle delete mail
  const handleDeleteMail = (index) => {
    setMails(prev => prev.filter((_, i) => i !== index))
  }
  
  // Handle adding a new friend
  const handleAddFriend = (newFriend) => {
    setFriends(prev => [...prev, newFriend])
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'market':
        return (
          <MarketTab 
            locationPrices={locationPrices}
            locationAvailability={locationAvailability}
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
        return (
          <LodgeTab 
            grade={grade}
            onGradeUp={handleGradeUp}
            onComplete={handleLodgeComplete}
            enabled={lodgeEnabled}
          />
        )
      case 'clubs':
        return (
          <ClubsTab 
            locationId={currentLocationId}
            friends={friends}
            onAddFriend={handleAddFriend}
            enabled={clubsEnabled}
            onComplete={handleClubsComplete}
          />
        )
      case 'character':
        return (
          <CharacterTab 
            character={character} 
            playerName={playerName} 
            inventory={inventory}
            currentPlane={currentPlane}
            grade={grade}
            friends={friends}
          />
        )
      case 'mail':
        return (
          <MailTab 
            mails={mails}
            onDeleteMail={handleDeleteMail}
          />
        )
      case 'location':
        return (
          <LocationTab 
            locationId={currentLocationId}
            grade={grade}
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
      
      <GameArea>
        <div className="game-layout">
          {/* Show tab navigation only when not in travel mode */}
          {!travelMode && (
            <div className="tab-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={'tab-btn ' + (activeTab === tab.id ? 'active' : '') + (tab.id === 'mail' && hasNewMail ? ' new-mail' : '')}
                  onClick={() => {
                    // Disable lodge and clubs tabs if not enabled
                    if ((tab.id === 'lodge' && !lodgeEnabled) || (tab.id === 'clubs' && !clubsEnabled)) return
                    setActiveTab(tab.id)
                    // Clear new mail flag when user opens mail tab
                    if (tab.id === 'mail') {
                      setHasNewMail(false)
                    }
                  }}
                  disabled={(tab.id === 'lodge' && !lodgeEnabled) || (tab.id === 'clubs' && !clubsEnabled)}
                  title={getTabLabel(tab.id)}
                >
                  {tab.id === 'character' && character ? (
                    <img src={character.image} alt="character" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    tab.label
                  )}
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
                friends={friends}
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
