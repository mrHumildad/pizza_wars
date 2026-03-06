import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const SAVE_KEY = 'pizzaWarsSave'

function MainMenu() {
  const navigate = useNavigate()
  const { language, t, toggleLanguage } = useLanguage()
  
  // Check if there's a saved game
  const hasSavedGame = () => {
    const saved = localStorage.getItem(SAVE_KEY)
    return saved !== null
  }
  
  const handleLoadGame = () => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const gameState = JSON.parse(saved)
        // Navigate to game with saved state
        navigate('/game', { state: gameState })
      } catch (e) {
        console.error('Failed to load game:', e)
        alert(t('saveCorrupted') || 'Save file is corrupted')
      }
    }
  }
  
  return (
    <div className="main-menu">
      <div className="language-toggle-container">
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => language !== 'en' && toggleLanguage()}
        >
          EN
        </button>
        <button 
          className={`lang-btn ${language === 'es' ? 'active' : ''}`}
          onClick={() => language !== 'es' && toggleLanguage()}
        >
          ES
        </button>
      </div>
      
      <div className="menu-buttons">
        <button 
          className="menu-button primary"
          onClick={() => navigate('/newgame')}
        >
          {t('newGame')}
        </button>
        
        <button 
          className="menu-button secondary"
          onClick={handleLoadGame}
          disabled={!hasSavedGame()}
        >
          {t('loadGame')}
        </button>
        
        <button 
          className="menu-button secondary"
          onClick={() => navigate('/howtoplay')}
        >
          {t('howToPlay')}
        </button>
      </div>
    </div>
  )
}

export default MainMenu
