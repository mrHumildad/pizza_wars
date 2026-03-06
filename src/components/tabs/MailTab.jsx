export default function MailTab({ mails, onDeleteMail }) {
  // Get initials from sender name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  if (!mails || mails.length === 0) {
    return (
      <div className="tab-content mail-tab">
        <div className="mail-empty">
          <p>📭 No mails yet...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="tab-content mail-tab">
      <div className="mail-list">
        {mails.map((mail, index) => (
          <div key={index} className="mail-item">
            <div className="mail-row">
              <div className="mail-sender-avatar">{getInitials(mail.from)}</div>
              <div style={{ flex: 1 }}>
                <div className="mail-header">
                  <span className="mail-from">{mail.from}</span>
                  <span className="mail-date">{mail.date}</span>
                </div>
                <div className="mail-subject">{mail.subject}</div>
              </div>
            </div>
            <div className="mail-body">{mail.body}</div>
            <button 
              className="mail-delete-btn"
              onClick={() => onDeleteMail && onDeleteMail(index)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
