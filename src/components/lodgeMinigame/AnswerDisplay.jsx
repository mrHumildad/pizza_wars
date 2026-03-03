export default function AnswerDisplay({ answer, guessedLetters }) {
  // Split into words first, then map each word to letter boxes
  const words = answer.split(' ');
  
  return (
    <div className="lm-answer-display">
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="lm-word">
          {word.split('').map((char, index) => (
            <div 
              key={index} 
              className={`lm-letter-box ${char === ' ' ? 'space' : ''} ${guessedLetters.includes(char) ? 'reveal' : ''}`}
            >
              {char === ' ' ? '\u00A0' : (guessedLetters.includes(char) ? char : '')}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
