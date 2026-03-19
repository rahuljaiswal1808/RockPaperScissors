import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame, SCREENS } from './useGame.js'
import { CHARACTERS } from '../data/characters.js'

// ─── Initial State ────────────────────────────────────────────────────────────

describe('useGame initial state', () => {
  it('starts on the WELCOME screen', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.screen).toBe(SCREENS.WELCOME)
  })

  it('starts with null character and choices', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.playerChar).toBeNull()
    expect(result.current.playerChoice).toBeNull()
    expect(result.current.cpuChoice).toBeNull()
    expect(result.current.result).toBeNull()
  })

  it('starts with zeroed scores', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.scores).toEqual({ wins: 0, losses: 0, draws: 0 })
  })

  it('starts at round 0', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.round).toBe(0)
  })
})

// ─── Character Selection ──────────────────────────────────────────────────────

describe('selectCharacter', () => {
  it('sets playerChar', () => {
    const { result } = renderHook(() => useGame())
    const char = CHARACTERS[0]
    act(() => result.current.selectCharacter(char))
    expect(result.current.playerChar).toBe(char)
  })
})

// ─── confirmCharacter ─────────────────────────────────────────────────────────

describe('confirmCharacter', () => {
  it('navigates to HOW_TO_PLAY on first confirm', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.selectCharacter(CHARACTERS[0]))
    act(() => result.current.confirmCharacter())
    expect(result.current.screen).toBe(SCREENS.HOW_TO_PLAY)
  })

  it('navigates directly to GAME_BOARD after how-to-play was seen', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.selectCharacter(CHARACTERS[0]))
    act(() => result.current.confirmCharacter())
    act(() => result.current.dismissHowToPlay())
    // Now go back to character select and confirm again
    act(() => result.current.changeCharacter())
    act(() => result.current.confirmCharacter())
    expect(result.current.screen).toBe(SCREENS.GAME_BOARD)
  })
})

// ─── dismissHowToPlay ─────────────────────────────────────────────────────────

describe('dismissHowToPlay', () => {
  it('navigates to GAME_BOARD', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.selectCharacter(CHARACTERS[0]))
    act(() => result.current.confirmCharacter())
    act(() => result.current.dismissHowToPlay())
    expect(result.current.screen).toBe(SCREENS.GAME_BOARD)
  })
})

// ─── makeChoice ───────────────────────────────────────────────────────────────

describe('makeChoice', () => {
  it('sets playerChoice, cpuChoice, and result', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.playerChoice).toBe('rock')
    expect(['rock', 'paper', 'scissors']).toContain(result.current.cpuChoice)
    expect(['win', 'lose', 'draw']).toContain(result.current.result)
  })

  it('increments round', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.round).toBe(1)
    act(() => result.current.playAgain())
    act(() => result.current.makeChoice('paper'))
    expect(result.current.round).toBe(2)
  })

  it('navigates to BATTLE screen', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.screen).toBe(SCREENS.BATTLE)
  })

  it('increments wins score on win', () => {
    // Mock random to force a win: player=rock, cpu=scissors
    vi.spyOn(Math, 'random').mockReturnValue(2 / 3) // index 2 = scissors
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.result).toBe('win')
    expect(result.current.scores.wins).toBe(1)
    expect(result.current.scores.losses).toBe(0)
    expect(result.current.scores.draws).toBe(0)
    vi.restoreAllMocks()
  })

  it('increments losses score on lose', () => {
    // player=scissors, cpu=rock → lose
    vi.spyOn(Math, 'random').mockReturnValue(0) // index 0 = rock
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('scissors'))
    expect(result.current.result).toBe('lose')
    expect(result.current.scores.losses).toBe(1)
    expect(result.current.scores.wins).toBe(0)
    vi.restoreAllMocks()
  })

  it('increments draws score on draw', () => {
    // player=rock, cpu=rock → draw
    vi.spyOn(Math, 'random').mockReturnValue(0) // index 0 = rock
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.result).toBe('draw')
    expect(result.current.scores.draws).toBe(1)
    vi.restoreAllMocks()
  })
})

// ─── Streak Tracking ──────────────────────────────────────────────────────────

describe('streak tracking', () => {
  it('increments win streak on consecutive wins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(2 / 3) // scissors → player rock wins
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    act(() => result.current.playAgain())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.streak).toEqual({ type: 'win', count: 2 })
    vi.restoreAllMocks()
  })

  it('resets streak on draw', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(2 / 3) // scissors → win
      .mockReturnValueOnce(0)     // rock → draw (player also picks rock)
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.streak.type).toBe('win')
    act(() => result.current.playAgain())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.streak).toEqual({ type: null, count: 0 })
    vi.restoreAllMocks()
  })

  it('resets streak count to 1 on type change (win → lose)', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(2 / 3) // scissors → win with rock
      .mockReturnValueOnce(0)     // rock → lose with scissors
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    expect(result.current.streak.type).toBe('win')
    act(() => result.current.playAgain())
    act(() => result.current.makeChoice('scissors'))
    expect(result.current.streak).toEqual({ type: 'lose', count: 1 })
    vi.restoreAllMocks()
  })
})

// ─── Navigation Actions ───────────────────────────────────────────────────────

describe('goToResult', () => {
  it('navigates to RESULT screen', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    act(() => result.current.goToResult())
    expect(result.current.screen).toBe(SCREENS.RESULT)
  })
})

describe('goToEducation', () => {
  it('navigates to EDUCATION screen', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.goToEducation())
    expect(result.current.screen).toBe(SCREENS.EDUCATION)
  })
})

describe('goToScoreBoard', () => {
  it('navigates to SCORE_BOARD screen', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.goToScoreBoard())
    expect(result.current.screen).toBe(SCREENS.SCORE_BOARD)
  })
})

describe('playAgain', () => {
  it('clears choices and navigates to GAME_BOARD', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    act(() => result.current.playAgain())
    expect(result.current.screen).toBe(SCREENS.GAME_BOARD)
    expect(result.current.playerChoice).toBeNull()
    expect(result.current.cpuChoice).toBeNull()
    expect(result.current.result).toBeNull()
  })

  it('preserves scores after playAgain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(2 / 3) // always scissors → win
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    const winsBefore = result.current.scores.wins
    act(() => result.current.playAgain())
    expect(result.current.scores.wins).toBe(winsBefore)
    vi.restoreAllMocks()
  })
})

describe('changeCharacter', () => {
  it('clears choices and navigates to CHARACTER_SELECT', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.makeChoice('rock'))
    act(() => result.current.changeCharacter())
    expect(result.current.screen).toBe(SCREENS.CHARACTER_SELECT)
    expect(result.current.playerChoice).toBeNull()
    expect(result.current.cpuChoice).toBeNull()
    expect(result.current.result).toBeNull()
  })
})

// ─── resetGame ────────────────────────────────────────────────────────────────

describe('resetGame', () => {
  it('resets all state to initial values', () => {
    vi.spyOn(Math, 'random').mockReturnValue(2 / 3)
    const { result } = renderHook(() => useGame())
    // Play a round to dirty the state
    act(() => result.current.selectCharacter(CHARACTERS[0]))
    act(() => result.current.makeChoice('rock'))
    act(() => result.current.makeChoice('rock'))
    // Now reset
    act(() => result.current.resetGame())
    expect(result.current.screen).toBe(SCREENS.WELCOME)
    expect(result.current.playerChar).toBeNull()
    expect(result.current.playerChoice).toBeNull()
    expect(result.current.cpuChoice).toBeNull()
    expect(result.current.result).toBeNull()
    expect(result.current.scores).toEqual({ wins: 0, losses: 0, draws: 0 })
    expect(result.current.round).toBe(0)
    expect(result.current.streak).toEqual({ type: null, count: 0 })
    vi.restoreAllMocks()
  })
})
