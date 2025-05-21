"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/Gameplay.css";

export default function GameplayScene({ character, onGameOver }) {
  const FRAME_DURATION = 30;
  const BOT_ATTACK_RATE = 3000;
  const PLAYER_FRAMES = 36;
  const BOT_FRAMES = 80;

  const PLAYER_ATTACK = useMemo(
    () =>
      Array.from(
        { length: PLAYER_FRAMES },
        (_, i) =>
          `/assets/Li_FongStyle_01/Li_FongStyle_01_${String(i).padStart(
            5,
            "0"
          )}.png`
      ),
    []
  );
  const PLAYER_IDLE = "/assets/Li_FongStyle_01/Li_FongStyle_01_00000.png";

  const BOT_ATTACK = useMemo(
    () =>
      character?.attackFrames ??
      Array.from(
        { length: BOT_FRAMES },
        (_, i) =>
          `/assets/Default_KungFu_Style/Default_KungFuStyle_${String(
            i
          ).padStart(5, "0")}.png`
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

  const rafId = useRef(null);
  const comboTimer = useRef(null);

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
    setMessage("FIGHT!");
    setIsMatchStarted(true);
    const id = setTimeout(() => setCountdown(null), 1000);
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
    setMessage(winner === "player" ? "YOU WIN!" : "YOU LOSE!");
    setGameOver(true);

    // Since we only need 1 round, the match is always done after one round
    setTimeout(() => {
      // Call onGameOver with the result
      onGameOver({ victory: winner === "player" });
    }, 2000);
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
              <div className="game-over-text">
                {playerHP > botHP ? "YOU WIN!" : "YOU LOSE!"}
              </div>
            </div>
          )}

          {/* HUD */}
          <div className="game-hud">
            {/* player */}
            <div className="player-info">
              <div className="character-portrait player-portrait">
                <img src="/assets/lifong.png" alt="Player" />
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
                <div className="player-name">PLAYER</div>
              </div>
            </div>

            {/* round / timer */}
            <div className="match-info">
              <div className="round-display">
                <div className="round-text">ROUND {round}</div>
                <div className="round-indicators">
                  <div
                    className={`round-indicator ${
                      playerWins >= 1 ? "won" : ""
                    }`}
                  />
                  <div className="vs-text">VS</div>
                  <div
                    className={`round-indicator ${botWins >= 1 ? "won" : ""}`}
                  />
                </div>
              </div>
              <div className="timer">{matchTimer}</div>
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
                <div className="opponent-name">CPU</div>
              </div>
              <div className="character-portrait opponent-portrait">
                <img
                  src={character?.portrait || "/assets/player-portrait.png"}
                  alt="Opponent"
                  className={character?.mirrorPortrait ? "mirrored-image" : ""}
                />
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
              <img src={playerImg} alt="Player" draggable={false} />
            </div>
            <div className="bot">
              <img
                src={botImg}
                alt="Bot"
                draggable={false}
                className={character?.mirrorPortrait ? "mirrored-image" : ""}
              />
            </div>
          </div>

          {/* kontrol */}
          <div className="controls">
            <button
              className="attack-button punch-button"
              onClick={playerAttack}
              disabled={gameOver || !isMatchStarted}
            >
              PUNCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
