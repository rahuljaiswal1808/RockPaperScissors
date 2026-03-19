import { CHARACTERS } from '../../data/characters.js'
import './CharacterSelect.css'

export default function CharacterSelect({ selectedChar, onSelect, onConfirm }) {
  return (
    <div className="char-select">
      <h2 className="char-select-title">Choose Your Hero!</h2>
      <p className="char-select-sub">Pick the character you want to play as 👇</p>

      <div className="char-grid">
        {CHARACTERS.map((char) => {
          const isSelected = selectedChar?.id === char.id
          return (
            <button
              key={char.id}
              className={`char-card ${isSelected ? 'char-card--selected' : ''}`}
              style={{
                '--char-color': char.color,
                '--char-bg': char.bgColor,
              }}
              onClick={() => onSelect(char)}
              aria-pressed={isSelected}
            >
              <span className="char-emoji">{char.emoji}</span>
              <span className="char-name">{char.name}</span>
              <span className="char-tagline">{char.tagline}</span>
              {isSelected && <span className="char-check">✓</span>}
            </button>
          )
        })}
      </div>

      {selectedChar && (
        <div className="char-confirm-wrap">
          <div className="char-selected-preview" style={{ background: selectedChar.bgColor }}>
            <span className="char-preview-emoji">{selectedChar.emoji}</span>
            <div>
              <p className="char-preview-name">{selectedChar.name}</p>
              <p className="char-preview-tagline">{selectedChar.tagline}</p>
            </div>
          </div>
          <button className="btn-confirm" onClick={onConfirm}>
            Play as {selectedChar.name}! 🎮
          </button>
        </div>
      )}
    </div>
  )
}
