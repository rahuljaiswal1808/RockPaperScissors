import { describe, it, expect } from 'vitest'
import {
  CHOICES,
  getResult,
  getRandomChoice,
  getChoiceById,
  getRuleExplanation,
  RULES_EXPLANATION,
  getFunFact,
  FUN_FACTS,
  getStrategyTip,
  STRATEGY_TIPS,
  getStreakMessage,
} from './gameRules.js'

// ─── getResult ────────────────────────────────────────────────────────────────

describe('getResult', () => {
  it('returns draw when both choices are the same', () => {
    expect(getResult('rock', 'rock')).toBe('draw')
    expect(getResult('paper', 'paper')).toBe('draw')
    expect(getResult('scissors', 'scissors')).toBe('draw')
  })

  it('returns win for rock vs scissors', () => {
    expect(getResult('rock', 'scissors')).toBe('win')
  })

  it('returns win for paper vs rock', () => {
    expect(getResult('paper', 'rock')).toBe('win')
  })

  it('returns win for scissors vs paper', () => {
    expect(getResult('scissors', 'paper')).toBe('win')
  })

  it('returns lose for scissors vs rock', () => {
    expect(getResult('scissors', 'rock')).toBe('lose')
  })

  it('returns lose for rock vs paper', () => {
    expect(getResult('rock', 'paper')).toBe('lose')
  })

  it('returns lose for paper vs scissors', () => {
    expect(getResult('paper', 'scissors')).toBe('lose')
  })
})

// ─── getRandomChoice ──────────────────────────────────────────────────────────

describe('getRandomChoice', () => {
  it('always returns a valid choice id', () => {
    const validIds = CHOICES.map((c) => c.id)
    for (let i = 0; i < 50; i++) {
      expect(validIds).toContain(getRandomChoice())
    }
  })
})

// ─── getChoiceById ────────────────────────────────────────────────────────────

describe('getChoiceById', () => {
  it('returns the rock choice object', () => {
    const choice = getChoiceById('rock')
    expect(choice).toBeDefined()
    expect(choice.id).toBe('rock')
    expect(choice.emoji).toBe('🪨')
    expect(choice.label).toBe('Rock')
  })

  it('returns the paper choice object', () => {
    const choice = getChoiceById('paper')
    expect(choice).toBeDefined()
    expect(choice.id).toBe('paper')
  })

  it('returns the scissors choice object', () => {
    const choice = getChoiceById('scissors')
    expect(choice).toBeDefined()
    expect(choice.id).toBe('scissors')
  })

  it('returns undefined for an unknown id', () => {
    expect(getChoiceById('lizard')).toBeUndefined()
  })
})

// ─── getRuleExplanation ───────────────────────────────────────────────────────

describe('getRuleExplanation', () => {
  it('returns draw explanation when both choices match', () => {
    const result = getRuleExplanation('rock', 'rock')
    expect(result).toEqual(RULES_EXPLANATION.draw)
  })

  it('returns explanation for rock vs scissors', () => {
    const result = getRuleExplanation('rock', 'scissors')
    expect(result).toBeDefined()
    expect(result.rule).toBeTruthy()
    expect(result.why).toBeTruthy()
  })

  it('returns explanation for paper vs rock', () => {
    const result = getRuleExplanation('paper', 'rock')
    expect(result).toBeDefined()
    expect(result.rule).toContain('Paper')
  })

  it('returns explanation for scissors vs paper', () => {
    const result = getRuleExplanation('scissors', 'paper')
    expect(result).toBeDefined()
    expect(result.rule).toContain('Scissors')
  })

  it('returns explanation for all 6 non-draw combinations', () => {
    const combos = [
      ['rock', 'scissors'],
      ['rock', 'paper'],
      ['paper', 'rock'],
      ['paper', 'scissors'],
      ['scissors', 'paper'],
      ['scissors', 'rock'],
    ]
    for (const [p, c] of combos) {
      const result = getRuleExplanation(p, c)
      expect(result).toBeDefined()
      expect(result.rule).toBeTruthy()
    }
  })
})

// ─── getFunFact ───────────────────────────────────────────────────────────────

describe('getFunFact', () => {
  it('returns a string for rock at round 0', () => {
    const fact = getFunFact('rock', 0)
    expect(typeof fact).toBe('string')
    expect(fact.length).toBeGreaterThan(0)
  })

  it('cycles through rock facts by round index', () => {
    const facts = FUN_FACTS.rock
    for (let i = 0; i < facts.length; i++) {
      expect(getFunFact('rock', i)).toBe(facts[i])
    }
  })

  it('wraps around when round exceeds fact count', () => {
    const facts = FUN_FACTS.rock
    expect(getFunFact('rock', facts.length)).toBe(facts[0])
    expect(getFunFact('rock', facts.length + 1)).toBe(facts[1])
  })

  it('handles paper and scissors choices', () => {
    expect(typeof getFunFact('paper', 0)).toBe('string')
    expect(typeof getFunFact('scissors', 0)).toBe('string')
  })

  it('falls back to rock facts for unknown choice', () => {
    const result = getFunFact('lizard', 0)
    expect(FUN_FACTS.rock).toContain(result)
  })
})

// ─── getStrategyTip ───────────────────────────────────────────────────────────

describe('getStrategyTip', () => {
  it('returns a string', () => {
    expect(typeof getStrategyTip(0)).toBe('string')
  })

  it('cycles through all tips', () => {
    for (let i = 0; i < STRATEGY_TIPS.length; i++) {
      expect(getStrategyTip(i)).toBe(STRATEGY_TIPS[i])
    }
  })

  it('wraps around after all tips are exhausted', () => {
    expect(getStrategyTip(STRATEGY_TIPS.length)).toBe(STRATEGY_TIPS[0])
  })
})

// ─── getStreakMessage ─────────────────────────────────────────────────────────

describe('getStreakMessage', () => {
  it('returns null for streak below 3', () => {
    expect(getStreakMessage(1, 'win')).toBeNull()
    expect(getStreakMessage(2, 'win')).toBeNull()
    expect(getStreakMessage(2, 'lose')).toBeNull()
  })

  it('returns a win streak message at streak 3', () => {
    const msg = getStreakMessage(3, 'win')
    expect(msg).toBeTruthy()
    expect(msg).toContain('3')
  })

  it('returns a win streak message at streak 5', () => {
    const msg = getStreakMessage(5, 'win')
    expect(msg).toBeTruthy()
    expect(msg).toContain('5')
  })

  it('returns a lose streak message at streak 3', () => {
    const msg = getStreakMessage(3, 'lose')
    expect(msg).toBeTruthy()
  })

  it('returns null for draw type regardless of streak', () => {
    expect(getStreakMessage(5, 'draw')).toBeNull()
  })
})
