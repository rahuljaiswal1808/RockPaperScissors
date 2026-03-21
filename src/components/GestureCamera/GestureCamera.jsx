import { useGesture } from '../../hooks/useGesture.js'
import './GestureCamera.css'

const GESTURE_INFO = {
  rock:     { label: 'Rock',     emoji: '🪨' },
  paper:    { label: 'Paper',    emoji: '📄' },
  scissors: { label: 'Scissors', emoji: '✂️' },
}

export default function GestureCamera({ onChoice }) {
  const { videoRef, canvasRef, currentGesture, holdProgress, status, errorMsg } =
    useGesture({ onGestureConfirmed: onChoice })

  if (status === 'no-camera') {
    return (
      <div className="gesture-error">
        <p>📷 Camera access denied</p>
        <p>Please allow camera access in your browser and reload the page.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="gesture-error">
        <p>⚠️ Camera error</p>
        <p>{errorMsg || 'Could not start the camera.'}</p>
      </div>
    )
  }

  const info = currentGesture ? GESTURE_INFO[currentGesture] : null
  // SVG circle: r=15.9  → circumference ≈ 100 (convenient percentage units)
  const dash = holdProgress * 100

  return (
    <div className="gesture-camera">
      <div className="camera-container">
        <video ref={videoRef} className="camera-video" playsInline muted />
        <canvas ref={canvasRef} className="camera-canvas" />

        {status === 'initializing' && (
          <div className="camera-loading">
            <div className="camera-spinner" />
            <p>Loading gesture detection…</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="gesture-overlay">
            {info ? (
              <>
                <div className="detected-badge">
                  <span className="detected-emoji">{info.emoji}</span>
                  <span className="detected-name">{info.label}</span>
                </div>

                <div className="hold-ring" title={`Hold: ${Math.round(holdProgress * 100)}%`}>
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke="#4af"
                      strokeWidth="3"
                      strokeDasharray={`${dash} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <span className="hold-ring-pct">{Math.round(holdProgress * 100)}%</span>
                </div>
              </>
            ) : (
              <div className="show-hand-hint">✋ Show your hand!</div>
            )}
          </div>
        )}
      </div>

      <div className="gesture-guide">
        <span>🪨 Fist = Rock</span>
        <span>📄 Open hand = Paper</span>
        <span>✂️ Peace sign = Scissors</span>
      </div>
      <p className="gesture-tip">Hold your gesture steady for <strong>1.5 s</strong> to play!</p>
    </div>
  )
}
