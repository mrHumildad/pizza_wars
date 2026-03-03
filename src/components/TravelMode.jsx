import { useLanguage } from '../contexts/LanguageContext'
import { places } from '../logics/places'

// Format number with dot as thousands separator (no decimals)
function formatWithDots(num) {
  const rounded = Math.floor(num).toString()
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Format money like "666 $"
function formatMoney(money) {
  return formatWithDots(money) + ' $'
}

export default function TravelMode({ 
  currentPlaceId, 
  fuelCost, 
  money, 
  onTravel,
  friend 
}) {
  const { t } = useLanguage()
  const currentPlace = places.find(p => p.id === currentPlaceId)
  const availablePlaces = places.filter(p => p.id !== currentPlaceId)
  
  // Product emoji icons
  const productIcons = {
    'Pizza': '🍕',
    'Hot Dog': '🌭',
    'Cheese': '🧀',
    'Pasta': '🍝',
    'Ice Cream': '🍦',
    'Walnut': '🥜'
  }
  
  // Get friend's favourite icon for a location
  const getFriendFavIcon = (placeName) => {
    if (friend && friend.location === placeName && friend.favProduct) {
      return productIcons[friend.favProduct] || null
    }
    return null
  }
  
  return (
    <div className="travel-mode">
      <div className="destinations-grid">
        {/* STAY option - show current place image and name */}
        <button 
          className="destination-card stay-card"
          onClick={() => onTravel(null, 0)}
          style={{ backgroundImage: `url(${currentPlace?.image})` }}
        >
          <div className="destination-overlay"></div>
          <div className="destination-name">{currentPlace?.name}</div>
          {getFriendFavIcon(currentPlace?.name) && (
            <div className="friend-fav-icon">{getFriendFavIcon(currentPlace?.name)}</div>
          )}
          <div className="destination-details">{t('stayThisMonth')}</div>
          <div className="destination-price free">{t('free')}</div>
        </button>
        
        {/* Other 5 places - travel and advance month */}
        {availablePlaces.map((place) => {
          const canAfford = money >= fuelCost
          const friendIcon = getFriendFavIcon(place.name)
          
          return (
            <button 
              key={place.id}
              className="destination-card"
              disabled={!canAfford}
              onClick={() => onTravel(place.id, fuelCost)}
              style={{ backgroundImage: `url(${place.image})` }}
            >
              <div className="destination-overlay"></div>
              <div className="destination-name">{place.name}</div>
              {friendIcon && (
                <div className="friend-fav-icon">{friendIcon}</div>
              )}
              <div className="destination-price">{formatMoney(fuelCost)}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
