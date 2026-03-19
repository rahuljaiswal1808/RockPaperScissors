import { useGame, SCREENS } from './hooks/useGame.js'
import Welcome from './components/Welcome/Welcome.jsx'
import CharacterSelect from './components/CharacterSelect/CharacterSelect.jsx'
import HowToPlay from './components/HowToPlay/HowToPlay.jsx'
import GameBoard from './components/GameBoard/GameBoard.jsx'
import BattleScreen from './components/BattleScreen/BattleScreen.jsx'
import ResultScreen from './components/ResultScreen/ResultScreen.jsx'
import EducationPanel from './components/EducationPanel/EducationPanel.jsx'
import ScoreBoard from './components/ScoreBoard/ScoreBoard.jsx'
import './App.css'

export default function App() {
  const game = useGame()

  return (
    <div className="app-wrapper">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="app-container">
        {game.screen === SCREENS.WELCOME && (
          <Welcome onStart={() => game.setScreen(SCREENS.CHARACTER_SELECT)} />
        )}

        {game.screen === SCREENS.CHARACTER_SELECT && (
          <CharacterSelect
            selectedChar={game.playerChar}
            onSelect={game.selectCharacter}
            onConfirm={game.confirmCharacter}
          />
        )}

        {game.screen === SCREENS.HOW_TO_PLAY && (
          <HowToPlay onDone={game.dismissHowToPlay} />
        )}

        {game.screen === SCREENS.GAME_BOARD && (
          <GameBoard
            playerChar={game.playerChar}
            scores={game.scores}
            round={game.round}
            onChoice={game.makeChoice}
            onChangeChar={game.changeCharacter}
          />
        )}

        {game.screen === SCREENS.BATTLE && (
          <BattleScreen
            playerChar={game.playerChar}
            playerChoice={game.playerChoice}
            cpuChoice={game.cpuChoice}
            onDone={game.goToResult}
          />
        )}

        {game.screen === SCREENS.RESULT && (
          <ResultScreen
            playerChar={game.playerChar}
            playerChoice={game.playerChoice}
            cpuChoice={game.cpuChoice}
            result={game.result}
            streak={game.streak}
            onNext={game.goToEducation}
          />
        )}

        {game.screen === SCREENS.EDUCATION && (
          <EducationPanel
            playerChoice={game.playerChoice}
            cpuChoice={game.cpuChoice}
            result={game.result}
            round={game.round}
            onNext={game.goToScoreBoard}
          />
        )}

        {game.screen === SCREENS.SCORE_BOARD && (
          <ScoreBoard
            playerChar={game.playerChar}
            scores={game.scores}
            round={game.round}
            onPlayAgain={game.playAgain}
            onChangeChar={game.changeCharacter}
            onReset={game.resetGame}
          />
        )}
      </div>
    </div>
  )
}
