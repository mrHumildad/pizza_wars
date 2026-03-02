import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Pages
import SplashScreen from './pages/SplashScreen'
import MainMenu from './pages/MainMenu'
import NewGame from './pages/NewGame'
import GameScreen from './pages/GameScreen'
import GameOverScreen from './pages/GameOverScreen'

function AppContent() {
  const location = useLocation()
  const isGameScreen = location.pathname === '/game'
  
  const handleBack = () => {
    window.history.back()
  }
  
  const handleNextMonth = () => {
    window.dispatchEvent(new CustomEvent('nextMonth'))
  }
  
  return (
    <div className="app-container">
      <header className="header">
        <h1>Pizza Wars</h1>
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
            ← BACK
          </button>
          <button className="footer-btn next-btn" onClick={handleNextMonth}>
            NEXT MONTH →
          </button>
        </div>
      ) : (
        <footer className="footer">
          <p>© 2026 Pizza Wars</p>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
