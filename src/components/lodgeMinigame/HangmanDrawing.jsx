export default function HangmanDrawing({ wrongGuesses }) {
  
  return (
    <div className="lm-hangman-drawing">
      <svg viewBox="0 0 200 250">
        {/* Gallows */}
        <line x1="20" y1="240" x2="100" y2="240" className="lm-gallows" />
        <line x1="60" y1="240" x2="60" y2="20" className="lm-gallows" />
        <line x1="60" y1="20" x2="140" y2="20" className="lm-gallows" />
        <line x1="140" y1="20" x2="140" y2="40" className="lm-gallows" />
        
        {/* Head */}
        <circle 
          cx="140" 
          cy="60" 
          r="20" 
          className="lm-hangman-part" 
          id="head" 
          style={{ display: wrongGuesses >= 1 ? 'block' : 'none' }}
        />
        
        {/* Body */}
        <line 
          x1="140" y1="80" x2="140" y2="140" 
          className="lm-hangman-part" 
          id="body"
          style={{ display: wrongGuesses >= 2 ? 'block' : 'none' }}
        />
        
        {/* Left Arm */}
        <line 
          x1="140" y1="100" x2="110" y2="130" 
          className="lm-hangman-part" 
          id="leftArm"
          style={{ display: wrongGuesses >= 3 ? 'block' : 'none' }}
        />
        
        {/* Right Arm */}
        <line 
          x1="140" y1="100" x2="170" y2="130" 
          className="lm-hangman-part" 
          id="rightArm"
          style={{ display: wrongGuesses >= 4 ? 'block' : 'none' }}
        />
        
        {/* Left Leg */}
        <line 
          x1="140" y1="140" x2="110" y2="180" 
          className="lm-hangman-part" 
          id="leftLeg"
          style={{ display: wrongGuesses >= 5 ? 'block' : 'none' }}
        />
        
        {/* Right Leg */}
        <line 
          x1="140" y1="140" x2="170" y2="180" 
          className="lm-hangman-part" 
          id="rightLeg"
          style={{ display: wrongGuesses >= 6 ? 'block' : 'none' }}
        />
      </svg>
      <div className={`lm-creepy-eye ${wrongGuesses >= 2 ? 'show' : ''}`}></div>
      <div className={`lm-blood-drip ${wrongGuesses >= 4 ? 'show' : ''}`}></div>
    </div>
  );
}
