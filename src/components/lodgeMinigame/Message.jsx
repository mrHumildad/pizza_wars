export default function Message({ show, isWin, answer, t, onComplete }) {
  if (!show) return null;
  
  const getTitle = () => {
    if (isWin) {
      return t.winTitle;
    }
    return t.loseTitle;
  };
  
  const getText = () => {
    if (isWin) {
      return t.winTextPrefix + answer;
    }
    return t.loseTextPrefix + answer;
  };
  
  const getButtonText = () => {
    if (isWin) {
      return t.continueBtn;
    }
    return t.tryAgainBtn;
  };
  
  const handleClick = () => {
    if (onComplete) {
      onComplete(isWin);
    }
  };

  return (
    <div className={`lm-message ${show ? 'show' : ''} ${isWin ? 'win' : 'lose'}`}>
      <h2>{getTitle()}</h2>
      <p>{getText()}</p>
      <button className="lm-btn" onClick={handleClick}>
        {getButtonText()}
      </button>
    </div>
  );
}
