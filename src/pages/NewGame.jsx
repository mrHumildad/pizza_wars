import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { places } from '../logics/places'

const characters = [
  { id: 1, name: 'Hat', image: '/images/characters/hat.jpg' },
  { id: 2, name: 'Hoe', image: '/images/characters/hoe.jpg' },
  { id: 3, name: 'Punk', image: '/images/characters/punk.jpg' },
  { id: 4, name: 'Tourist', image: '/images/characters/tourist.jpg' },
]

function NewGame() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0)
  
  const currentCharacter = characters[currentCharacterIndex]
  const currentPlace = places[currentPlaceIndex]
  
  const handlePrevCharacter = () => {
    setCurrentCharacterIndex((prev) => 
      prev === 0 ? characters.length - 1 : prev - 1
    )
  }
  
  const handleNextCharacter = () => {
    setCurrentCharacterIndex((prev) => 
      prev === characters.length - 1 ? 0 : prev + 1
    )
  }
  
  const handlePrevPlace = () => {
    setCurrentPlaceIndex((prev) => 
      prev === 0 ? places.length - 1 : prev - 1
    )
  }
  
  const handleNextPlace = () => {
    setCurrentPlaceIndex((prev) => 
      prev === places.length - 1 ? 0 : prev + 1
    )
  }
  
  const handleStartGame = () => {
    if (!playerName) {
      alert('Please enter your name!')
      return
    }
    navigate('/game', { 
      state: { 
        playerName, 
        character: currentCharacter,
        startingPlace: currentPlace 
      } 
    })
  }
  
  return (
    <div className="new-game-screen">
      
      <div className="new-game-form">
        {/* Player Name */}
        <div className="form-section">
          <label>ENTER YOUR NAME</label>
          <input 
            type="text" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name..."
            maxLength={20}
          />
        </div>
        
        {/* Character Selection - Single Image */}
        <div className="form-section">
          <div className="character-carousel">
            <button className="carousel-btn" onClick={handlePrevCharacter}>
              ‹
            </button>
            <div className="character-display">
              <img src={currentCharacter.image} alt="Character" />
            </div>
            <button className="carousel-btn" onClick={handleNextCharacter}>
              ›
            </button>
          </div>
        </div>
        
        {/* Place Selection - Single Image */}
        <div className="form-section">
          <label>SELECT STARTING PLACE</label>
          <div className="character-carousel">
            <button className="carousel-btn" onClick={handlePrevPlace}>
              ‹
            </button>
            <div className="place-container">
              <div className="character-display place-display">
                <img src={currentPlace.image} alt="Place" />
              </div>
              <span className="place-name-label">{currentPlace.name}</span>
            </div>
            <button className="carousel-btn" onClick={handleNextPlace}>
              ›
            </button>
          </div>
        </div>
        
        {/* Start Button */}
        <button 
          className="menu-button primary start-button"
          onClick={handleStartGame}
        >
          START GAME
        </button>
      </div>
    </div>
  )
}

export default NewGame
