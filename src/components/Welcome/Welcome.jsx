import './Welcome.css'

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <div className="welcome-emojis">
        <span className="welcome-emoji" style={{ animationDelay: '0s' }}>🪨</span>
        <span className="welcome-emoji" style={{ animationDelay: '-1s' }}>📄</span>
        <span className="welcome-emoji" style={{ animationDelay: '-2s' }}>✂️</span>
      </div>

      <div className="welcome-title-wrap">
        <h1 className="welcome-title">Rock</h1>
        <h1 className="welcome-title">Paper</h1>
        <h1 className="welcome-title">Scissors!</h1>
      </div>

      <p className="welcome-subtitle">
        Pick your hero and play the coolest game ever! 🎮
      </p>

      <div className="welcome-mascot">🎉</div>

      <button className="btn-start" onClick={onStart}>
        Let's Play! 🚀
      </button>

      <p className="welcome-hint">
        For kids who love fun & learning! 🌟
      </p>
    </div>
  )
}
