import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import HangmanDrawing from './HangmanDrawing';
import QuestionBox from './QuestionBox';
import AnswerDisplay from './AnswerDisplay';
import Keyboard from './Keyboard';
import Message from './Message';
import { translations, questionsEn, questionsEs } from './data';
import './LodgeMinigame.css';

const MAX_WRONG = 6;

// Helper function to get random question

export default function LodgeMinigame({ grade, onGradeUp, onComplete, enabled }) {
  const { language } = useLanguage();
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isWin, setIsWin] = useState(false);
  
  // Current question - select one random question on mount and keep until answered
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const questions = language === 'en' ? questionsEn : questionsEs;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  });
  const currentAnswer = currentQuestion?.answer.toUpperCase() || '';

  const t = translations[language];

  // Check if lodge is disabled
  const isDisabled = enabled === false;

  const handleGuess = useCallback((letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (currentAnswer.includes(letter)) {
      // Check win
      const answerChars = currentAnswer.replace(/[^A-Z0-9]/g, '').split('');
      const allGuessed = answerChars.every(char => newGuessed.includes(char));
      
      if (allGuessed) {
        setGameOver(true);
        setIsWin(true);
        setShowMessage(true);
      }
    } else {
      // Wrong guess
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      
      if (newWrong >= MAX_WRONG) {
        setGameOver(true);
        setIsWin(false);
        setShowMessage(true);
      }
    }
  }, [gameOver, guessedLetters, currentAnswer, wrongGuesses]);

  // Handle game completion - call appropriate callback
  const handleGameComplete = useCallback((won) => {
    if (won && onGradeUp) {
      onGradeUp();
    }
    if (onComplete) {
      onComplete();
    }
  }, [onGradeUp, onComplete]);

  // Handle message button click - pick a new random question
  const handleMessageButton = () => {
    const allQuestions = language === 'en' ? questionsEn : questionsEs;
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const newQuestion = allQuestions[randomIndex];
    
    setCurrentQuestion(newQuestion);
    setWrongGuesses(0);
    setGuessedLetters([]);
    setGameOver(false);
    setShowMessage(false);
    setIsWin(false);
    
    if (isWin) {
      handleGameComplete(true);
    } else {
      handleGameComplete(false);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && !guessedLetters.includes(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, guessedLetters, handleGuess]);

  // If lodge is disabled, show a message
  if (isDisabled) {
    return (
      <div className="lm-container">
        <h1 className="lm-title" data-text={t.title}>{t.title}</h1>
        <p className="lm-subtitle">{t.lodgeDisabled || 'You have already used the lodge this month. Come back next month!'}</p>
        <div className="lm-grade-display">
          <span className="lm-grade-label">{t.currentGrade || 'Current Grade'}:</span>
          <span className="lm-grade-value">{grade}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lm-container">
      <div className="lm-game-container">
        <div className="lm-hangman-section">
          <HangmanDrawing wrongGuesses={wrongGuesses} />
        </div>

        <div className="lm-game-info">
          <QuestionBox question={currentQuestion?.question || ''} grade={grade} />

          <AnswerDisplay answer={currentAnswer} guessedLetters={guessedLetters} />

          <Keyboard 
            guessedLetters={guessedLetters} 
            answer={currentAnswer}
            onGuess={handleGuess}
            disabled={gameOver}
          />
        </div>
      </div>

      <Message 
        show={showMessage}
        isWin={isWin}
        answer={currentAnswer}
        t={t}
        onNext={handleMessageButton}
        onRestart={handleMessageButton}
        onComplete={handleMessageButton}
      />
    </div>
  );
}
