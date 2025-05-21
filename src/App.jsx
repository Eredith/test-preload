import { useEffect, useState } from 'react'
import './App.css'
import MainMenu from './components/MainMenu'
import CharacterSelect from './components/CharacterSelect'
import GameplayScene from './components/GameplayScene'
import ResultsScreen from './components/ResultsScreen'

function App() {
  const [currentScene, setCurrentScene] = useState('menu')
  const [playerCharacter, setPlayerCharacter] = useState(null)
  const [gameResult, setGameResult] = useState(null)

  // One-time fullscreen listener
  useEffect(() => {
    const handleFullscreen = () => {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }

      // Remove listener after first interaction
      document.removeEventListener('click', handleFullscreen)
    }

    document.addEventListener('click', handleFullscreen)
    return () => {
      document.removeEventListener('click', handleFullscreen)
    }
  }, [])

  // Scene transition handlers
  const goToMainMenu = () => setCurrentScene('menu')
  const goToCharacterSelect = () => setCurrentScene('select')
  const startGame = (character) => {
    setPlayerCharacter(character)
    setCurrentScene('gameplay')
  }
  const endGame = (result) => {
    setGameResult(result)
    setCurrentScene('results')
  }

  const renderScene = () => {
    switch (currentScene) {
      case 'menu':
        return <MainMenu onStartClick={startGame} />
      case 'gameplay':
        return <GameplayScene character={playerCharacter} onGameOver={endGame} />
      case 'results':
        return <ResultsScreen result={gameResult} onPlayAgain={goToMainMenu} onMainMenu={goToMainMenu} />
      default:
        return <MainMenu onStartClick={goToCharacterSelect} />
    }
  }

  return (
    <div className="fighting-game">
      {renderScene()}
    </div>
  )
}

export default App
