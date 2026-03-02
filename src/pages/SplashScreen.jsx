import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SplashScreen() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Auto-redirect to main menu after video ends or 5 seconds
    const timer = setTimeout(() => {
      navigate('/menu')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [navigate])
  
  return (
    <div className="splash-screen">
      <video 
        className="splash-video" 
        autoPlay 
        muted 
        playsInline
        onEnded={() => navigate('/menu')}
      >
        <source src="/images/splash.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default SplashScreen
