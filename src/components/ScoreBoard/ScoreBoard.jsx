import './ScoreBoard.css'

export default function ScoreBoard({ playerChar, scores, round, onPlayAgain, onChangeChar, onReset }) {
  const total = scores.wins + scores.losses + scores.draws
  const winPercent = total > 0 ? Math.round((scores.wins / total) * 100) : 0

  const getMathMessage = () => {
    if (total < 5) return null
    if (scores.wins > scores.losses) {
      return `You won ${scores.wins} out of ${total} games — that's more than half! 🌟`
    } else if (scores.wins < scores.losses) {
      return `You played ${total} games — keep practising! Every game makes you better! 💪`
    }
    return `You won and lost the same number of games — perfectly balanced! ⚖️`
  }

  const mathMsg = getMathMessage()

  return (
    <div className="score-board">
      {/* Character header */}
      <div
        className="sb-char-header"
        style={{ background: playerChar?.bgColor, borderColor: playerChar?.color }}
      >
        <span className="sb-char-emoji">{playerChar?.emoji}</span>
        <div>
          <p className="sb-char-name">{playerChar?.name}'s Score</p>
          <p className="sb-char-round">{total} {total === 1 ? 'game' : 'games'} played</p>
        </div>
      </div>

      {/* Score cards */}
      <div className="sb-scores">
        <div className="sb-score-card sb-score-card--win">
          <span className="sb-score-emoji">🏆</span>
          <span className="sb-score-num">{scores.wins}</span>
          <span className="sb-score-label">Wins</span>
        </div>
        <div className="sb-score-card sb-score-card--draw">
          <span className="sb-score-emoji">🤝</span>
          <span className="sb-score-num">{scores.draws}</span>
          <span className="sb-score-label">Draws</span>
        </div>
        <div className="sb-score-card sb-score-card--lose">
          <span className="sb-score-emoji">💔</span>
          <span className="sb-score-num">{scores.losses}</span>
          <span className="sb-score-label">Losses</span>
        </div>
      </div>

      {/* Win rate bar */}
      {total > 0 && (
        <div className="sb-win-rate">
          <div className="sb-win-rate-label">
            <span>Win Rate</span>
            <span className="sb-win-rate-pct">{winPercent}%</span>
          </div>
          <div className="sb-win-bar-bg">
            <div
              className="sb-win-bar-fill"
              style={{ width: `${winPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Math message */}
      {mathMsg && (
        <div className="sb-math-msg">
          <span>🧮</span>
          <p>{mathMsg}</p>
        </div>
      )}

      {/* Actions */}
      <div className="sb-actions">
        <button className="btn-play-again" onClick={onPlayAgain}>
          Play Again! 🎮
        </button>
        <button className="btn-change-char-sb" onClick={onChangeChar}>
          Change Character
        </button>
        <button className="btn-reset" onClick={onReset}>
          Start Over
        </button>
      </div>
    </div>
  )
}
