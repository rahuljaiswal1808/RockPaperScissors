import { useState, useEffect } from 'react'
import { getChoiceById } from '../../data/gameRules.js'
import './BattleScreen.css'

const COUNTDOWN_STEPS = ['3', '2', '1', 'FIGHT! ⚡']

export default function BattleScreen({ playerChar, playerChoice, cpuChoice, onDone }) {
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const playerChoiceData = getChoiceById(playerChoice)
  const cpuChoiceData = getChoiceById(cpuChoice)

  useEffect(() => {
    if (step < COUNTDOWN_STEPS.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 700)
      return () => clearTimeout(t)
    } else if (step === COUNTDOWN_STEPS.length - 1) {
      // Show FIGHT then reveal
      const t = setTimeout(() => setRevealed(true), 600)
      return () => clearTimeout(t)
    }
  }, [step])

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(onDone, 1800)
      return () => clearTimeout(t)
    }
  }, [revealed, onDone])

  return (
    <div className="battle-screen">
      {!revealed ? (
        <div className="countdown-wrap">
          <div className="countdown-number" key={step}>
            {COUNTDOWN_STEPS[step]}
          </div>
          <div className="countdown-chars">
            <span className="countdown-char countdown-char--left">
              {playerChar?.emoji}
            </span>
            <span className="countdown-sword">⚔️</span>
            <span className="countdown-char countdown-char--right">🤖</span>
          </div>
        </div>
      ) : (
        <div className="reveal-wrap">
          <h2 className="reveal-title">You both chose...</h2>
          <div className="reveal-choices">
            <div className="reveal-choice slide-left">
              <div className="reveal-char-tag">YOU</div>
              <span className="reveal-emoji">{playerChoiceData?.emoji}</span>
              <span className="reveal-label" style={{ color: playerChoiceData?.color }}>
                {playerChoiceData?.label}
              </span>
            </div>

            <div className="reveal-vs">VS</div>

            <div className="reveal-choice slide-right">
              <div className="reveal-char-tag reveal-char-tag--cpu">CPU</div>
              <span className="reveal-emoji">{cpuChoiceData?.emoji}</span>
              <span className="reveal-label" style={{ color: cpuChoiceData?.color }}>
                {cpuChoiceData?.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
