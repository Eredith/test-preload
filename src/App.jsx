import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [botHealth, setBotHealth] = useState(100)
  const [message, setMessage] = useState('Fight!')
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false)
  const [isBotAttacking, setIsBotAttacking] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  
  // Player attack function
  const playerAttack = () => {
    if (gameOver) return;
    
    setIsPlayerAttacking(true)
    setTimeout(() => setIsPlayerAttacking(false), 500)
    
    // Random damage between 5-15
    const damage = Math.floor(Math.random() * 11) + 5
    const newBotHealth = Math.max(0, botHealth - damage)
    setBotHealth(newBotHealth)
    setMessage(`You hit the opponent for ${damage} damage!`)
    
    if (newBotHealth === 0) {
      setMessage('You win! 🎉')
      setGameOver(true)
    } else {
      // Bot attacks back after a delay
      setTimeout(botAttack, 1000)
    }
  }
  
  // Bot attack function
  const botAttack = () => {
    if (gameOver) return;
    
    setIsBotAttacking(true)
    setTimeout(() => setIsBotAttacking(false), 500)
    
    // Random damage between 3-12
    const damage = Math.floor(Math.random() * 10) + 3
    const newPlayerHealth = Math.max(0, playerHealth - damage)
    setPlayerHealth(newPlayerHealth)
    setMessage(`Opponent hit you for ${damage} damage!`)
    
    if (newPlayerHealth === 0) {
      setMessage('Game Over! You lost.')
      setGameOver(true)
    }
  }
  
  // Reset game
  const resetGame = () => {
    setPlayerHealth(100)
    setBotHealth(100)
    setMessage('Fight!')
    setGameOver(false)
    setIsPlayerAttacking(false)
    setIsBotAttacking(false)
  }

  return (
    <div className="fighting-game">
      <h1>Karate Fighter</h1>
      
      {/* Health bars */}
      <div className="health-bars">
        <div className="health-bar">
          <div className="health-label">You</div>
          <div className="health-outer">
            <div className="health-inner" style={{ width: `${playerHealth}%` }}></div>
          </div>
          <div className="health-text">{playerHealth}/100</div>
        </div>
        
        <div className="health-bar">
          <div className="health-label">Opponent</div>
          <div className="health-outer">
            <div className="health-inner" style={{ width: `${botHealth}%` }}></div>
          </div>
          <div className="health-text">{botHealth}/100</div>
        </div>
      </div>
      
      {/* Message */}
      <div className="message">{message}</div>
      
      {/* Fighting area */}
      <div className="fighting-area">
        <div className={`player ${isPlayerAttacking ? 'attacking' : ''}`}>
          <img src="/assets/karate punch.png" alt="Player" />
        </div>
        <div className={`bot ${isBotAttacking ? 'attacking' : ''}`}>
          <img src="/assets/karate punch1.png" alt="Opponent" />
        </div>
      </div>
      
      {/* Controls */}
      <div className="controls">
        <button className="attack-button" onClick={playerAttack} disabled={gameOver}>ATTACK</button>
        {gameOver && <button className="reset-button" onClick={resetGame}>Play Again</button>}
      </div>
    </div>
  )
}

export default App
