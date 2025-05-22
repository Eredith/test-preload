/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/gameplay.css";

export default function GameplayScene({ character, onGameOver }) {
  const FRAME_DURATION = 30;
  const BOT_ATTACK_RATE = 3000;
  const PLAYER_FRAMES = 36;
  const BOT_FRAMES = character?.attackFrames?.length;

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
  const [buttonPressed, setButtonPressed] = useState(false);

// audio sfx
const countdownSoundRef = useRef(null);
const hitSoundRef = useRef(null);
const bgmRef = useRef(null);
const growlSoundRef = useRef(null);
const victorySoundRef = useRef(null);
const loseSoundRef = useRef(null);
  const [bgmPlaying, setBgmPlaying] = useState(false);

// Add this function to play the victory sound
const playVictorySound = () => {
  if (victorySoundRef.current) {
    victorySoundRef.current.currentTime = 0;
    victorySoundRef.current.play().catch(err => console.error("Error playing victory sound:", err));
  }
};

// Add a function to play the lose sound
const playLoseSound = () => {
  if (loseSoundRef.current) {
    loseSoundRef.current.currentTime = 0;
    loseSoundRef.current.play().catch(err => console.error("Error playing lose sound:", err));
  }
};

// Add these functions to play sounds
const playCountdownSound = () => {
  if (countdownSoundRef.current) {
    countdownSoundRef.current.currentTime = 0;
    countdownSoundRef.current.play()
      .catch(err => console.error("Error playing countdown sound:", err));
  }
};

const playHitSound = () => {
    if (hitSoundRef.current) {
      hitSoundRef.current.currentTime = 0; // Reset the audio to start
      hitSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
    }
  };

  // Add a function to play the growl sound
const playGrowlSound = () => {
  if (growlSoundRef.current) {
    growlSoundRef.current.currentTime = 0;
    growlSoundRef.current.play().catch(err => console.error("Error playing growl sound:", err));
  }
};

  // Function to handle background music
  const toggleBgm = () => {
    if (bgmRef.current) {
      if (bgmPlaying) {
        bgmRef.current.pause();
      } else {
        bgmRef.current.play().catch(err => console.error("Error playing BGM:", err));
      }
      setBgmPlaying(!bgmPlaying);
    }
  };

  const rafId = useRef(null);
  const comboTimer = useRef(null);

useEffect(() => {
    if (bgmRef.current && !bgmPlaying) {
      bgmRef.current.volume = 0.5; // Set volume to 50%
      bgmRef.current.loop = true; // Loop the BGM
      bgmRef.current.play()
        .then(() => setBgmPlaying(true))
        .catch(err => console.error("Error auto-playing BGM:", err));
    }
  }, [isMatchStarted, bgmPlaying]);

  // Stop BGM when game is over
  useEffect(() => {
  if (gameOver && bgmRef.current && bgmPlaying) {
    // Store the interval reference globally so we can clear it from anywhere
    if (window._bgmFadeOutInterval) {
      clearInterval(window._bgmFadeOutInterval);
    }
    
    // Immediate stop without fade for cleaner transition
    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
    bgmRef.current.volume = 0.5; // Reset volume
    setBgmPlaying(false);
  }
}, [gameOver, bgmPlaying]);

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
  
if (countdown === 3) {
    // Play sound only at the first count (3)
    playCountdownSound();
  }

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
  
  // Play appropriate sound based on who won
  if (winner === "player") {
    playVictorySound();
  } else {
    playLoseSound();
  }

  // Cleanup all audio-related timers
  if (window._bgmFadeOutInterval) {
    clearInterval(window._bgmFadeOutInterval);
  }
  
  // Create a consistent way to handle BGM stopping
  const stopBgm = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      bgmRef.current.volume = 0.5; // Reset volume for next time
      setBgmPlaying(false);
    }
  };
  
  // Stop BGM immediately
  stopBgm();

  // Cleanup animations
  cancelAnimationFrame(rafId.current);
  clearTimeout(comboTimer.current);

  // Since we only need 1 round, the match is always done after one round
  setTimeout(() => {
    // Double-check BGM is fully stopped before transitioning
    stopBgm();
    
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
     // Play the growl sound when attacking
  playGrowlSound();
        playHitSound(); // Play sound when hit shows

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
     // Play the growl sound when attacking
        playGrowlSound();
        playHitSound(); // Play sound when hit shows

    setTimeout(() => setShowHit(false), 300);
    setMessage(`OPPONENT HITS YOU! ${dmg} DMG!`);
    setCombo(0);
  }

  const playerImg =
    playerMode === "attack" ? PLAYER_ATTACK[playerFrame] : PLAYER_IDLE;
  const botImg = botMode === "attack" ? BOT_ATTACK[botFrame] : BOT_IDLE;

  return (
    <div className="gameplay-container">
      {/* Add the audio element at the top level of your return */}
      <audio 
        ref={hitSoundRef} 
        src="/assets/sounds/hit-sound-1.mp3"
        preload="auto"
      />
      <audio 
        ref={bgmRef} 
        src="/assets/sounds/bgm-chinese.mp3"
        preload="auto"
      />
      <audio 
      ref={countdownSoundRef}
      src="/assets/sounds/countdown.mp3"
      preload="auto"
    />
    {/* Add the new growl sound */}
    <audio 
      ref={growlSoundRef}
      src="/assets/sounds/growl.mp3"
      preload="auto"
    />
    {/* Add the victory sound */}
    <audio 
      ref={victorySoundRef}
      src="/assets/sounds/victory.mp3"
      preload="auto"
    />
    {/* Add the lose sound */}
    <audio 
      ref={loseSoundRef}
      src="/assets/sounds/lose.mp3"
      preload="auto"
    />
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
                <img 
                  src="/assets/victory-image.png" 
                  alt="Victory" 
                  className="victory-image"
                />
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
                <div className="player-name">LI FONG</div>
              </div>
            </div>

            {/* round / timer */}
            <div className="match-info">
              <div className="round-display">
                <div className="title-container">
        <img 
          src="/assets/title.png" 
          alt="Karate Kids Legends" 
          className="game-title"
        />
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
              <img 
                src={buttonPressed ? "./assets/Fight-Button.png" : "./assets/tap-fight.png"} 
                alt="Punch" 
              />
          </div>
           <div className="book-button">
            <img src="/assets/Book-ticket.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
