import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import HangmanDrawing from './HangmanDrawing';
import QuestionBox from './QuestionBox';
import AnswerDisplay from './AnswerDisplay';
import Keyboard from './Keyboard';
import Message from './Message';
import QuestionNav from './QuestionNav';
import { translations, questionsEn, questionsEs } from './data';
import './LodgeMinigame.css';

const MAX_WRONG = 6;

export default function LodgeMinigame() {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState(language);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // Sync with app language
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  const questions = currentLang === 'en' ? questionsEn : questionsEs;
  const t = translations[currentLang];
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion?.answer.toUpperCase() || '';

  const getQuestions = useCallback(() => {
    return currentLang === 'en' ? questionsEn : questionsEs;
  }, [currentLang]);

  const resetGame = useCallback(() => {
    setWrongGuesses(0);
    setGuessedLetters([]);
    setGameOver(false);
    setShowMessage(false);
    setIsWin(false);
  }, []);

  const handleLanguageChange = useCallback((lang) => {
    setCurrentLang(lang);
    setCurrentQuestionIndex(0);
    resetGame();
  }, [resetGame]);

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

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < getQuestions().length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetGame();
    }
  }, [currentQuestionIndex, getQuestions, resetGame]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetGame();
    }
  }, [currentQuestionIndex, resetGame]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    resetGame();
  }, [resetGame]);

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

  return (
    <div className="lm-container">
      <div className="lm-language-toggle">
        <button 
          className={`lm-lang-btn ${currentLang === 'en' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          EN
        </button>
        <button 
          className={`lm-lang-btn ${currentLang === 'es' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('es')}
        >
          ES
        </button>
      </div>
      
      <h1 className="lm-title" data-text={t.title}>{t.title}</h1>
      <p className="lm-subtitle">{t.subtitle}</p>

      <QuestionNav 
        currentIndex={currentQuestionIndex} 
        total={questions.length} 
        t={t}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="lm-game-container">
        <div className="lm-hangman-section">
          <HangmanDrawing wrongGuesses={wrongGuesses} />
        </div>

        <div className="lm-game-info">
          <QuestionBox question={currentQuestion?.question || ''} t={t} />

          <AnswerDisplay answer={currentAnswer} guessedLetters={guessedLetters} />

          <div className="lm-status-info">
            <div className="lm-status-item">
              <span className="lm-status-label">{t.wrongLabel}</span>
              <span className="lm-status-value">{wrongGuesses}</span>
              <span className="lm-status-label">/ {MAX_WRONG}</span>
            </div>
          </div>

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
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        onNext={handleNext}
        onRestart={handleRestart}
      />
    </div>
  );
}
