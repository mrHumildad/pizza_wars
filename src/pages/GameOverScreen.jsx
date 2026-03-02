import { useNavigate } from 'react-router-dom'

function GameOverScreen() {
  const navigate = useNavigate()
  
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1>GAME OVER</h1>
        
        <div className="final-score">
          <span>FINAL SCORE</span>
          <span className="score-value">0</span>
        </div>
        
        <div className="game-over-buttons">
          <button 
            className="menu-button primary"
            onClick={() => navigate('/game')}
          >
            PLAY AGAIN
          </button>
          
          <button 
            className="menu-button secondary"
            onClick={() => navigate('/menu')}
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
