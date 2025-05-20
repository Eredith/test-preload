import '../styles/mainMenu.css';
import CharacterSelect from './CharacterSelect';

function MainMenu({ onStartClick }) {
  return (
    <div className="main-menu">
      <div className="title-container">
        <img 
          src="/assets/title.png" 
          alt="Karate Kids Legends" 
          className="game-title"
        />
      </div>
      <div className="char-options">
        <CharacterSelect onCharacterSelect={onStartClick} />
      </div>
    </div>
  )
}

export default MainMenu