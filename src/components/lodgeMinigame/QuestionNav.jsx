export default function QuestionNav({ currentIndex, total, t, onPrev, onNext }) {
  return (
    <div className="lm-question-nav">
      <button onClick={onPrev} disabled={currentIndex === 0} className="lm-nav-btn">
        ◀ {t.prevBtn}
      </button>
      <span className="lm-question-counter">
        {t.questionLabel} {currentIndex + 1} {t.ofLabel} {total}
      </span>
      <button onClick={onNext} disabled={currentIndex === total - 1} className="lm-nav-btn">
        {t.nextBtn} ▶
      </button>
    </div>
  );
}
