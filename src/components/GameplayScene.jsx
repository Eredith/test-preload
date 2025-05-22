/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/gameplay.css";
import assetCache from '../utils/AssetCache';

export default function GameplayScene({ character, onGameOver }) {
  const FRAME_DURATION = 30;
  const BOT_ATTACK_RATE = 3000;
  const PLAYER_FRAMES = 36;
  const BOT_FRAMES = character?.attackFrames?.length;

  const PLAYER_ATTACK = useMemo(
    () =>
      Array.from(
        { length: PLAYER_FRAMES },
        (_, i) => {
          const path = `/assets/Li_FongStyle_01/Li_FongStyle_01_${String(i).padStart(5, "0")}.png`;
          // Use cached asset if available or fall back to path
          return path;
        }
      ),
    []
  );
  const PLAYER_IDLE = "/assets/Li_FongStyle_01/Li_FongStyle_01_00000.png";

  const BOT_ATTACK = useMemo(
    () =>
      character?.attackFrames ??
      Array.from(
        { length: BOT_FRAMES },
        (_, i) => {
          const path = `/assets/Default_KungFu_Style/Default_KungFuStyle_${String(i).padStart(5, "0")}.png`;
          return path;
        }
      ),
    [character]
  );
  const BOT_IDLE =
    character?.idleImg ??
    "/assets/Default_KungFu_Style/Default_KungFuStyle_00000.png";

  const [playerHP, setPlayerHP] = useState(100);
  const [botHP, setBotHP] = useState(100);
  const [message, setMessage] = useState("Fight!");
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [botWins, setBotWins] = useState(0);
  const [matchTimer, setMatchTimer] = useState(60);
  const [countdown, setCountdown] = useState(3);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerMode, setPlayerMode] = useState("idle");
  const [botMode, setBotMode] = useState("idle");
  const [playerFrame, setPlayerFrame] = useState(0);
  const [botFrame, setBotFrame] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showHit, setShowHit] = useState(false);
  const [hitPos, setHitPos] = useState({ x: 50, y: 40 });
  const [buttonPressed, setButtonPressed] = useState(false);

  const rafId = useRef(null);
  const comboTimer = useRef(null);

const renderCachedImage = (src, alt, className = '') => {
    const cachedImg = assetCache.getImage(src);
    if (cachedImg) {
      // If we have the cached image, create an efficient rendering
      return (
        <img 
          src={cachedImg.src} 
          alt={alt} 
          className={className} 
          draggable={false} 
        />
      );
    }
    // Fallback to normal image tag if not cached
    return <img src={src} alt={alt} className={className} draggable={false} />;
  };

  useEffect(() => {
    let lastTime = 0;
    let playerTimeAccumulator = 0;
    let botTimeAccumulator = 0;

    const loop = (timestamp) => {
      if (lastTime === 0) {
        lastTime = timestamp;
      }
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Player animation
      if (playerMode === "attack") {
        playerTimeAccumulator += deltaTime;
        if (playerTimeAccumulator >= FRAME_DURATION) {
          const framesToAdvance = Math.floor(
            playerTimeAccumulator / FRAME_DURATION
          );
          setPlayerFrame(
            (prevFrame) => (prevFrame + framesToAdvance) % PLAYER_FRAMES
          );
          playerTimeAccumulator = playerTimeAccumulator % FRAME_DURATION;
        }
      } else {
        setPlayerFrame(0);
        playerTimeAccumulator = 0;
      }

      // Bot animation
      if (botMode === "attack") {
        botTimeAccumulator += deltaTime;
        if (botTimeAccumulator >= FRAME_DURATION) {
          const framesToAdvance = Math.floor(
            botTimeAccumulator / FRAME_DURATION
          );
          setBotFrame(
            (prevFrame) => (prevFrame + framesToAdvance) % BOT_FRAMES
          );
          botTimeAccumulator = botTimeAccumulator % FRAME_DURATION;
        }
      } else {
        setBotFrame(0);
        botTimeAccumulator = 0;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [playerMode, botMode, PLAYER_FRAMES, BOT_FRAMES, FRAME_DURATION]);

  useEffect(() => {
  if (countdown === null) return;
  
  if (countdown > 0) {
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }
  
  // When countdown hits 0
  setMessage("FIGHT!");
  setIsMatchStarted(true); // Enable gameplay immediately
  
  // Just clear the countdown message after 1 second but don't delay gameplay
  const id = setTimeout(() => {
    setCountdown(null);
    setMessage(""); // Optional: clear the message
  }, 1000);
  
  return () => clearTimeout(id);
}, [countdown]);

  useEffect(() => {
    if (!isMatchStarted || gameOver || matchTimer <= 0) return;
    const id = setTimeout(() => setMatchTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [isMatchStarted, gameOver, matchTimer]);

  useEffect(() => {
    if (!isMatchStarted || gameOver) return;
    const id = setInterval(botAttack, BOT_ATTACK_RATE);
    return () => clearInterval(id);
  }, [isMatchStarted, gameOver]);

  function endRound(winner) {
    // Set winner
    winner === "player" ? setPlayerWins(1) : setBotWins(1);

    // Update message
    setGameOver(true);

    // Since we only need 1 round, the match is always done after one round
    setTimeout(() => {
      // Call onGameOver with the result
      onGameOver({ victory: winner === "player" });
    }, 3000);
  }

  function playerAttack() {
    if (!isMatchStarted || gameOver || playerMode === "attack") return;

    setPlayerMode("attack");
    setTimeout(() => setPlayerMode("idle"), PLAYER_FRAMES * FRAME_DURATION);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 2000);

    const base = Math.floor(Math.random() * 11) + 5; // 5-15
    const dmg = nextCombo > 1 ? Math.floor(base * (1 + nextCombo * 0.1)) : base;

    setBotHP((prev) => {
      const hp = Math.max(0, prev - dmg);
      if (hp === 0) endRound("player");
      return hp;
    });

    setHitPos({ x: 60 + Math.random() * 20, y: 30 + Math.random() * 40 });
    setShowHit(true);
    setTimeout(() => setShowHit(false), 300);
    setMessage(`${nextCombo} HIT COMBO! ${dmg} DMG!`);
  }

  function botAttack() {
    if (!isMatchStarted || gameOver) return;

    setBotMode("attack");
    setTimeout(() => setBotMode("idle"), BOT_FRAMES * FRAME_DURATION);

    const dmg = Math.floor(Math.random() * 10) + 3;

    setPlayerHP((prev) => {
      const hp = Math.max(0, prev - dmg);
      if (hp === 0) endRound("bot");
      return hp;
    });

    setHitPos({ x: 20 + Math.random() * 20, y: 30 + Math.random() * 40 });
    setShowHit(true);
    setTimeout(() => setShowHit(false), 300);
    setMessage(`OPPONENT HITS YOU! ${dmg} DMG!`);
    setCombo(0);
  }

  const playerImg =
    playerMode === "attack" ? PLAYER_ATTACK[playerFrame] : PLAYER_IDLE;
  const botImg = botMode === "attack" ? BOT_ATTACK[botFrame] : BOT_IDLE;

  return (
    <div className="gameplay-container">
      {/* countdown */}
      {countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown">
            {countdown === 0 ? "FIGHT!" : countdown}
          </div>
        </div>
      )}

      <div className="arcade-frame">
        <div className="arcade-screen">
          {/* game-over */}
          {gameOver && (
            <div className="game-over-overlay">
              <div className="victory-image-container">
                {renderCachedImage("/assets/victory-image.png", "Victory", "victory-image")}
              </div>
            </div>
          )}

          {/* HUD */}
          <div className="game-hud">
            {/* player */}
            <div className="player-info">
              <div className="character-portrait player-portrait">
                {renderCachedImage("/assets/lifong.png", "Player")}
              </div>
              <div className="player-health-container">
                <div className="health-bar-wrapper">
                  <div className="health-bar-outer">
                    <div
                      className="health-bar-inner"
                      style={{ width: `${playerHP}%` }}
                    />
                  </div>
                </div>
                <div className="player-name">LI FONG</div>
              </div>
            </div>

            {/* round / timer */}
            <div className="match-info">
              <div className="round-display">
                <div className="title-container">
                  {renderCachedImage("/assets/title.png", "Karate Kids Legends", "game-title")}
                </div>
              </div>
              <div className="timer">TIME : {matchTimer}</div>
            </div>

            {/* bot */}
            <div className="opponent-info">
              <div className="opponent-health-container">
                <div className="health-bar-wrapper">
                  <div className="health-bar-outer">
                    <div
                      className="health-bar-inner"
                      style={{ width: `${botHP}%` }}
                    />
                  </div>
                </div>
                <div className="opponent-name">{character?.name || "CPU"}</div>
              </div>
              <div className="character-portrait opponent-portrait">
                {renderCachedImage(
                  character?.portrait || "/assets/player-portrait.png", 
                  "Opponent", 
                  character?.mirrorPortrait ? "mirrored-image" : ""
                )}
              </div>
            </div>
          </div>

          {/* arena */}
          <div className="fighting-arena">
            {combo > 1 && (
              <div className="combo-counter">
                <span className="combo-number">{combo}</span>
                <span className="combo-text">HIT COMBO!</span>
              </div>
            )}

            {showHit && (
              <div
                className="hit-effect"
                style={{ left: `${hitPos.x}%`, top: `${hitPos.y}%` }}
              >
                <div className="hit-splash" />
                <div className="hit-text">HIT!</div>
              </div>
            )}

            <div className="player">
              {renderCachedImage(playerImg, "Player")}
            </div>
            <div className="bot">
              {renderCachedImage(
                botImg, 
                "Bot", 
                character?.mirrorPortrait ? "mirrored-image" : ""
              )}
            </div>
          </div>

          {/* kontrol */}
          <div 
            className="fight-button" 
            onClick={playerAttack}
            onMouseDown={() => !gameOver && isMatchStarted && setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            onMouseLeave={() => setButtonPressed(false)}
            onTouchStart={() => !gameOver && isMatchStarted && setButtonPressed(true)}
            onTouchEnd={() => setButtonPressed(false)}
            disabled={gameOver || !isMatchStarted}
          >
              {renderCachedImage(
                buttonPressed ? "/assets/Fight-Button.png" : "/assets/tap-fight.png", 
                "Punch"
              )}
          </div>
           <div className="book-button">
            {renderCachedImage("/assets/Book-ticket.png", "")}
          </div>
        </div>
      </div>
    </div>
  );
}
