import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Main Menu
    newGame: 'NEW GAME',
    loadGame: 'LOAD GAME',
    howToPlay: 'HOW TO PLAY',
    comingSoon: 'Coming soon!',
    pizzaWars: 'PIZZA WARS',
    
    // App
    back: '← BACK',
    nextMonth: 'NEXT MONTH →',
    footer: '© 2026 Pizza Wars',
    
    // New Game
    enterYourName: 'ENTER YOUR NAME',
    yourNamePlaceholder: 'Your name...',
    selectStartingPlace: 'SELECT STARTING PLACE',
    startGame: 'START GAME',
    pleaseEnterName: 'Please enter your name!',
    
    // Game Tabs
    tabMarket: '🏪 Market',
    tabHangar: '🔧 Hangar',
    tabLodge: '🏠 Lodge',
    tabCharacter: '👤 Character',
    
    // Market Tab
    colItem: 'Item',
    colOwned: 'Owned',
    colPrice: 'Price',
    colAvgBuy: 'Avg Buy',
    colAction: 'Action',
    btnBuy: 'BUY',
    btnSell: 'SELL',
    labelCapacity: 'Capacity',
    
    // Hangar Tab
    availablePlanes: 'Available Planes',
    labelType: 'Type',
    labelSpeed: 'Speed',
    labelRange: 'Range',
    labelFuel: 'Fuel',
    badgeOwned: 'OWNED',
    btnBuyPlane: 'BUY',
    
    // Lodge Tab
    lodgeTitle: 'Lodge',
    lodgeDesc: 'Rest and recover at the lodge.',
    
    // Character Tab
    characterInfo: 'Character Info',
    labelName: 'Name',
    labelCharacter: 'Character',
    labelCurrentPlane: 'Current Plane',
    labelTotalItems: 'Total Items',
    labelInventoryValue: 'Inventory Value',
    
    // Travel Mode
    stayThisMonth: 'Stay this month',
    free: 'FREE',
    
    // Game Screen
    notEnoughMoney: 'Not enough money!',
    notEnoughFuel: 'Not enough money for fuel!',
    confirmBuyPlane: 'Buy this plane? Your current plane will be traded in.',
    goBtn: 'GO →',
    confirmBtn: 'CONFIRM →',
    
    // Game Over
    gameOver: 'GAME OVER',
    finalScore: 'FINAL SCORE',
    playAgain: 'PLAY AGAIN',
    mainMenu: 'MAIN MENU',
    
    // Months
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  es: {
    // Main Menu
    newGame: 'NUEVO JUEGO',
    loadGame: 'CARGAR JUEGO',
    howToPlay: 'CÓMO JUGAR',
    comingSoon: '¡Próximamente!',
    pizzaWars: 'PIZZA WARS',
    
    // App
    back: '← ATRÁS',
    nextMonth: 'PRÓXIMO MES →',
    footer: '© 2026 Pizza Wars',
    
    // New Game
    enterYourName: 'INGRESA TU NOMBRE',
    yourNamePlaceholder: 'Tu nombre...',
    selectStartingPlace: 'SELECCIONA LUGAR DE INICIO',
    startGame: 'INICIAR JUEGO',
    pleaseEnterName: '¡Por favor ingresa tu nombre!',
    
    // Game Tabs
    tabMarket: '🏪 Mercado',
    tabHangar: '🔧 Hangar',
    tabLodge: '🏠 Pensión',
    tabCharacter: '👤 Personaje',
    
    // Market Tab
    colItem: 'Artículo',
    colOwned: 'Tenencia',
    colPrice: 'Precio',
    colAvgBuy: 'Promedio',
    colAction: 'Acción',
    btnBuy: 'COMPRAR',
    btnSell: 'VENDER',
    labelCapacity: 'Capacidad',
    
    // Hangar Tab
    availablePlanes: 'Aviones Disponibles',
    labelType: 'Tipo',
    labelSpeed: 'Velocidad',
    labelRange: 'Alcance',
    labelFuel: 'Combustible',
    badgeOwned: 'PROPIO',
    btnBuyPlane: 'COMPRAR',
    
    // Lodge Tab
    lodgeTitle: 'Pensión',
    lodgeDesc: 'Descansa y recupérate en la pensión.',
    
    // Character Tab
    characterInfo: 'Info del Personaje',
    labelName: 'Nombre',
    labelCharacter: 'Personaje',
    labelCurrentPlane: 'Avión Actual',
    labelTotalItems: 'Total Artículos',
    labelInventoryValue: 'Valor del Inventario',
    
    // Travel Mode
    stayThisMonth: 'Quedar este mes',
    free: 'GRATIS',
    
    // Game Screen
    notEnoughMoney: '¡No tienes suficiente dinero!',
    notEnoughFuel: '¡No tienes suficiente dinero para combustible!',
    confirmBuyPlane: '¿Comprar este avión? Tu avión actual será tomado como intercambio.',
    goBtn: 'IR →',
    confirmBtn: 'CONFIRMAR →',
    
    // Game Over
    gameOver: 'FIN DEL JUEGO',
    finalScore: 'PUNTAJE FINAL',
    playAgain: 'JUGAR OTRA VEZ',
    mainMenu: 'MENÚ PRINCIPAL',
    
    // Months
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('pizzaWarsLanguage')
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('pizzaWarsLanguage', language)
  }, [language])

  const t = (key) => translations[language][key] || key
  const getMonth = (index) => translations[language].months[index] || translations[language].months[0]
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'es' : 'en')

  return (
    <LanguageContext.Provider value={{ language, t, getMonth, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
