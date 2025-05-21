import '../styles/ResultsScreen.css';

function ResultsScreen({ result, onPlayAgain, onMainMenu }) {
  const isVictory = result?.victory;
  
  return (
    <div className="results-screen">
        <div className="results-buttons">
          <div className='play-again' onClick={onPlayAgain}>
            <img src="assets/play-again.png" alt="" />
          </div>
          <div className='book-ticket' onClick={onMainMenu}>
            <img src="assets/Book-ticket.png" alt="" />
          </div>
        </div>
      </div>
  );
}

export default ResultsScreen;