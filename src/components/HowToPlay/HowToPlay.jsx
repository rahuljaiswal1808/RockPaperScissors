import './HowToPlay.css'

const RULES = [
  {
    winner: '🪨',
    loser: '✂️',
    winnerLabel: 'Rock',
    loserLabel: 'Scissors',
    explanation: 'Rock is super heavy and smashes scissors flat!',
    color: 'var(--color-rock)',
    bg: '#FFF0EB',
  },
  {
    winner: '✂️',
    loser: '📄',
    winnerLabel: 'Scissors',
    loserLabel: 'Paper',
    explanation: 'Sharp scissors snip right through paper — snip snip!',
    color: 'var(--color-scissors)',
    bg: '#E8F5E9',
  },
  {
    winner: '📄',
    loser: '🪨',
    winnerLabel: 'Paper',
    loserLabel: 'Rock',
    explanation: 'Paper wraps all around rock and covers it up!',
    color: 'var(--color-paper)',
    bg: '#EBF5FF',
  },
]

export default function HowToPlay({ onDone }) {
  return (
    <div className="how-to-play">
      <h2 className="htp-title">How to Play! 📖</h2>
      <p className="htp-sub">Learn what beats what before you start!</p>

      <div className="htp-rules">
        {RULES.map((rule) => (
          <div
            key={rule.winnerLabel}
            className="htp-rule-card"
            style={{ background: rule.bg, borderColor: rule.color }}
          >
            <div className="htp-combatants">
              <div className="htp-combatant">
                <span className="htp-emoji htp-winner">{rule.winner}</span>
                <span className="htp-label" style={{ color: rule.color }}>
                  {rule.winnerLabel}
                </span>
              </div>
              <div className="htp-vs">
                <span>beats</span>
                <span className="htp-arrow">→</span>
              </div>
              <div className="htp-combatant">
                <span className="htp-emoji htp-loser">{rule.loser}</span>
                <span className="htp-label">{rule.loserLabel}</span>
              </div>
            </div>
            <p className="htp-explanation">{rule.explanation}</p>
          </div>
        ))}
      </div>

      <div className="htp-draw-note">
        <span>🤝</span>
        <p>Same choice? It's a <strong>Draw!</strong> Try again!</p>
      </div>

      <button className="btn-htp" onClick={onDone}>
        Got it! Let's Play! 🎮
      </button>
    </div>
  )
}
