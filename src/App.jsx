import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Context
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { GameHeaderProvider, useGameHeader } from './contexts/GameHeaderContext'

// Pages
import SplashScreen from './pages/SplashScreen'
import MainMenu from './pages/MainMenu'
import HowToPlay from './pages/HowToPlay'
import NewGame from './pages/NewGame'
import GameScreen from './pages/GameScreen'
import GameOverScreen from './pages/GameOverScreen'

function AppContent() {
  const location = useLocation()
  const isGameScreen = location.pathname === '/game'
  const { t } = useLanguage()
  const { gameHeaderInfo } = useGameHeader()
  
  const handleBack = () => {
    window.history.back()
  }
  
  const handleNextMonth = () => {
    window.dispatchEvent(new CustomEvent('nextMonth'))
  }
  
  return (
    <div className="app-container">
      <header className="header">
        {isGameScreen && gameHeaderInfo ? (
          <div className="game-header-info">
            <div className="header-money">{gameHeaderInfo.money}</div>
            <img src="/images/logo_horiz.png" alt="Pizza Wars" className="header-logo" />
            <div className="header-location-date">
              <div className="header-location">{gameHeaderInfo.location}</div>
              <div className="header-date">{gameHeaderInfo.date}</div>
            </div>
          </div>
        ) : (
          <img src="/images/logo_horiz.png" alt="Pizza Wars" className="header-logo" />
        )}
      </header>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route path="/newgame" element={<NewGame />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/gameover" element={<GameOverScreen />} />
        </Routes>
      </main>
      
      {isGameScreen ? (
        <div className="game-footer">
          <button className="footer-btn back-btn" onClick={handleBack}>
            {t('back')}
          </button>
          <button className="footer-btn next-btn" onClick={handleNextMonth}>
            {t('nextMonth')} →
          </button>
        </div>
      ) : (
        <footer className="footer">
          <p>{t('footer')}</p>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <GameHeaderProvider>
          <AppContent />
        </GameHeaderProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
