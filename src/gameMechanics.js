// Game Mechanics - Price calculation and market functions

// Get product ID from name (case-insensitive)
function getProductIdByName(products, productName) {
  if (!productName) return null
  const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase())
  return product ? product.id : null
}

// Generate available products for a location
// If friend is at this location, their favourite product is always available
// The special product is always available at its location
// Random 50-100% of other products are available
function generateAvailableProducts(placeId, products, friend, places, previousSpecial = null) {
  // Find the place name for this placeId
  const place = places.find(p => p.id === placeId)
  const currentPlaceName = place ? place.name : null
  
  // Determine how many products to make available (50% to 100%)
  const totalProducts = products.length
  const numAvailable = Math.floor(Math.random() * (totalProducts / 2 + 1)) + Math.ceil(totalProducts / 2)
  
  // Start with available IDs array
  const availableIds = []
  
  // Check if friend is at this location - if so, add their favourite product
  if (friend && friend.location && friend.location === currentPlaceName) {
    const friendFavId = getProductIdByName(products, friend.favProduct)
    if (friendFavId) {
      availableIds.push(friendFavId)
    }
  }
  
  // Check if there's a special at this location - ensure it's always available
  if (previousSpecial && previousSpecial.placeId === placeId) {
    if (!availableIds.includes(previousSpecial.productId)) {
      availableIds.push(previousSpecial.productId)
    }
  }
  
  // Get all product IDs
  const allProductIds = products.map(p => p.id)
  
  // Shuffle all products
  const shuffledIds = [...allProductIds].sort(() => Math.random() - 0.5)
  
  // Add products until we reach numAvailable
  for (const id of shuffledIds) {
    if (availableIds.length >= numAvailable) break
    if (!availableIds.includes(id)) {
      availableIds.push(id)
    }
  }
  
  return availableIds
}

// Calculate random price within range
function calculatePrice(minPrice, maxPrice) {
  return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
}

// Generate a random special modifier for next turn
// Can be multiplier (>1, green) or divider (<1, red)
export function generateSpecialModifier(places, products) {
  const randomPlaceIndex = Math.floor(Math.random() * places.length)
  const randomPlace = places[randomPlaceIndex]
  const randomProductIndex = Math.floor(Math.random() * products.length)
  const randomProduct = products[randomProductIndex]
  
  // 50% chance for multiplier (1.5-3.0) or divider (0.3-0.7)
  const isMultiplier = Math.random() > 0.5
  
  let value
  if (isMultiplier) {
    value = (Math.floor(Math.random() * 150) + 150) / 100 // 1.50-3.00
  } else {
    value = (Math.floor(Math.random() * 40) + 30) / 100 // 0.30-0.70
  }
  
  const special = {
    placeId: randomPlace.id,
    productId: randomProduct.id,
    value: value,
    isMultiplier: isMultiplier,
    locationName: randomPlace.name,
    productName: randomProduct.name
  }
  
  console.log('NEXT SPECIAL:', special)
  
  return special
}

// Generate prices for all items at all locations (Turn 1 - no special)
export function generateLocationPrices(places, products, friend = null) {
  const locationPrices = {}
  const locationAvailability = {}
  
  places.forEach((place) => {
    locationPrices[place.id] = {}
    locationAvailability[place.id] = {}
    
    // Generate available products for this location (no special on turn 1)
    const availableProductIds = generateAvailableProducts(place.id, products, friend, places, null)
    locationAvailability[place.id] = availableProductIds
    
    products.forEach((product) => {
      const isAvailable = availableProductIds.includes(product.id)
      
      locationPrices[place.id][product.id] = {
        productId: product.id,
        productName: product.name,
        price: isAvailable ? calculatePrice(product.minPrice, product.maxPrice) : 0,
        isSpecial: false,
        specialValue: null,
        isAvailable: isAvailable
      }
    })
  })
  
  return { prices: locationPrices, availability: locationAvailability }
}

// Generate prices for new turn with special applied
// Also generates next turn's special
export function advanceAllPrices(places, products, currentLocationPrices, previousSpecial = null, friend = null) {
  const newPrices = {}
  const newAvailability = {}
  
  // Generate next special for following turn
  const nextSpecial = generateSpecialModifier(places, products)
  
  places.forEach((place) => {
    newPrices[place.id] = {}
    
    // Generate available products for this location (previousSpecial affects current turn)
    const availableProductIds = generateAvailableProducts(place.id, products, friend, places, previousSpecial)
    newAvailability[place.id] = availableProductIds
    
    products.forEach((product) => {
      const isAvailable = availableProductIds.includes(product.id)
      
      // Calculate new base price (only if available)
      const basePrice = isAvailable ? calculatePrice(product.minPrice, product.maxPrice) : 0
      
      // Check if previous special applies to this place/product
      const isSpecial = previousSpecial && 
                       place.id === previousSpecial.placeId && 
                       product.id === previousSpecial.productId
      
      // Apply special to current price
      let finalPrice = basePrice
      if (isSpecial && isAvailable) {
        if (previousSpecial.isMultiplier) {
          finalPrice = Math.floor(basePrice * previousSpecial.value)
        } else {
          finalPrice = Math.floor(basePrice * previousSpecial.value)
        }
      }
      
      newPrices[place.id][product.id] = {
        productId: product.id,
        productName: product.name,
        price: finalPrice,
        isSpecial: isSpecial,
        specialValue: isSpecial ? previousSpecial.value : null,
        isDivider: isSpecial ? !previousSpecial.isMultiplier : null,
        isAvailable: isAvailable
      }
      
      if (isSpecial && isAvailable) {
        const tag = previousSpecial.isMultiplier ? 'x' : '/'
        console.log('APPLIED: ' + place.name + ' - ' + product.name + ': ' + basePrice + ' ' + tag + ' ' + previousSpecial.value.toFixed(2) + ' = ' + finalPrice + ' (' + (previousSpecial.isMultiplier ? 'GREEN' : 'RED') + ')')
      }
    })
  })
  
  return { prices: newPrices, availability: newAvailability, nextSpecial: nextSpecial }
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
export function updateInventorySell(inventory, productId, quantity) {
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
