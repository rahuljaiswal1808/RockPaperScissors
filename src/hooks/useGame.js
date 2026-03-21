import { useState, useCallback } from 'react'
import { getResult, getRandomChoice } from '../data/gameRules.js'

export const MAX_TURNS = 20

export const SCREENS = {
  WELCOME: 'welcome',
  CHARACTER_SELECT: 'characterSelect',
  HOW_TO_PLAY: 'howToPlay',
  GAME_BOARD: 'gameBoard',
  BATTLE: 'battle',
  RESULT: 'result',
  EDUCATION: 'education',
  SCORE_BOARD: 'scoreBoard',
}

const initialScores = { wins: 0, losses: 0, draws: 0 }

export function useGame() {
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [playerChar, setPlayerChar] = useState(null)
  const [playerChoice, setPlayerChoice] = useState(null)
  const [cpuChoice, setCpuChoice] = useState(null)
  const [result, setResult] = useState(null)  // 'win' | 'lose' | 'draw'
  const [scores, setScores] = useState(initialScores)
  const [round, setRound] = useState(0)
  const [streak, setStreak] = useState({ type: null, count: 0 })
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useState(false)

  const selectCharacter = useCallback((char) => {
    setPlayerChar(char)
  }, [])

  const confirmCharacter = useCallback(() => {
    if (!hasSeenHowToPlay) {
      setScreen(SCREENS.HOW_TO_PLAY)
    } else {
      setScreen(SCREENS.GAME_BOARD)
    }
  }, [hasSeenHowToPlay])

  const dismissHowToPlay = useCallback(() => {
    setHasSeenHowToPlay(true)
    setScreen(SCREENS.GAME_BOARD)
  }, [])

  const makeChoice = useCallback((choice) => {
    const cpu = getRandomChoice()
    const res = getResult(choice, cpu)

    setPlayerChoice(choice)
    setCpuChoice(cpu)
    setResult(res)
    setRound((r) => r + 1)

    setScores((prev) => ({
      wins:   prev.wins   + (res === 'win'  ? 1 : 0),
      losses: prev.losses + (res === 'lose' ? 1 : 0),
      draws:  prev.draws  + (res === 'draw' ? 1 : 0),
    }))

    setStreak((prev) => {
      if (res === 'draw') return { type: null, count: 0 }
      if (prev.type === res) return { type: res, count: prev.count + 1 }
      return { type: res, count: 1 }
    })

    setScreen(SCREENS.BATTLE)
  }, [])

  const goToResult = useCallback(() => {
    setScreen(SCREENS.RESULT)
  }, [])

  const goToEducation = useCallback(() => {
    setScreen(SCREENS.EDUCATION)
  }, [])

  const goToScoreBoard = useCallback(() => {
    setScreen(SCREENS.SCORE_BOARD)
  }, [])

  const playAgain = useCallback(() => {
    setPlayerChoice(null)
    setCpuChoice(null)
    setResult(null)
    if (round >= MAX_TURNS) {
      setScreen(SCREENS.SCORE_BOARD)
    } else {
      setScreen(SCREENS.GAME_BOARD)
    }
  }, [round])

  const changeCharacter = useCallback(() => {
    setPlayerChoice(null)
    setCpuChoice(null)
    setResult(null)
    setScreen(SCREENS.CHARACTER_SELECT)
  }, [])

  const resetGame = useCallback(() => {
    setScreen(SCREENS.WELCOME)
    setPlayerChar(null)
    setPlayerChoice(null)
    setCpuChoice(null)
    setResult(null)
    setScores(initialScores)
    setRound(0)
    setStreak({ type: null, count: 0 })
    setHasSeenHowToPlay(false)
  }, [])

  return {
    // State
    screen,
    playerChar,
    playerChoice,
    cpuChoice,
    result,
    scores,
    round,
    streak,
    // Actions
    setScreen,
    selectCharacter,
    confirmCharacter,
    dismissHowToPlay,
    makeChoice,
    goToResult,
    goToEducation,
    goToScoreBoard,
    playAgain,
    changeCharacter,
    resetGame,
  }
}
