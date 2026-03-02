export default function Keyboard({ guessedLetters, answer, onGuess, disabled }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="lm-keyboard">
      {letters.map(letter => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = answer.includes(letter);
        
        return (
          <button
            key={letter}
            className={`lm-key ${isGuessed ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            onClick={() => onGuess(letter)}
            disabled={isGuessed || disabled}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
