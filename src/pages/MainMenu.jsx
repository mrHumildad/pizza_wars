import { useNavigate } from 'react-router-dom'

function MainMenu() {
  const navigate = useNavigate()
  
  return (
    <div className="main-menu">
      <div className="menu-logo">
        <h1>🍕</h1>
        <h2>PIZZA WARS</h2>
      </div>
      
      <div className="menu-buttons">
        <button 
          className="menu-button primary"
          onClick={() => navigate('/newgame')}
        >
          NEW GAME
        </button>
        
        <button 
          className="menu-button secondary"
          onClick={() => alert('Load Game - Coming soon!')}
        >
          LOAD GAME
        </button>
        
        <button className="menu-button secondary">
          HOW TO PLAY
        </button>
      </div>
    </div>
  )
}

export default MainMenu
