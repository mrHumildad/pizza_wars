import { useLanguage } from '../../contexts/LanguageContext'
import { products } from '../../logics/products'

// Format number with dot as thousands separator (no decimals)
function formatWithDots(num) {
  const rounded = Math.floor(num).toString()
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Format money like "666 $"
function formatMoney(money) {
  return formatWithDots(money) + ' $'
}

// Get total items in inventory
function getTotalItems(inventory) {
  return Object.values(inventory).reduce((sum, item) => sum + item.quantityOwned, 0)
}

export default function MarketTab({ 
  locationPrices, 
  locationAvailability,
  inventory, 
  money, 
  onBuy, 
  onSell,
  locationId,
  planeCapacity 
}) {
  const { t } = useLanguage()
  const locationProducts = locationPrices[locationId] || {}
  const availableProducts = locationAvailability[locationId] || []
  
  // Product emoji icons
  const productIcons = {
    'Pizza': '🍕',
    'Hot Dog': '🌭',
    'Cheese': '🧀',
    'Pasta': '🍝',
    'Ice Cream': '🍦',
    'Walnut': '🥜'
  }
  
  // Filter products to only show available ones
  const availableProductIds = availableProducts.map(id => Number(id))
  
  const totalItems = getTotalItems(inventory)
  
  return (
    <div className="tab-content market-tab">
      <div className="market-header">
        <span>{t('colItem')}</span>
        <span>{t('colOwned')}</span>
        <span>{t('colPrice')}</span>
        <span>{t('colAction')}</span>
        <span>{t('colAvgBuy')}</span>
      </div>
      
      {products.filter(product => availableProductIds.includes(product.id)).map((product) => {
        const priceData = locationProducts[product.id] || {}
        const invItem = inventory[product.id] || {}
        const price = priceData.price || 0
        const owned = invItem.quantityOwned || 0
        const avgBuyPrice = invItem.averageBuyPrice || 0
        const availableSpace = planeCapacity - totalItems
        const maxBuy = price > 0 ? Math.min(Math.floor(money / price), availableSpace) : 0
        const isSpecial = priceData.isSpecial || false
        const isDivider = priceData.isDivider || false
        const priceClass = isSpecial ? (isDivider ? 'price-special is-divider' : 'price-special') : ''
        
        return (
          <div key={product.id} className="market-row">
            <span className="item-name">{productIcons[product.name] || product.name}</span>
            <span className="item-owned">{owned}</span>
            <span className={`item-price ${priceClass}`}>{formatMoney(price)}</span>
            <div className="item-actions">
              <div className="action-group">
                <button 
                  className="action-btn buy-btn"
                  disabled={maxBuy === 0}
                  onClick={() => {
                    onBuy(product.id, 1, price)
                  }}
                >
                  {t('btnBuy')}
                </button>
              </div>
              <div className="action-group">
                <button 
                  className="action-btn sell-btn"
                  disabled={owned === 0}
                  onClick={() => {
                    onSell(product.id, 1, price)
                  }}
                >
                  {t('btnSell')}
                </button>
              </div>
            </div>
            <span className="item-avg">{avgBuyPrice > 0 ? formatMoney(avgBuyPrice) : '-'}</span>
          </div>
        )
      })}
      
      <div className="capacity-info">
        {t('labelCapacity')}: {totalItems} / {planeCapacity}
      </div>
    </div>
  )
}
