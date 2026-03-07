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
  friends 
}) {
  console.log('TravelMode friends:', friends)
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
  
  // Get all friends' favourite icons for a location
  const getFriendsFavIcons = (placeName) => {
    if (!friends || friends.length === 0) return []
    return friends
      .filter(friend => friend.location === placeName && friend.favProduct)
      .map(friend => ({
        icon: productIcons[friend.favProduct] || null,
        name: friend.firstName || friend.name
      }))
      .filter(item => item.icon)
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
          {getFriendsFavIcons(currentPlace?.name).map((item, index) => (
            <div key={index} className="friend-fav-icon" title={item.name}>{item.icon}</div>
          ))}
          <div className="destination-details">{t('stayThisMonth')}</div>
          <div className="destination-price free">{t('free')}</div>
        </button>
        
        {/* Other 5 places - travel and advance month */}
        {availablePlaces.map((place) => {
          const canAfford = money >= fuelCost
          const friendIcons = getFriendsFavIcons(place.name)
          
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
              {friendIcons.map((item, index) => (
                <div key={index} className="friend-fav-icon" title={item.name}>{item.icon}</div>
              ))}
              <div className="destination-price">{formatMoney(fuelCost)}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
