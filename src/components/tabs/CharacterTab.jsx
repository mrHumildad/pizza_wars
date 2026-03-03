import { useLanguage } from '../../contexts/LanguageContext'

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

// Generate grade pyramid HTML based on grade level (33 rows total)
const MAX_GRADE = 33

function getGradePyramid(grade) {
  const rows = []
  // Generate 33 rows from smallest (top) to largest (bottom)
  for (let i = 1; i <= MAX_GRADE; i++) {
    // Calculate padding for centering
    const maxWidth = MAX_GRADE
    const currentWidth = i
    const padding = ' '.repeat((maxWidth - currentWidth) / 2)
    
    // Fill from the base (bottom) - rows at or below (MAX_GRADE - grade + 1) are filled
    const fillStartRow = MAX_GRADE - grade + 1
    
    if (i >= fillStartRow) {
      const blocks = '█'.repeat(i)
      rows.push(<div key={i} className="pyramid-row filled">{padding}{blocks}{padding}</div>)
    } else {
      const emptyBlocks = '░'.repeat(i)
      rows.push(<div key={i} className="pyramid-row empty">{padding}{emptyBlocks}{padding}</div>)
    }
  }
  return rows
}

export default function CharacterTab({ character, playerName, inventory, currentPlane, grade, friend }) {
  const { t } = useLanguage()
  const totalItems = getTotalItems(inventory)
  const totalValue = Object.values(inventory).reduce((sum, item) => 
    sum + (item.quantityOwned * item.averageBuyPrice), 0
  )
  
  return (
    <div className="tab-content">
      <h3>{t('characterInfo')}</h3>
      <div className="character-info">
        <p><strong>{t('labelName')}:</strong> {playerName}</p>
        {character && (
          <>
            <p><strong>{t('labelCharacter')}:</strong> {character.name}</p>
            <div className="character-preview">
              <img src={character.image} alt={character.name} />
            </div>
          </>
        )}
        <hr />
        {friend && (
          <>
            <p><strong>Friend:</strong> {friend.name}</p>
            <p><strong>Location:</strong> {friend.location}</p>
            <p><strong>Description:</strong> {friend.description}</p>
            <p><strong>Favorite Product:</strong> {friend.favProduct}</p>
            <hr />
          </>
        )}
        <p><strong>{t('labelCurrentGrade')}:</strong> {grade}</p>
        <div className="grade-pyramid">
          {getGradePyramid(grade)}
        </div>
        <p><strong>{t('labelCurrentPlane')}:</strong> {currentPlane.name} ({t('labelCapacity')}: {currentPlane.capacity})</p>
        <p><strong>{t('labelTotalItems')}:</strong> {totalItems} / {currentPlane.capacity}</p>
        <p><strong>{t('labelInventoryValue')}:</strong> {formatMoney(totalValue)}</p>
      </div>
    </div>
  )
}
