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

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function LodgeMinigame({ grade, onGradeUp, onComplete, enabled }) {
  const { language } = useLanguage();
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isWin, setIsWin] = useState(false);
  
  // Questions queue - shuffled at start and updated as questions are answered
  const [questionsQueue, setQuestionsQueue] = useState(() => 
    shuffleArray(language === 'en' ? questionsEn : questionsEs)
  );
  const [failedQuestions, setFailedQuestions] = useState([]);
  
  // Current question is always the first in the queue
  const currentQuestion = questionsQueue[0];
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

  // Handle message button click
  const handleMessageButton = () => {
    if (isWin) {
      // Win - remove current question from queue (don't add back)
      const remainingQueue = questionsQueue.slice(1);
      
      // Check if we need to add failed questions back to queue
      if (remainingQueue.length === 0 && failedQuestions.length > 0) {
        // All questions answered, shuffle failed questions and continue
        const reshuffledFailed = shuffleArray([...failedQuestions]);
        setQuestionsQueue(reshuffledFailed);
        setFailedQuestions([]);
      } else {
        setQuestionsQueue(remainingQueue);
      }
      
      // Call completion handler for grade up
      handleGameComplete(true);
    } else {
      // Lose - add current question to failed questions
      if (currentQuestion) {
        setFailedQuestions(prev => [...prev, currentQuestion]);
      }
      
      // Remove current question from queue
      const remainingQueue = questionsQueue.slice(1);
      
      // Check if we need to add failed questions back to queue
      if (remainingQueue.length === 0 && failedQuestions.length > 0) {
        const reshuffledFailed = shuffleArray([...failedQuestions]);
        setQuestionsQueue(reshuffledFailed);
        setFailedQuestions([]);
      } else {
        setQuestionsQueue(remainingQueue);
      }
      
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
