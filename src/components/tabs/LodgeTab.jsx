import LodgeMinigame from '../lodgeMinigame/LodgeMinigame'

export default function LodgeTab({ grade, onGradeUp, onComplete, enabled }) {
  return (
    <div className="tab-content">
      <LodgeMinigame 
        grade={grade}
        onGradeUp={onGradeUp}
        onComplete={onComplete}
        enabled={enabled}
      />
    </div>
  )
}
