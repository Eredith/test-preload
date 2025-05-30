import '../styles/mainmenu.css';
import CharacterSelect from './CharacterSelect';

function MainMenu({ onStartClick }) {
  return (
        <div className="main-menu-container">

    <div className="main-menu">
      <div className="title-container">
        <img 
          src="/assets/title.png" 
          alt="Karate Kids Legends" 
          className="game-title-menu"
        />
      </div>
      <div className="char-options">
        <CharacterSelect onCharacterSelect={onStartClick} />
      </div>
      <div className="tap-select">
        <img src="/assets/tap.png" alt="tap-hand" />
      </div>
    </div>
        </div>

  )
}

export default MainMenu