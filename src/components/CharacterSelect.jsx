import '../styles/CharacterSelection.css';

function CharacterSelect({ onCharacterSelect }) {
  const characters = [
    {
      id: 'daniel',
      name: 'Daniel',
      image: '/assets/daniel.png'
    },
    {
      id: 'mrhan',
      name: 'Mr. Han',
      image: '/assets/mrhan.png'
    }
  ];

  // When character is clicked, immediately call onCharacterSelect
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