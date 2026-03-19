import { describe, it, expect } from 'vitest'
import { CHARACTERS, getCharacterById } from './characters.js'

describe('getCharacterById', () => {
  it('returns the dragon character', () => {
    const char = getCharacterById('dragon')
    expect(char).toBeDefined()
    expect(char.id).toBe('dragon')
    expect(char.name).toBe('Dragon')
    expect(char.emoji).toBe('🐉')
  })

  it('returns the correct character for each valid id', () => {
    for (const character of CHARACTERS) {
      const found = getCharacterById(character.id)
      expect(found).toBe(character)
    }
  })

  it('falls back to the first character for an unknown id', () => {
    const fallback = getCharacterById('unknown-id')
    expect(fallback).toBe(CHARACTERS[0])
  })

  it('each character has required fields', () => {
    for (const char of CHARACTERS) {
      expect(char.id).toBeTruthy()
      expect(char.name).toBeTruthy()
      expect(char.emoji).toBeTruthy()
      expect(char.color).toBeTruthy()
      expect(char.bgColor).toBeTruthy()
      expect(char.victoryLine).toBeTruthy()
      expect(char.defeatLine).toBeTruthy()
      expect(char.drawLine).toBeTruthy()
    }
  })

  it('has 8 characters', () => {
    expect(CHARACTERS).toHaveLength(8)
  })
})
