export default function QuestionBox({ question, grade }) {
  return (
    <div className="lm-question-box">
      <div className="lm-question-label">Answer to be ascended to grade {grade + 1}</div>
      <div className="lm-question-text">{question}</div>
    </div>
  );
}
