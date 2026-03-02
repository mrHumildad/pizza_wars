import { useLanguage } from '../../contexts/LanguageContext'
import { planes } from '../../logics/planes'

// Format number with dot as thousands separator (no decimals)
function formatWithDots(num) {
  const rounded = Math.floor(num).toString()
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Format money like "666 $"
function formatMoney(money) {
  return formatWithDots(money) + ' $'
}

export default function HangarTab({ 
  money, 
  currentPlane, 
  onBuyPlane 
}) {
  const { t } = useLanguage()
  
  return (
    <div className="tab-content hangar-tab">
      <h3>{t('availablePlanes')}</h3>
      <div className="planes-list">
        {planes.map((plane) => {
          const isCurrentPlane = plane.id === currentPlane.id
          const canAfford = money >= plane.price
          
          return (
            <div key={plane.id} className={'plane-card ' + (isCurrentPlane ? 'current' : '')}>
              <div className="plane-name">{plane.name}</div>
              <div className="plane-details">
                <span>{t('labelType')}: {plane.type}</span>
                <span>{t('labelCapacity')}: {plane.capacity}</span>
                <span>{t('labelSpeed')}: {plane.speed}</span>
                <span>{t('labelRange')}: {plane.range}</span>
                <span>{t('labelFuel')}: {formatMoney(plane.fuelCost)}</span>
              </div>
              <div className="plane-price">
                {isCurrentPlane ? (
                  <span className="owned-badge">{t('badgeOwned')}</span>
                ) : (
                  <button 
                    className="buy-plane-btn"
                    disabled={!canAfford}
                    onClick={() => onBuyPlane(plane)}
                  >
                    {t('btnBuyPlane')} - {formatMoney(plane.price)}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
