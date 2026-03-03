import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function MainMenu() {
  const navigate = useNavigate()
  const { language, t, toggleLanguage } = useLanguage()
  
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
          onClick={() => alert(t('comingSoon'))}
        >
          {t('loadGame')}
        </button>
        
        <button className="menu-button secondary">
          {t('howToPlay')}
        </button>
      </div>
    </div>
  )
}

export default MainMenu
