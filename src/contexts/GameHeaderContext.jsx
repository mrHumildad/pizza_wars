import { createContext, useContext, useState } from 'react'

const GameHeaderContext = createContext()

export function GameHeaderProvider({ children }) {
  const [gameHeaderInfo, setGameHeaderInfo] = useState(null)

  return (
    <GameHeaderContext.Provider value={{ gameHeaderInfo, setGameHeaderInfo }}>
      {children}
    </GameHeaderContext.Provider>
  )
}

export function useGameHeader() {
  return useContext(GameHeaderContext)
}
