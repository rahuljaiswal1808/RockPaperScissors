import { CHOICES } from '../../data/gameRules.js'
import './GameBoard.css'

export default function GameBoard({ playerChar, scores, round, onChoice, onChangeChar }) {
  return (
    <div className="game-board">
      {/* Header */}
      <div className="gb-header">
        <div className="gb-score-pill">
          <span className="score-w">🏆 {scores.wins}</span>
          <span className="score-sep">·</span>
          <span className="score-d">🤝 {scores.draws}</span>
          <span className="score-sep">·</span>
          <span className="score-l">💔 {scores.losses}</span>
        </div>
        {round > 0 && (
          <span className="gb-round">Round {round + 1}</span>
        )}
      </div>

      {/* Versus area */}
      <div className="gb-versus">
        <div className="gb-player">
          <div
            className="gb-avatar"
            style={{ background: playerChar?.bgColor, borderColor: playerChar?.color }}
          >
            <span className="gb-avatar-emoji">{playerChar?.emoji}</span>
          </div>
          <span className="gb-avatar-name">{playerChar?.name}</span>
          <span className="gb-avatar-you">YOU</span>
        </div>

        <div className="gb-vs-badge">VS</div>

        <div className="gb-cpu">
          <div className="gb-avatar gb-avatar--cpu">
            <span className="gb-avatar-emoji">🤖</span>
          </div>
          <span className="gb-avatar-name">Computer</span>
          <span className="gb-avatar-cpu-tag">CPU</span>
        </div>
      </div>

      {/* Choice prompt */}
      <div className="gb-prompt">
        <p>What do you choose?</p>
      </div>

      {/* Choice buttons */}
      <div className="gb-choices">
        {CHOICES.map((choice) => (
          <button
            key={choice.id}
            className="choice-btn"
            style={{ '--choice-color': choice.color }}
            onClick={() => onChoice(choice.id)}
          >
            <span className="choice-emoji">{choice.emoji}</span>
            <span className="choice-label">{choice.label}</span>
          </button>
        ))}
      </div>

      {/* Change character */}
      <button className="btn-change-char" onClick={onChangeChar}>
        Change Character
      </button>
    </div>
  )
}
