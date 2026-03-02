export default function Message({ show, isWin, answer, t, isLastQuestion, onNext, onRestart }) {
  if (!show) return null;
  
  const getTitle = () => {
    if (isWin) {
      return isLastQuestion ? t.allRevealedTitle : t.winTitle;
    }
    return t.loseTitle;
  };
  
  const getText = () => {
    if (isWin) {
      return isLastQuestion ? t.allRevealedText : t.winTextPrefix + answer;
    }
    return t.loseTextPrefix + answer;
  };
  
  const getButtonText = () => {
    if (isWin) {
      return isLastQuestion ? t.beginAgainBtn : t.nextSecretBtn;
    }
    return isLastQuestion ? t.tryAgainBtn : t.continueBtn;
  };
  
  const getButtonAction = () => {
    return isLastQuestion ? onRestart : onNext;
  };
  
  return (
    <div className={`lm-message ${show ? 'show' : ''} ${isWin ? 'win' : 'lose'}`}>
      <h2>{getTitle()}</h2>
      <p>{getText()}</p>
      <button className="lm-btn" onClick={getButtonAction()}>
        {getButtonText()}
      </button>
    </div>
  );
}
