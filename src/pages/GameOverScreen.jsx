import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function GameOverScreen() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1>{t('gameOver')}</h1>
        
        <div className="final-score">
          <span>{t('finalScore')}</span>
          <span className="score-value">0</span>
        </div>
        
        <div className="game-over-buttons">
          <button 
            className="menu-button primary"
            onClick={() => navigate('/game')}
          >
            {t('playAgain')}
          </button>
          
          <button 
            className="menu-button secondary"
            onClick={() => navigate('/menu')}
          >
            {t('mainMenu')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
