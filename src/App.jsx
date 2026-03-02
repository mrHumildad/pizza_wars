import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Context
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

// Pages
import SplashScreen from './pages/SplashScreen'
import MainMenu from './pages/MainMenu'
import NewGame from './pages/NewGame'
import GameScreen from './pages/GameScreen'
import GameOverScreen from './pages/GameOverScreen'

function AppContent() {
  const location = useLocation()
  const isGameScreen = location.pathname === '/game'
  const { t } = useLanguage()
  
  const handleBack = () => {
    window.history.back()
  }
  
  const handleNextMonth = () => {
    window.dispatchEvent(new CustomEvent('nextMonth'))
  }
  
  return (
    <div className="app-container">
      <header className="header">
        <h1>{t('pizzaWars')}</h1>
      </header>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/menu" element={<MainMenu />} />
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
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
