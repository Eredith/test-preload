"use client"

import { useState, useEffect } from "react"
import "../styles/Gameplay.css"

function GameplayScene({ character, onGameOver }) {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [botHealth, setBotHealth] = useState(100)
  const [message, setMessage] = useState("Fight!")
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false)
  const [isBotAttacking, setIsBotAttacking] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [isMatchStarted, setIsMatchStarted] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [playerWins, setPlayerWins] = useState(0)
  const [botWins, setBotWins] = useState(0)
  const [matchTimer, setMatchTimer] = useState(60)
  const [attackType, setAttackType] = useState(null)
  const [showHitEffect, setShowHitEffect] = useState(false)
  const [hitPosition, setHitPosition] = useState({ x: 0, y: 0 })
  const [comboCount, setComboCount] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setMessage("FIGHT!")
      setIsMatchStarted(true)
      // Clear countdown after a delay
      setTimeout(() => {
        setCountdown(null)
      }, 1000)
    }
  }, [countdown])

  // Match timer
  useEffect(() => {
    if (isMatchStarted && !gameOver && matchTimer > 0) {
      const timer = setTimeout(() => {
        setMatchTimer(matchTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (matchTimer === 0 && !gameOver) {
      // Time over logic
      const winner = playerHealth > botHealth ? "player" : "bot"
      handleRoundEnd(winner)
    }
  }, [isMatchStarted, gameOver, matchTimer])

  // Handle round end
  const handleRoundEnd = (winner) => {
    if (winner === "player") {
      setPlayerWins(playerWins + 1)
      setMessage("YOU WIN!")
    } else {
      setBotWins(botWins + 1)
      setMessage("YOU LOSE!")
    }

    setGameOver(true)

    // Check if match is over (best of 3)
    if (playerWins + 1 >= 2 || botWins + 1 >= 2) {
      setTimeout(
        () =>
          onGameOver({
            victory: winner === "player",
          }),
        2000,
      )
    } else {
      // Start next round
      setTimeout(() => {
        setCurrentRound(currentRound + 1)
        setPlayerHealth(100)
        setBotHealth(100)
        setGameOver(false)
        setMatchTimer(60)
        setCountdown(3)
        setIsMatchStarted(false)
      }, 2000)
    }
  }

  // Player attack function
  const playerAttack = (attackType = "punch") => {
    if (gameOver || !isMatchStarted) return

    setIsPlayerAttacking(true)
    setAttackType(attackType)

    // Increase combo count
    setComboCount((prev) => prev + 1)

    // Reset combo after a delay if no new attacks
    clearTimeout(window.comboTimeout)
    window.comboTimeout = setTimeout(() => {
      setComboCount(0)
    }, 2000)

    setTimeout(() => {
      setIsPlayerAttacking(false)
      setAttackType(null)
    }, 500)

    // Random damage based on attack type
    let damage
    switch (attackType) {
      case "kick":
        damage = Math.floor(Math.random() * 16) + 10 // 10-25
        break
      case "special":
        damage = Math.floor(Math.random() * 21) + 15 // 15-35
        break
      default: // punch
        damage = Math.floor(Math.random() * 11) + 5 // 5-15
    }

    // Combo bonus
    if (comboCount > 1) {
      damage = Math.floor(damage * (1 + comboCount * 0.1))
    }

    const newBotHealth = Math.max(0, botHealth - damage)
    setBotHealth(newBotHealth)

    // Show hit effect
    setHitPosition({
      x: Math.random() * 20 + 60,
      y: Math.random() * 40 + 30,
    })
    setShowHitEffect(true)
    setTimeout(() => setShowHitEffect(false), 300)

    setMessage(`${comboCount + 1} HIT COMBO! ${damage} DMG!`)

    if (newBotHealth === 0) {
      handleRoundEnd("player")
    } else {
      // Bot attacks back after a delay
      setTimeout(botAttack, 1000)
    }
  }

  // Bot attack function
  const botAttack = () => {
    if (gameOver || !isMatchStarted) return

    setIsBotAttacking(true)

    // Random attack type for bot
    const botAttackType = ["punch", "kick", "special"][Math.floor(Math.random() * 3)]

    setTimeout(() => setIsBotAttacking(false), 500)

    // Random damage based on attack type
    let damage
    switch (botAttackType) {
      case "kick":
        damage = Math.floor(Math.random() * 14) + 8 // 8-21
        break
      case "special":
        damage = Math.floor(Math.random() * 16) + 12 // 12-27
        break
      default: // punch
        damage = Math.floor(Math.random() * 10) + 3 // 3-12
    }

    const newPlayerHealth = Math.max(0, playerHealth - damage)
    setPlayerHealth(newPlayerHealth)

    // Show hit effect
    setHitPosition({
      x: Math.random() * 20 + 20,
      y: Math.random() * 40 + 30,
    })
    setShowHitEffect(true)
    setTimeout(() => setShowHitEffect(false), 300)

    setMessage(`OPPONENT HITS YOU! ${damage} DMG!`)
    setComboCount(0)

    if (newPlayerHealth === 0) {
      handleRoundEnd("bot")
    }
  }

  return (
    <div className="gameplay-container">
      <div className="arcade-frame">
        <div className="arcade-screen">
          {countdown !== null && (
            <div className="countdown-overlay">
              <div className="countdown">{countdown === 0 ? "FIGHT!" : countdown}</div>
            </div>
          )}

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-text">{playerHealth > botHealth ? "YOU WIN!" : "YOU LOSE!"}</div>
            </div>
          )}

          <div className="game-hud">
            <div className="player-info">
              <div className="character-portrait player-portrait">
                <img src={character?.portrait || "/assets/player-portrait.png"} alt="Player" />
              </div>
              <div className="player-health-container">
                <div className="health-bar-wrapper">
                  <div className="health-bar-outer">
                    <div className="health-bar-inner" style={{ width: `${playerHealth}%` }}></div>
                  </div>
                </div>
                <div className="player-name">PLAYER</div>
              </div>
            </div>

            <div className="match-info">
              <div className="round-display">
                <div className="round-text">ROUND {currentRound}</div>
                <div className="round-indicators">
                  <div className={`round-indicator ${playerWins >= 1 ? "won" : ""}`}></div>
                  <div className={`round-indicator ${playerWins >= 2 ? "won" : ""}`}></div>
                  <div className="vs-text">VS</div>
                  <div className={`round-indicator ${botWins >= 1 ? "won" : ""}`}></div>
                  <div className={`round-indicator ${botWins >= 2 ? "won" : ""}`}></div>
                </div>
              </div>
              <div className="timer">{matchTimer}</div>
            </div>

            <div className="opponent-info">
              <div className="opponent-health-container">
                <div className="health-bar-wrapper">
                  <div className="health-bar-outer">
                    <div className="health-bar-inner" style={{ width: `${botHealth}%` }}></div>
                  </div>
                </div>
                <div className="opponent-name">CPU</div>
              </div>
              <div className="character-portrait opponent-portrait">
                <img src="/assets/opponent-portrait.png" alt="Opponent" />
              </div>
            </div>
          </div>

          {/* Fighting arena with characters facing each other */}
          <div className="fighting-arena">
            {/* Combo counter */}
            {comboCount > 1 && (
              <div className="combo-counter">
                <span className="combo-number">{comboCount}</span>
                <span className="combo-text">HIT COMBO!</span>
              </div>
            )}

            {/* Hit effect */}
            {showHitEffect && (
              <div
                className="hit-effect"
                style={{
                  left: `${hitPosition.x}%`,
                  top: `${hitPosition.y}%`,
                }}
              >
                <div className="hit-splash"></div>
                <div className="hit-text">HIT!</div>
              </div>
            )}

            <div className={`player ${isPlayerAttacking ? `attacking-${attackType || "punch"}` : ""}`}>
              <img src={character?.image || "/assets/karate punch.png"} alt="Player" />
            </div>

            <div className={`bot ${isBotAttacking ? "attacking" : ""}`}>
              <img src="/assets/karate punch1.png" alt="Opponent" />
            </div>
          </div>

          {/* Message display */}
          <div className="message-container">
            <div className="message">{message}</div>
          </div>

          {/* Controls at bottom */}
          <div className="controls">
            <button
              className="attack-button punch-button"
              onClick={() => playerAttack("punch")}
              disabled={gameOver || !isMatchStarted}
            >
              PUNCH
            </button>
            <button
              className="attack-button kick-button"
              onClick={() => playerAttack("kick")}
              disabled={gameOver || !isMatchStarted}
            >
              KICK
            </button>
            <button
              className="attack-button special-button"
              onClick={() => playerAttack("special")}
              disabled={gameOver || !isMatchStarted || comboCount < 2}
            >
              SPECIAL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameplayScene
