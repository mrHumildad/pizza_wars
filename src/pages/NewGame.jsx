import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { places } from '../logics/places'

const characters = [
  { id: 1, name: 'Hat', image: '/images/characters/hat.jpg' },
  { id: 2, name: 'Hoe', image: '/images/characters/hoe.jpg' },
  { id: 3, name: 'Punk', image: '/images/characters/punk.jpg' },
  { id: 4, name: 'Tourist', image: '/images/characters/tourist.jpg' },
]

function NewGame() {
  const navigate = useNavigate()
  const { t } = useLanguage()
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
      alert(t('pleaseEnterName'))
      return
    }
    
    // Select a random NPC from the starting place's NPCs as a friend
    const randomNpcIndex = Math.floor(Math.random() * currentPlace.npcs.length)
    const selectedNpc = currentPlace.npcs[randomNpcIndex]
    
    // Add location info to the friend
    const friendWithLocation = {
      ...selectedNpc,
      location: currentPlace.name
    }
    
    navigate('/game', { 
      state: { 
        playerName, 
        character: currentCharacter,
        startingPlace: currentPlace,
        friend: friendWithLocation
      } 
    })
  }
  
  return (
    <div className="new-game-screen">
      <div className="language-toggle-container" style={{position: 'absolute', top: 10, right: 10}}>
        <button 
          className="lang-btn"
          onClick={() => {
            const currentLang = localStorage.getItem('pizzaWarsLanguage')
            if (currentLang !== 'en') {
              localStorage.setItem('pizzaWarsLanguage', 'en')
              window.location.reload()
            }
          }}
        >
          EN
        </button>
        <button 
          className="lang-btn"
          onClick={() => {
            const currentLang = localStorage.getItem('pizzaWarsLanguage')
            if (currentLang !== 'es') {
              localStorage.setItem('pizzaWarsLanguage', 'es')
              window.location.reload()
            }
          }}
        >
          ES
        </button>
      </div>
      
      <div className="new-game-form">
        {/* Player Name */}
        <div className="form-section">
          <label>{t('enterYourName')}</label>
          <input 
            type="text" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t('yourNamePlaceholder')}
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
          <label>{t('selectStartingPlace')}</label>
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
        
        {/* Start Button 
          className="menu-button primary start-button"
          */}
        <button onClick={handleStartGame}
        >
          {t('startGame')}
        </button>
      </div>
    </div>
  )
}

export default NewGame
