function GameFooter({ 
  onBack, 
  onSelectDestination,
  onConfirm,
  currentPlaceId,
  places,
  fuelCost,
  money,
  selectedDestination,
  travelMode
}) {
  return (
    <div className="game-footer">
      <button className="footer-btn back-btn" onClick={onBack}>
        ← BACK
      </button>

      <button 
        className="footer-btn next-btn"
        disabled={selectedDestination === undefined}
        onClick={onConfirm}
      >
        {travelMode ? 'CONFIRM →' : 'GO →'}
      </button>
    </div>
  )
}

export default GameFooter
