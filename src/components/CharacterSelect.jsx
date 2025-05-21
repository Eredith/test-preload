import '../styles/CharacterSelection.css';

function CharacterSelect({ onCharacterSelect }) {
  const characters = [
    {
      id: 'daniel',
      name: 'Daniel',
      image: '/assets/daniel.png',
      portrait: '/assets/Daniel Style_1/Daniel_MiyagiStyle_01c_00000.png',
      mirrorPortrait: true,
      attackFrames: Array.from({ length: 79 }, (_, i) =>
        `/assets/Daniel Style_1/Daniel_MiyagiStyle_01c_${String(i).padStart(5, "0")}.png`
      ),
      idleImg: '/assets/Daniel Style_1/Daniel_MiyagiStyle_01c_00028.png',
    },
    {
      id: 'mrhan',
      name: 'Mr. Han',
      image: '/assets/mrhan.png',
      portrait: '/assets/Jakie_KungFu_Style_3/Jakie_KungFuStyle_03_00055.png',
      mirrorPortrait: true,
      attackFrames: Array.from({ length: 58 }, (_, i) =>
        `/assets/Jakie_KungFu_Style_3/Jakie_KungFuStyle_03_${String(i).padStart(5, "0")}.png`
      ),
      idleImg: '/assets/Jakie_KungFu_Style_3/Jakie_KungFuStyle_03_00000.png',
    }
  ];

  const handleSelect = (character) => {
    onCharacterSelect(character);
  };

  return (
    <div className="character-select-screen">
      <h2>Which Teacher Would You Like To Train With?</h2>
      
      <div className="characters-container">
        <div className="main-character-card">
          <div className="character-image-container">
          <img src="/assets/lifong.png" alt="lifong" />
        </div>
        <h3>Li-Fong</h3>
        </div>
        
        <div className="red-arrow">
          <img src="assets/red-arrow.png" alt="red arrow" />
        </div>

        {characters.map(character => (
          <div 
            key={character.id}
            className="character-card"
            onClick={() => handleSelect(character)}
          >
            <div className="character-image-container">
              <img src={character.image} alt={character.name} />
            </div>
            <h3>{character.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterSelect;