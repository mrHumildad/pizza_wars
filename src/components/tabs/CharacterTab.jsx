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

export default function CharacterTab({ character, playerName, inventory, currentPlane }) {
  const totalItems = getTotalItems(inventory)
  const totalValue = Object.values(inventory).reduce((sum, item) => 
    sum + (item.quantityOwned * item.averageBuyPrice), 0
  )
  
  return (
    <div className="tab-content">
      <h3>Character Info</h3>
      <div className="character-info">
        <p><strong>Name:</strong> {playerName}</p>
        {character && (
          <>
            <p><strong>Character:</strong> {character.name}</p>
            <div className="character-preview">
              <img src={character.image} alt={character.name} />
            </div>
          </>
        )}
        <hr />
        <p><strong>Current Plane:</strong> {currentPlane.name} (capacity: {currentPlane.capacity})</p>
        <p><strong>Total Items:</strong> {totalItems} / {currentPlane.capacity}</p>
        <p><strong>Inventory Value:</strong> {formatMoney(totalValue)}</p>
      </div>
    </div>
  )
}
