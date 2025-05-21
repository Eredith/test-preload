import { useEffect, useState } from 'react'
import "./app.css"
import "./index.css"
import "./styles/gameplay.css"
import "./styles/resultsscreen.css"
import "./styles/rotationoverlay.css"
import MainMenu from './components/MainMenu'
import CharacterSelect from './components/CharacterSelect'
import GameplayScene from './components/GameplayScene'
import ResultsScreen from './components/ResultsScreen'
import RotationOverlay from './components/RotationOverlay' // Import the RotationOverlay component

function App() {
  const [currentScene, setCurrentScene] = useState('menu')
  const [playerCharacter, setPlayerCharacter] = useState(null)
  const [gameResult, setGameResult] = useState(null)

  // Fullscreen handler (one-time)
  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

    const handleFullscreen = () => {
      const element = document.documentElement

      if (isIOS) {
        // Add iOS fullscreen simulation class
        document.documentElement.classList.add('fullscreen-ios')
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }

      // Remove after first interaction
      document.removeEventListener('click', handleFullscreen)
    }

    document.addEventListener('click', handleFullscreen, { once: true })

    return () => {
      document.removeEventListener('click', handleFullscreen)
    }
  }, [])

  // Scene transitions
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

  // Scene renderer
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
      <RotationOverlay /> {/* Add the RotationOverlay component here */}
    </div>
  )
}

export default App
