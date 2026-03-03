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
        <span>{t('colAvgBuy')}</span>
        <span>{t('colAction')}</span>
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
            <span className="item-avg">{avgBuyPrice > 0 ? formatMoney(avgBuyPrice) : '-'}</span>
            <div className="item-actions">
              <div className="action-group">
                <input 
                  type="number" 
                  min="1" 
                  max={maxBuy} 
                  defaultValue="1"
                  className="quantity-input"
                  id={'buy-' + product.id}
                />
                <button 
                  className="action-btn buy-btn"
                  disabled={maxBuy === 0}
                  onClick={() => {
                    const qty = parseInt(document.getElementById('buy-' + product.id).value) || 1
                    onBuy(product.id, qty, price)
                  }}
                >
                  {t('btnBuy')}
                </button>
              </div>
              <div className="action-group">
                <input 
                  type="number" 
                  min="1" 
                  max={owned} 
                  defaultValue="1"
                  className="quantity-input"
                  id={'sell-' + product.id}
                />
                <button 
                  className="action-btn sell-btn"
                  disabled={owned === 0}
                  onClick={() => {
                    const qty = parseInt(document.getElementById('sell-' + product.id).value) || 1
                    onSell(product.id, qty, price)
                  }}
                >
                  {t('btnSell')}
                </button>
              </div>
            </div>
          </div>
        )
      })}
      
      <div className="capacity-info">
        {t('labelCapacity')}: {totalItems} / {planeCapacity}
      </div>
    </div>
  )
}
