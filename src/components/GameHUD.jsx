function GameHUD({ money, date, location, onLocationClick }) {
  return (
    <div className="game-header">
      <div className="game-stat">
        <span>💰 MONEY</span>
        <span className="stat-value">{money}</span>
      </div>
      <div className="game-stat location-stat">
        <span 
          className="location-value clickable"
          onClick={onLocationClick}
          title="Click to view location details"
        >
          {location}
        </span>
      </div>
      <div className="game-stat">
        <span>📅 DATE</span>
        <span className="stat-value date-value">{date}</span>
      </div>
    </div>
  )
}

export default GameHUD
