import '../styles/ResultsScreen.css';

function ResultsScreen({ result, onPlayAgain, onMainMenu }) {
  const isVictory = result?.victory;
  
  return (
    <div className="results-screen">
      <div className="results-content">
        <h2 className={isVictory ? "victory-title" : "defeat-title"}>
          {isVictory ? "VICTORY!" : "DEFEAT"}
        </h2>
        
        <div className="results-image">
          <img 
            src={isVictory ? "/assets/victory.png" : "/assets/defeat.png"} 
            alt={isVictory ? "Victory" : "Defeat"} 
          />
        </div>
        
        <p className="results-message">
          {isVictory 
            ? "You have proven yourself a true master of martial arts!" 
            : "Your journey is not over. Train harder and try again!"}
        </p>
        
        <div className="results-buttons">
          <button onClick={onPlayAgain} className="play-again-button">
            Play Again
          </button>
          <button onClick={onMainMenu} className="main-menu-button">
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;