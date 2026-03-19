import { getChoiceById, getStreakMessage } from '../../data/gameRules.js'
import './ResultScreen.css'

const CONFETTI_COLORS = [
  '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4'
]

function ConfettiPiece({ color, style }) {
  return (
    <div
      className="confetti-piece"
      style={{ background: color, ...style }}
    />
  )
}

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    duration: `${0.8 + Math.random() * 0.8}s`,
    size: `${8 + Math.random() * 10}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }))
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <ConfettiPiece
          key={p.id}
          color={p.color}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: p.borderRadius,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}

export default function ResultScreen({
  playerChar,
  playerChoice,
  cpuChoice,
  result,
  streak,
  onNext,
}) {
  const playerChoiceData = getChoiceById(playerChoice)
  const cpuChoiceData = getChoiceById(cpuChoice)
  const streakMsg = getStreakMessage(streak.count, streak.type)

  const isWin  = result === 'win'
  const isLose = result === 'lose'
  const isDraw = result === 'draw'

  const resultConfig = {
    win:  { emoji: '🏆', label: 'YOU WIN!',   charClass: 'result-char--win',  textClass: 'result-text--win',  message: playerChar?.victoryLine },
    lose: { emoji: '😢', label: 'YOU LOSE!',  charClass: 'result-char--lose', textClass: 'result-text--lose', message: playerChar?.defeatLine  },
    draw: { emoji: '🤝', label: "IT'S A DRAW!", charClass: 'result-char--draw', textClass: 'result-text--draw', message: playerChar?.drawLine    },
  }[result]

  return (
    <div className="result-screen">
      {isWin && <Confetti />}

      {/* Result badge */}
      <div className={`result-badge ${resultConfig.textClass}`}>
        <span className={`result-badge-emoji ${resultConfig.charClass}`}>
          {resultConfig.emoji}
        </span>
        <span className="result-badge-label">{resultConfig.label}</span>
      </div>

      {/* Character reaction */}
      <div className={`result-char-wrap ${resultConfig.charClass}`}>
        <span className="result-char-emoji">{playerChar?.emoji}</span>
        <p className="result-char-msg">{resultConfig.message}</p>
      </div>

      {/* Choices summary */}
      <div className="result-summary">
        <div className="result-choice">
          <span className="result-choice-emoji">{playerChoiceData?.emoji}</span>
          <span className="result-choice-label" style={{ color: playerChoiceData?.color }}>
            {playerChoiceData?.label}
          </span>
          <span className="result-choice-who">YOU</span>
        </div>

        <div className="result-summary-vs">
          {isWin ? '>' : isLose ? '<' : '='}
        </div>

        <div className="result-choice">
          <span className="result-choice-emoji">{cpuChoiceData?.emoji}</span>
          <span className="result-choice-label" style={{ color: cpuChoiceData?.color }}>
            {cpuChoiceData?.label}
          </span>
          <span className="result-choice-who">CPU</span>
        </div>
      </div>

      {/* Streak message */}
      {streakMsg && (
        <div className="result-streak">
          <p>{streakMsg}</p>
        </div>
      )}

      <button className="btn-result-next" onClick={onNext}>
        See Why! 💡
      </button>
    </div>
  )
}
