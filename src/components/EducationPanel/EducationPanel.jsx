import { getRuleExplanation, getFunFact, getStrategyTip } from '../../data/gameRules.js'
import './EducationPanel.css'

export default function EducationPanel({ playerChoice, cpuChoice, result, round, onNext }) {
  const ruleInfo = getRuleExplanation(playerChoice, cpuChoice)
  const funFact  = getFunFact(result === 'draw' ? playerChoice : (result === 'win' ? playerChoice : cpuChoice), round)
  const tip      = round >= 3 ? getStrategyTip(round) : null

  return (
    <div className="edu-panel">
      <h2 className="edu-title">Let's Learn! 📖</h2>

      {/* Rule explanation */}
      <div className="edu-card edu-card--rule">
        <div className="edu-card-icon">⚖️</div>
        <div>
          <p className="edu-card-heading">{ruleInfo.rule}</p>
          <p className="edu-card-body">{ruleInfo.why}</p>
        </div>
      </div>

      {/* Fun fact */}
      <div className="edu-card edu-card--fact">
        <div className="edu-card-icon">🔍</div>
        <div>
          <p className="edu-card-heading">Did you know?</p>
          <p className="edu-card-body">{funFact}</p>
        </div>
      </div>

      {/* Strategy tip (only after round 3) */}
      {tip && (
        <div className="edu-card edu-card--tip">
          <div className="edu-card-icon">💡</div>
          <div>
            <p className="edu-card-heading">Pro Tip!</p>
            <p className="edu-card-body">{tip}</p>
          </div>
        </div>
      )}

      <button className="btn-edu-next" onClick={onNext}>
        See Scores! 🏆
      </button>
    </div>
  )
}
