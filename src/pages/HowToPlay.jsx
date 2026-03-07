import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function HowToPlay() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="how-to-play">
      <h1 className="how-to-play-title">{t('howToPlay')}</h1>
      
      <div className="how-to-play-content">
        <section className="howto-section">
          <h2>{t('howtoObjective')}</h2>
          <p>{t('howtoObjectiveText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoGameplay')}</h2>
          <ul>
            <li>{t('howtoGameplay1')}</li>
            <li>{t('howtoGameplay2')}</li>
            <li>{t('howtoGameplay3')}</li>
            <li>{t('howtoGameplay4')}</li>
            <li>{t('howtoGameplay5')}</li>
          </ul>
        </section>

        <section className="howto-section">
          <h2>{t('howtoMarkets')}</h2>
          <p>{t('howtoMarketsText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoTravel')}</h2>
          <p>{t('howtoTravelText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoPlanes')}</h2>
          <p>{t('howtoPlanesText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoLodge')}</h2>
          <p>{t('howtoLodgeText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoClubs')}</h2>
          <p>{t('howtoClubsText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoFriends')}</h2>
          <p>{t('howtoFriendsText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoMail')}</h2>
          <p>{t('howtoMailText')}</p>
        </section>

        <section className="howto-section">
          <h2>{t('howtoTips')}</h2>
          <ul>
            <li>{t('howtoTips1')}</li>
            <li>{t('howtoTips2')}</li>
            <li>{t('howtoTips3')}</li>
            <li>{t('howtoTips4')}</li>
          </ul>
        </section>
      </div>

      <button 
        className="menu-button primary back-to-menu-btn"
        onClick={() => navigate('/menu')}
      >
        {t('back')} {t('mainMenu')}
      </button>
    </div>
  )
}

export default HowToPlay
