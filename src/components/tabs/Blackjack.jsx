import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './Blackjack.css'

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const deck = []
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value })
    }
  }
  return shuffleArray(deck)
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) {
    return 10
  }
  if (card.value === 'A') {
    return 11
  }
  return parseInt(card.value)
}

function calculateScore(cards) {
  let score = 0
  let aces = 0
  
  for (const card of cards) {
    score += getCardValue(card)
    if (card.value === 'A') aces++
  }
  
  while (score > 21 && aces > 0) {
    score -= 10
    aces--
  }
  
  return score
}

const MAX_ROUNDS = 3

export default function Blackjack({ opponentName, onWin, onLose, onTie, onComplete }) {
  const { language } = useLanguage()
  const [deck, setDeck] = useState([])
  const [playerCards, setPlayerCards] = useState([])
  const [dealerCards, setDealerCards] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [playerStand, setPlayerStand] = useState(false)
  const [message, setMessage] = useState('')
  const [isDealing, setIsDealing] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  
  // Best of 3 state
  const [currentRound, setCurrentRound] = useState(1)
  const [playerWins, setPlayerWins] = useState(0)
  const [dealerWins, setDealerWins] = useState(0)
  const [seriesOver, setSeriesOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultType, setResultType] = useState(null) // 'win', 'lose', 'tie'

  const dealerPlay = (currentDealerCards, currentPlayerCards, currentDeck, roundWins, roundLosses) => {
    let dealerScore = calculateScore(currentDealerCards)
    let newDeck = [...currentDeck]
    let newDealerCards = [...currentDealerCards]
    
    const playDealer = async () => {
      while (dealerScore < 17) {
        await new Promise(resolve => setTimeout(resolve, 600))
        const card = newDeck.pop()
        newDealerCards.push(card)
        dealerScore = calculateScore(newDealerCards)
        setDealerCards([...newDealerCards])
        setDeck(newDeck)
      }
      
      setIsDealing(false)
      const playerScore = calculateScore(currentPlayerCards)
      
      let roundWinner = null // 'player', 'dealer', 'push'
      let newPlayerWins = roundWins
      let newDealerWins = roundLosses
      
      if (dealerScore > 21) {
        setMessage(language === 'es' ? '¡El dealer se pasó! ¡Ganaste! 🎉' : 'Dealer busts! You win! 🎉')
        newPlayerWins = roundWins + 1
        setPlayerWins(newPlayerWins)
        roundWinner = 'player'
      } else if (dealerScore > playerScore) {
        setMessage(language === 'es' ? 'El dealer gana 😞' : 'Dealer wins 😞')
        newDealerWins = roundLosses + 1
        setDealerWins(newDealerWins)
        roundWinner = 'dealer'
      } else if (playerScore > dealerScore) {
        setMessage(language === 'es' ? '¡Ganaste! 🎉' : 'You win! 🎉')
        newPlayerWins = roundWins + 1
        setPlayerWins(newPlayerWins)
        roundWinner = 'player'
      } else {
        setMessage(language === 'es' ? 'Empate 🤝' : 'Push 🤝')
        roundWinner = 'push'
      }
      
      setGameOver(true)
      setPlayerStand(true)
      
      // Determine callback and next action
      if (currentRound >= MAX_ROUNDS) {
        // Last round - determine series winner
        setTimeout(() => {
          let result = null
          if (newPlayerWins > newDealerWins) {
            setMessage(language === 'es' ? `¡${opponentName} es tu nuevo amigo! 🎉` : `${opponentName} is your new bestie! 🎉`)
            if (onWin) onWin()
            result = 'win'
          } else if (newDealerWins > newPlayerWins) {
            setMessage(language === 'es' ? `¡${opponentName} no quiere ser tu amigo! 😢` : `${opponentName} said "no thanks" to friendship! 😢`)
            if (onLose) onLose()
            result = 'lose'
          } else {
            setMessage(language === 'es' ? `¡Empate! ${opponentName} esta indeciso... 🤝` : `It's a tie! ${opponentName} is confused... 🤝`)
            if (onTie) onTie()
            result = 'tie'
          }
          setResultType(result)
          setShowResult(true)
          setSeriesOver(true)
        }, 1500)
      } else {
        // More rounds to go
        setTimeout(() => {
          if (roundWinner === 'player') {
            if (onWin) onWin()
          } else if (roundWinner === 'dealer') {
            if (onLose) onLose()
          } else {
            if (onTie) onTie()
          }
          startNewRound()
        }, 1500)
      }
    }
    
    playDealer()
  }

  const startNewRound = () => {
    const newDeck = createDeck()
    const player = [newDeck.pop(), newDeck.pop()]
    const dealer = [newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerCards(player)
    setDealerCards(dealer)
    setGameOver(false)
    setPlayerStand(false)
    setMessage('')
    setIsDealing(false)
    setCurrentRound(prev => prev + 1)
    setGameKey(prev => prev + 1)
    
    // Check for immediate blackjack
    const playerScore = calculateScore(player)
    if (playerScore === 21) {
      setGameOver(true)
      setPlayerStand(true)
      setTimeout(() => dealerPlay(dealer, player, newDeck, playerWins, dealerWins), 500)
    }
  }

  const startNewGame = () => {
    setCurrentRound(1)
    setPlayerWins(0)
    setDealerWins(0)
    setSeriesOver(false)
    
    const newDeck = createDeck()
    const player = [newDeck.pop(), newDeck.pop()]
    const dealer = [newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerCards(player)
    setDealerCards(dealer)
    setGameOver(false)
    setPlayerStand(false)
    setMessage('')
    setIsDealing(false)
    setGameKey(prev => prev + 1)
    
    // Check for immediate blackjack
    const playerScore = calculateScore(player)
    if (playerScore === 21) {
      setGameOver(true)
      setPlayerStand(true)
      setTimeout(() => dealerPlay(dealer, player, newDeck, 0, 0), 500)
    }
  }

  // Initialize game on mount
  useEffect(() => {
    startNewGame()
  }, [])

  const hit = () => {
    if (gameOver || deck.length === 0 || isDealing) return
    
    const newDeck = [...deck]
    const card = newDeck.pop()
    const newPlayerCards = [...playerCards, card]
    
    setDeck(newDeck)
    setPlayerCards(newPlayerCards)
    
    const playerScore = calculateScore(newPlayerCards)
    
    if (playerScore > 21) {
      setMessage(language === 'es' ? '¡Te pasaste! Pierdes 💥' : 'Bust! You lose 💥')
      setGameOver(true)
      setPlayerStand(true)
      const newDealerWins = dealerWins + 1
      setDealerWins(newDealerWins)
      
      if (currentRound >= MAX_ROUNDS) {
        setTimeout(() => {
          let result = null
          if (playerWins > newDealerWins) {
            setMessage(language === 'es' ? `¡${opponentName} es tu nuevo amigo! 🎉` : `${opponentName} is your new bestie! 🎉`)
            if (onWin) onWin()
            result = 'win'
          } else if (newDealerWins > playerWins) {
            setMessage(language === 'es' ? `¡${opponentName} no quiere ser tu amigo! 😢` : `${opponentName} said "no thanks" to friendship! 😢`)
            if (onLose) onLose()
            result = 'lose'
          } else {
            setMessage(language === 'es' ? `¡Empate! ${opponentName} esta indeciso... 🤝` : `It's a tie! ${opponentName} is confused... 🤝`)
            if (onTie) onTie()
            result = 'tie'
          }
          setResultType(result)
          setShowResult(true)
          setSeriesOver(true)
        }, 1500)
      } else {
        if (onLose) onLose()
        setTimeout(() => startNewRound(), 1500)
      }
    } else if (playerScore === 21) {
      stand(newPlayerCards, newDeck)
    }
  }

  const stand = (currentPlayerCards = playerCards, currentDeck = deck) => {
    if (gameOver || isDealing) return
    
    setPlayerStand(true)
    setIsDealing(true)
    
    // Dealer plays
    dealerPlay(dealerCards, currentPlayerCards, currentDeck, playerWins, dealerWins)
  }

  const getVisibleDealerScore = () => {
    if (playerStand) {
      return calculateScore(dealerCards)
    }
    const visibleCards = dealerCards.slice(1)
    return calculateScore(visibleCards)
  }

  const handleOkClick = () => {
    if (resultType === 'win' && onComplete) {
      onComplete(true)
    } else if (resultType === 'lose' && onComplete) {
      onComplete(false)
    } else if (onComplete) {
      onComplete(null)
    }
  }

  const renderCard = (card, index, isHidden = false) => {
    if (isHidden) {
      return <div key={index} className="card card-back"></div>
    }
    const isRed = card.suit === '♥' || card.suit === '♦'
    return (
      <div key={index} className={`card ${isRed ? 'red' : 'black'}`}>
        <span className="card-value">{card.value}</span>
        <span className="card-suit">{card.suit}</span>
      </div>
    )
  }

  return (
    <div className="blackjack-container" key={gameKey}>
      <div className="scoreboard">
        <span className="round-info">{language === 'es' ? 'Ronda:' : 'Round:'} {currentRound}/{MAX_ROUNDS}</span>
        <span className="series-score">
          {language === 'es' ? 'Tu' : 'You'}: {playerWins} | {opponentName}: {dealerWins}
        </span>
      </div>
      
      <div className="dealer-section">
        <h3>{opponentName}</h3>
        <div className="cards">
          {dealerCards.map((card, index) => 
            renderCard(card, index, index === 0 && !playerStand && !gameOver)
          )}
        </div>
        <p className="score">
          {playerStand || gameOver 
            ? `${language === 'es' ? 'Puntuación:' : 'Score:'} ${calculateScore(dealerCards)}`
            : `${language === 'es' ? 'Puntuación:' : 'Score:'} ? + ${getVisibleDealerScore()}`
          }
        </p>
      </div>
      
      <div className="message-section">
        {message && <p className="game-message">{message}</p>}
      </div>
      
      <div className="player-section">
        <h3>{language === 'es' ? 'Tú' : 'You'}</h3>
        <div className="cards">
          {playerCards.map((card, index) => renderCard(card, index))}
        </div>
        <p className="score">{language === 'es' ? 'Puntuación:' : 'Score:'} {calculateScore(playerCards)}</p>
      </div>
      
      <div className="controls">
        <button 
          className="bj-btn bj-hit" 
          onClick={hit} 
          disabled={gameOver || playerStand || isDealing || showResult}
        >
          {language === 'es' ? 'Pedir Carta' : 'Hit'}
        </button>
        <button 
          className="bj-btn bj-stand" 
          onClick={() => stand()} 
          disabled={gameOver || playerStand || isDealing || showResult}
        >
          {language === 'es' ? 'Plantarse' : 'Stand'}
        </button>
      </div>
      
      {showResult && (
        <div className="result-panel">
          <h2>{message}</h2>
          <button className="bj-btn bj-new" onClick={handleOkClick}>
            {language === 'es' ? 'OK' : 'OK'}
          </button>
        </div>
      )}
    </div>
  )
}
