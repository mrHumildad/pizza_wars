// Game Mechanics - Price calculation and market functions

// Calculate random price within range
function calculatePrice(minPrice, maxPrice) {
  return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
}

// Generate prices for all items at a specific location
export function generateLocationPrices(places, products) {
  const locationPrices = {}
  
  places.forEach((place) => {
    locationPrices[place.id] = {}
    
    products.forEach((product) => {
      const currentPrice = calculatePrice(product.minPrice, product.maxPrice)
      const nextPrice = calculatePrice(product.minPrice, product.maxPrice)
      
      locationPrices[place.id][product.id] = {
        productId: product.id,
        productName: product.name,
        currentPrice,
        nextPrice,
        priceChange: nextPrice - currentPrice
      }
    })
  })
  
  return locationPrices
}

// Calculate prices for next turn (for one location)
export function advanceTurnPrices(products, currentPrices) {
  const newPrices = {}
  
  Object.keys(currentPrices).forEach((productId) => {
    const product = products.find((p) => p.id === parseInt(productId))
    const currentPrice = currentPrices[productId].currentPrice
    const nextPrice = calculatePrice(product.minPrice, product.maxPrice)
    
    newPrices[productId] = {
      productId: parseInt(productId),
      productName: product.name,
      currentPrice: nextPrice,
      nextPrice: calculatePrice(product.minPrice, product.maxPrice),
      priceChange: calculatePrice(product.minPrice, product.maxPrice) - nextPrice
    }
  })
  
  return newPrices
}

// Advance prices for ALL places and log to console
export function advanceAllPrices(places, products, currentLocationPrices) {
  // Create fresh prices object for all places
  const newPrices = {}
  
  places.forEach((place) => {
    newPrices[place.id] = {}
    
    products.forEach((product) => {
      // Get old price for change calculation
      const oldData = currentLocationPrices[place.id]?.[product.id]
      const oldPrice = oldData ? oldData.currentPrice : calculatePrice(product.minPrice, product.maxPrice)
      
      // Generate new current price for this turn
      const newCurrentPrice = calculatePrice(product.minPrice, product.maxPrice)
      // Generate next turn's price
      const newNextPrice = calculatePrice(product.minPrice, product.maxPrice)
      
      newPrices[place.id][product.id] = {
        productId: product.id,
        productName: product.name,
        currentPrice: newCurrentPrice,
        nextPrice: newNextPrice,
        priceChange: newCurrentPrice - oldPrice
      }
    })
  })
  
  // Log prices for all places
  console.log('='.repeat(60))
  console.log('NEW TURN - PRICES FOR ALL PLACES')
  console.log('Location ID being used in MarketTab:', places[0]?.id)
  console.log('='.repeat(60))
  
  places.forEach((place) => {
    console.log(`\n📍 ${place.name} (id: ${place.id}):`)
    console.log('-'.repeat(40))
    
    products.forEach((product) => {
      const priceData = newPrices[place.id][product.id]
      const changeSymbol = priceData.priceChange > 0 ? '↑' : priceData.priceChange < 0 ? '↓' : '→'
      const changeValue = priceData.priceChange > 0 ? `+${priceData.priceChange}` : priceData.priceChange
      console.log(`  ${product.name}: ${priceData.currentPrice} $ (${changeSymbol} ${changeValue} $)`)
    })
  })
  
  console.log('='.repeat(60))
  
  return newPrices
}

// Buy items
export function buyItem(currentMoney, item, quantity, price) {
  const totalCost = price * quantity
  
  if (totalCost > currentMoney) {
    return { success: false, message: 'Not enough money!' }
  }
  
  return {
    success: true,
    newMoney: currentMoney - totalCost,
    quantityBought: quantity,
    totalCost
  }
}

// Sell items
export function sellItem(item, quantity, price) {
  if (quantity > item.quantityOwned) {
    return { success: false, message: 'Not enough items to sell!' }
  }
  
  return {
    success: true,
    revenue: price * quantity,
    quantitySold: quantity
  }
}

// Initialize player inventory
export function initializeInventory(products) {
  const inventory = {}
  
  products.forEach((product) => {
    inventory[product.id] = {
      productId: product.id,
      productName: product.name,
      quantityOwned: 0,
      averageBuyPrice: 0,
      totalSpent: 0
    }
  })
  
  return inventory
}

// Update inventory after purchase
export function updateInventoryBuy(inventory, productId, quantity, price) {
  const item = inventory[productId]
  const newTotalSpent = item.totalSpent + (price * quantity)
  const newQuantity = item.quantityOwned + quantity
  const newAveragePrice = newTotalSpent / newQuantity
  
  return {
    ...inventory,
    [productId]: {
      ...item,
      quantityOwned: newQuantity,
      averageBuyPrice: newAveragePrice,
      totalSpent: newTotalSpent
    }
  }
}

// Update inventory after sale
export function updateInventorySell(inventory, productId, quantity, price) {
  const item = inventory[productId]
  const newQuantity = item.quantityOwned - quantity
  
  // Reset average buy price when all items are sold
  const newAveragePrice = newQuantity === 0 ? 0 : item.averageBuyPrice
  
  return {
    ...inventory,
    [productId]: {
      ...item,
      quantityOwned: newQuantity,
      averageBuyPrice: newAveragePrice
    }
  }
}
