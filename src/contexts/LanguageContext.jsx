import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Main Menu
    newGame: 'NEW GAME',
    loadGame: 'LOAD GAME',
    howToPlay: 'HOW TO PLAY',
    comingSoon: 'Coming soon!',
    pizzaWars: 'PIZZA WARS',
    
    // How To Play
    howtoObjective: 'Objective',
    howtoObjectiveText: 'Build your pizza empire by traveling around the world, buying and selling products at the best prices, and upgrading your plane to reach new destinations.',
    howtoGameplay: 'How to Play',
    howtoGameplay1: 'Start each month by choosing to travel or stay at your current location.',
    howtoGameplay2: 'Visit the Market to buy and sell products. Prices vary by location!',
    howtoGameplay3: 'Check the Hangar to buy better planes with more speed, range, and capacity.',
    howtoGameplay4: 'Rest at the Lodge to recover energy and upgrade your character grade.',
    howtoGameplay5: 'Have fun at the Clubs with various activities like pool and casino.',
    howtoMarkets: 'Markets',
    howtoMarketsText: 'Each location has different product prices. Buy low in cheap locations and sell high where prices are elevated. Watch the average buy price to know the fair value!',
    howtoTravel: 'Travel',
    howtoTravelText: 'Traveling costs money and fuel. Each plane has different fuel efficiency. Plan your routes wisely to maximize profits.',
    howtoPlanes: 'Planes',
    howtoPlanesText: 'Better planes cost more but let you travel faster and carry more cargo. Some exotic locations require advanced planes to reach.',
    howtoLodge: 'Lodge',
    howtoLodgeText: 'Rest at the lodge to restore your energy. You can also upgrade your character grade, which improves your trading skills. Each upgrade costs money.',
    howtoClubs: 'Clubs',
    howtoClubsText: 'Relax and have fun at local clubs. Play pool, try your luck at the casino, or sing karaoke. Some activities can earn you extra money!',
    howtoTips: 'Tips',
    howtoTips1: 'Always check prices at multiple markets before making big trades.',
    howtoTips2: 'Save up for plane upgrades to access more profitable routes.',
    howtoTips3: 'Use the Lodge regularly to maintain high energy for better trades.',
    
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
    tabClubs: '🎱 Clubs',
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
    currentGrade: 'Grade',
    gradeUp: 'Grade Up!',
    lodgeDisabled: 'You have already used the lodge this month. Come back next month!',
    
    // Clubs Tab
    clubsTitle: 'Clubs',
    clubsDescription: 'Visit the local clubs and enjoy various activities.',
    clubsInfoTitle: 'Club Facilities',
    clubsInfoText: 'Relax and have fun at the club. Different activities available!',
    clubsActivities: 'Activities',
    activityPool: 'Pool',
    activityCasino: 'Casino',
    activityBar: 'Bar',
    activityKaraoke: 'Karaoke',
    
    // Character Tab
    characterInfo: 'Character Info',
    labelName: 'Name',
    labelCharacter: 'Character',
    labelCurrentGrade: 'Grade',
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
    
    // How To Play
    howtoObjective: 'Objetivo',
    howtoObjectiveText: 'Construye tu imperio de pizzas viajando por el mundo, comprando y vendiendo productos a los mejores precios, y mejorando tu avión para alcanzar nuevos destinos.',
    howtoGameplay: 'Cómo Jugar',
    howtoGameplay1: 'Comienza cada mes eligiendo viajar o quedarte en tu ubicación actual.',
    howtoGameplay2: 'Visita el Mercado para comprar y vender productos. ¡Los precios varían por ubicación!',
    howtoGameplay3: 'Revisa el Hangar para comprar mejores aviones con más velocidad, alcance y capacidad.',
    howtoGameplay4: 'Descansa en la Pensión para recuperar energía y mejorar el grado de tu personaje.',
    howtoGameplay5: 'Diviértete en los Clubes con varias actividades como billar y casino.',
    howtoMarkets: 'Mercados',
    howtoMarketsText: 'Cada ubicación tiene diferentes precios de productos. Compra barato en ubicaciones económicas y vende caro donde los precios son elevados. ¡Observa el precio promedio de compra para saber el valor justo!',
    howtoTravel: 'Viajes',
    howtoTravelText: 'Viajar cuesta dinero y combustible. Cada avión tiene diferente eficiencia de combustible. Planifica tus rutas sabiamente para maximizar ganancias.',
    howtoPlanes: 'Aviones',
    howtoPlanesText: 'Los mejores aviones cuestan más pero te permiten viajar más rápido y cargar más carga. Algunas ubicaciones exóticas requieren aviones avanzados para alcanzar.',
    howtoLodge: 'Pensión',
    howtoLodgeText: 'Descansa en la pensión para restaurar tu energía. También puedes mejorar el grado de tu personaje, lo cual mejora tus habilidades de trading. Cada mejora cuesta dinero.',
    howtoClubs: 'Clubes',
    howtoClubsText: 'Relájate y diviértete en los clubes locales. Juega billar, prueba tu suerte en el casino, o canta karaoke. ¡Algunas actividades pueden darte dinero extra!',
    howtoTips: 'Consejos',
    howtoTips1: 'Siempre verifica los precios en múltiples mercados antes de hacer grandes intercambios.',
    howtoTips2: 'Ahorra para mejorar tu avión y acceder a rutas más rentables.',
    howtoTips3: 'Usa la Pensión regularmente para mantener alta energía y mejores intercambios.',
    
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
    tabClubs: '🎱 Clubes',
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
    currentGrade: 'Grado',
    gradeUp: '¡Sube de Grado!',
    lodgeDisabled: 'Ya has usado la pensión este mes. ¡Vuelve el próximo mes!',
    
    // Clubs Tab
    clubsTitle: 'Clubes',
    clubsDescription: 'Visita los clubes locales y disfruta de varias actividades.',
    clubsInfoTitle: 'Instalaciones del Club',
    clubsInfoText: 'Relájate y diviértete en el club. ¡Diferentes actividades disponibles!',
    clubsActivities: 'Actividades',
    activityPool: 'Billar',
    activityCasino: 'Casino',
    activityBar: 'Bar',
    activityKaraoke: 'Karaoke',
    
    // Character Tab
    characterInfo: 'Info del Personaje',
    labelName: 'Nombre',
    labelCharacter: 'Personaje',
    labelCurrentGrade: 'Grado',
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
