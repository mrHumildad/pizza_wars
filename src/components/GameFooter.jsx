import { useLanguage } from '../contexts/LanguageContext'

function GameFooter({ 
  onBack, 
  onSelectDestination,
  onConfirm,
  currentPlaceId,
  places,
  fuelCost,
  money,
  selectedDestination,
  travelMode,
  confirmText
}) {
  const { t } = useLanguage()
  
  return (
    <div className="game-footer">
      <button className="footer-btn back-btn" onClick={onBack}>
        {t('back')}
      </button>

      <button 
        className="footer-btn next-btn"
        disabled={selectedDestination === undefined}
        onClick={onConfirm}
      >
        {confirmText || t('goBtn')}
      </button>
    </div>
  )
}

export default GameFooter
