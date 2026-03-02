export default function QuestionBox({ question, t }) {
  return (
    <div className="lm-question-box">
      <div className="lm-question-label">{t.questionLabel2}</div>
      <div className="lm-question-text">{question}</div>
    </div>
  );
}
