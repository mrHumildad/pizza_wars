import { useState, useMemo } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import Blackjack from './Blackjack'
import { places } from '../../logics/places'
import './ClubsTab.css'

function ClubsTab({ locationId, friends, onAddFriend, enabled, onComplete }) {
  const { language } = useLanguage()
  const [showBlackjack, setShowBlackjack] = useState(false)
  const [currentOpponent, setCurrentOpponent] = useState(null)
  
  // Get current place
  const currentPlace = useMemo(() => places.find(p => p.id === locationId), [locationId])
  
  // Get friend names for filtering
  const friendNames = useMemo(() => {
    return friends?.map(f => f.firstName ? `${f.firstName} ${f.surname || ''}`.trim() : f.name) || []
  }, [friends])
  
  // Get available NPCs (not friends)
  const availableNpcs = useMemo(() => {
    if (!currentPlace?.npcs) return []
    return currentPlace.npcs.filter(npc => !friendNames.includes(npc.firstName + ' ' + npc.surname))
  }, [currentPlace, friendNames])
  
  // Select random opponent - initialize with function to run only once
  const getInitialOpponent = () => {
    if (availableNpcs.length > 0 && enabled) {
      const randomIndex = Math.floor(Math.random() * availableNpcs.length)
      return availableNpcs[randomIndex]
    }
    return null
  }
  
  const [opponent] = useState(getInitialOpponent)

  const handleBlackjackWin = () => {
    // Add opponent to friends
    if (opponent && onAddFriend) {
      // Convert NPC (firstName/surname) to friend (name) - include location from current place
      const friend = {
        ...opponent,
        name: `${opponent.firstName} ${opponent.surname}`,
        location: currentPlace.name
      }
      console.log('Adding friend from ClubsTab:', friend)
      onAddFriend(friend)
    }
    // Return to market (handled by parent)
  }

  const handleBlackjackComplete = (result) => {
    // result: true = win, false = lose, null = tie
    if (result === true) {
      handleBlackjackWin()
    }
    // Always go back to market (close blackjack)
    setShowBlackjack(false)
    setCurrentOpponent(null)
    // Notify parent to return to market
    if (onComplete) {
      onComplete()
    }
  }

  const startBlackjack = () => {
    setCurrentOpponent(opponent)
    setShowBlackjack(true)
  }

  // Show blackjack game
  if (showBlackjack && currentOpponent) {
    return (
      <div className="tab-content clubs-tab">
        <Blackjack 
          opponentName={`${currentOpponent.firstName} ${currentOpponent.surname}`}
          onWin={() => {}}
          onComplete={handleBlackjackComplete}
        />
      </div>
    )
  }
  
  // Show disabled message if clubs not enabled
  if (!enabled) {
    return (
      <div className="tab-content clubs-tab">
        <div className="friend-request-modal">
          <p>
            {language === 'es' 
              ? 'Ya has ido al club esta semana. Vuelve la próxima semana!'
              : 'You already went to the club this week. Come back next week!'
            }
          </p>
        </div>
      </div>
    )
  }
  
  // No opponents available
  if (!opponent) {
    return (
      <div className="tab-content clubs-tab">
        <div className="friend-request-modal">
          <p>
            {language === 'es' 
              ? 'No hay nadie conocido en este lugar...'
              : 'No one you know at this place...'
            }
          </p>
        </div>
      </div>
    )
  }
  
  // Show the simplified friend request message with OK button
  return (
    <div className="tab-content clubs-tab">
      <div className="friend-request-modal">
        <p>
          {language === 'es' 
            ? `te encontraste con ${opponent?.firstName && opponent?.surname ? opponent.firstName + ' ' + opponent.surname : 'alguien'} quieres intentar ser amigo?`
            : `you met ${opponent?.firstName && opponent?.surname ? opponent.firstName + ' ' + opponent.surname : 'someone'} want to try to be friend?`
          }
        </p>
        <button className="ok-btn" onClick={startBlackjack}>
          {language === 'es' ? 'OK' : 'OK'}
        </button>
      </div>
    </div>
  )
}

export default ClubsTab
