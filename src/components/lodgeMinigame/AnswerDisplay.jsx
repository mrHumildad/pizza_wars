export default function AnswerDisplay({ answer, guessedLetters }) {
  return (
    <div className="lm-answer-display">
      {answer.split('').map((char, index) => (
        <div 
          key={index} 
          className={`lm-letter-box ${char === ' ' ? 'space' : ''} ${guessedLetters.includes(char) ? 'reveal' : ''}`}
        >
          {char === ' ' ? '\u00A0' : (guessedLetters.includes(char) ? char : '')}
        </div>
      ))}
    </div>
  );
}
