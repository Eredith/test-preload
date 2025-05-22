import React, { useState, useEffect } from 'react';
import '../styles/preloader.css';
import assetCache from '../utils/AssetCache';

const Preloader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // List all game assets to preload
  const assetsToPreload = [
    // UI Elements
    '/assets/audio.png',
    '/assets/Book-ticket.png',
    '/assets/close.png',
    '/assets/end-screen.png',
    '/assets/Fight-Button.png',
    '/assets/game-bg.png',
    '/assets/karate punch.png',
    '/assets/karate punch1.png',
    '/assets/main-bg.png',
    '/assets/play-again.png',
    '/assets/red-arrow.png',
    '/assets/tap-fight.png',
    '/assets/tap.png',
    '/assets/textwhich.png',
    '/assets/timer-cd.png',
    '/assets/title.png',
    
    // Character Images
    '/assets/daniel.png',
    '/assets/daniel-glow.png',
    '/assets/lifong.png',
    '/assets/mrhan.png',
    '/assets/mr-han glow.png',
    '/assets/player-portrait.png',
    
    // Character Animation Frames - First frames only (to reduce initial load)
    '/assets/Li_FongStyle_01/Li_FongStyle_01_00000.png',
    '/assets/Daniel Style_1/Daniel_MiyagiStyle_01c_00000.png',
    '/assets/Jakie_KungFu_Style_3/Jakie_KungFuStyle_03_00000.png',
    '/assets/Default_KungFu_Style/Default_KungFuStyle_00000.png',
    
    // Victory screen
    '/assets/victory-image.png'
  ];

  useEffect(() => {
    let loadedAssets = 0;
    const totalAssets = assetsToPreload.length;

    // Function to update progress
    const updateProgress = () => {
      loadedAssets++;
      const newProgress = Math.floor((loadedAssets / totalAssets) * 100);
      setProgress(newProgress);
      
      if (loadedAssets === totalAssets) {
        // All assets loaded
        setTimeout(() => {
          setIsLoading(false);
          if (onLoadComplete) onLoadComplete();
        }, 500); // Small delay to show 100%
      }
    };

    // Preload all images
    assetsToPreload.forEach(assetUrl => {
      const img = new Image();
      img.src = assetUrl;
      img.onload = () => {
        // Store the loaded image in cache using path as key
        assetCache.addImage(assetUrl, img);
        updateProgress();
      };
      img.onerror = updateProgress; // Count errors as loaded to prevent blocking
    });
  }, [onLoadComplete]);

  return (
    <div className={`preloader ${isLoading ? 'active' : 'fade-out'}`}>
      <div className="preloader-content">
        <img src="/assets/title.png" alt="Karate Kids Legends" className="preloader-logo" />
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">{progress}%</div>
        {progress === 100 && <div className="loading-text">Get Ready!</div>}
      </div>
    </div>
  );
};

export default Preloader;