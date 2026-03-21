import GestureCamera from '../GestureCamera/GestureCamera.jsx'
import { MAX_TURNS } from '../../hooks/useGame.js'
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
        <span className="gb-round">Turn {round + 1} / {MAX_TURNS}</span>
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

      {/* Prompt */}
      <div className="gb-prompt">
        <p>Show your gesture!</p>
      </div>

      {/* Gesture Camera */}
      <GestureCamera onChoice={onChoice} />

      {/* Change character */}
      <button className="btn-change-char" onClick={onChangeChar}>
        Change Character
      </button>
    </div>
  )
}
