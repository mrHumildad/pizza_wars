import { useLanguage } from '../../contexts/LanguageContext'

export default function MailTab({ mails, onDeleteMail }) {
  const { t } = useLanguage()
  
  if (!mails || mails.length === 0) {
    return (
      <div className="tab-content mail-tab">
        <div className="mail-empty">
          <p>No mails yet...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="tab-content mail-tab">
      <div className="mail-list">
        {mails.map((mail, index) => (
          <div key={index} className="mail-item">
            <div className="mail-header">
              <span className="mail-from">From: {mail.from}</span>
              <span className="mail-date">{mail.date}</span>
            </div>
            <div className="mail-subject">{mail.subject}</div>
            <div className="mail-body">{mail.body}</div>
            <button 
              className="mail-delete-btn"
              onClick={() => onDeleteMail && onDeleteMail(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
