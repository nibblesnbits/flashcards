import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen } from 'lucide-react';

// Sample data structure - will be replaced by localStorage data
const sampleCards = [
  {
    id: 1,
    english: "Hello",
    arabic: "أهلا",
    romanization: "Ahlan"
  },
  {
    id: 2,
    english: "Thank you",
    arabic: "شكرا",
    romanization: "Shokran"
  },
  {
    id: 3,
    english: "Goodbye",
    arabic: "سلام",
    romanization: "Salam"
  },
  {
    id: 4,
    english: "Please",
    arabic: "لو سمحت",
    romanization: "Law samaḥt"
  },
  {
    id: 5,
    english: "Water",
    arabic: "مية",
    romanization: "Mayya"
  },
  {
    id: 6,
    english: "Food",
    arabic: "أكل",
    romanization: "Akl"
  },
  {
    id: 7,
    english: "House",
    arabic: "بيت",
    romanization: "Beet"
  },
  {
    id: 8,
    english: "Book",
    arabic: "كتاب",
    romanization: "Kitab"
  }
];


const FlashCard = ({ card, isFlipped, onFlip, className = "" }) => {
  return (
    <div 
      className={`flashcard-container ${className}`}
      onClick={onFlip}
    >
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        {/* Front side (English) */}
        <div className="flashcard-face flashcard-front">
          <div className="card-content">
            <div className="language-label">English</div>
            <div className="main-text">{card.english}</div>
            <div className="flip-hint">Click to flip</div>
          </div>
        </div>
        
        {/* Back side (Arabic + Romanization) */}
        <div className="flashcard-face flashcard-back">
          <div className="card-content">
            <div className="language-label">Arabic</div>
            <div className="main-text arabic-text" dir="rtl">{card.arabic}</div>
            <div className="romanization">{card.romanization}</div>
            <div className="flip-hint">Click to flip back</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="progress-text">
        {current + 1} of {total}
      </span>
    </div>
  );
};

const CardEditor = ({ cards, onAddCard, onUpdateCard, onDeleteCard, onClose }) => {
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({ english: '', arabic: '', romanization: '' });

  const handleAddCard = () => {
    if (newCard.english && newCard.arabic && newCard.romanization) {
      onAddCard(newCard);
      setNewCard({ english: '', arabic: '', romanization: '' });
    }
  };

  const handleUpdateCard = () => {
    if (editingCard && editingCard.english && editingCard.arabic && editingCard.romanization) {
      onUpdateCard(editingCard.id, editingCard);
      setEditingCard(null);
    }
  };

  return (
    <div className="card-editor-overlay">
      <div className="card-editor">
        <div className="editor-header">
          <h2>Manage Cards</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="editor-content">
          {/* Add new card form */}
          <div className="editor-section">
            <h3>Add New Card</h3>
            <div className="form-group">
              <label>English:</label>
              <input
                type="text"
                value={newCard.english}
                onChange={(e) => setNewCard({...newCard, english: e.target.value})}
                placeholder="Enter English word/phrase"
              />
            </div>
            <div className="form-group">
              <label>Arabic:</label>
              <input
                type="text"
                value={newCard.arabic}
                onChange={(e) => setNewCard({...newCard, arabic: e.target.value})}
                placeholder="Enter Arabic text"
                dir="rtl"
              />
            </div>
            <div className="form-group">
              <label>Romanization:</label>
              <input
                type="text"
                value={newCard.romanization}
                onChange={(e) => setNewCard({...newCard, romanization: e.target.value})}
                placeholder="Enter romanized pronunciation"
              />
            </div>
            <button className="btn-primary" onClick={handleAddCard}>Add Card</button>
          </div>

          {/* Edit existing card form */}
          {editingCard && (
            <div className="editor-section">
              <h3>Edit Card</h3>
              <div className="form-group">
                <label>English:</label>
                <input
                  type="text"
                  value={editingCard.english}
                  onChange={(e) => setEditingCard({...editingCard, english: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Arabic:</label>
                <input
                  type="text"
                  value={editingCard.arabic}
                  onChange={(e) => setEditingCard({...editingCard, arabic: e.target.value})}
                  dir="rtl"
                />
              </div>
              <div className="form-group">
                <label>Romanization:</label>
                <input
                  type="text"
                  value={editingCard.romanization}
                  onChange={(e) => setEditingCard({...editingCard, romanization: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleUpdateCard}>Update Card</button>
                <button className="btn-secondary" onClick={() => setEditingCard(null)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Cards list */}
          <div className="editor-section">
            <h3>Existing Cards ({cards.length})</h3>
            <div className="cards-list">
              {cards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-info">
                    <strong>{card.english}</strong> → {card.arabic} ({card.romanization})
                  </div>
                  <div className="card-actions">
                    <button className="btn-small" onClick={() => setEditingCard(card)}>Edit</button>
                    <button className="btn-small btn-danger" onClick={() => onDeleteCard(card.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardApp = ({ initialCards = sampleCards }) => {
  // Card management state
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardOrder, setCardOrder] = useState([...Array(initialCards.length).keys()]);
  const [showAll, setShowAll] = useState(false);
  const [allCardsFlipped, setAllCardsFlipped] = useState(new Set());
  const [showEditor, setShowEditor] = useState(false);
  
  // Refs for keyboard navigation
  const cardRef = useRef(null);
  
  // Load cards from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards);
        if (parsedCards && parsedCards.length > 0) {
          setCards(parsedCards);
          setCardOrder([...Array(parsedCards.length).keys()]);
        }
      } catch (error) {
        console.error('Error parsing saved cards:', error);
        // If there's an error, we'll stick with the default sample cards
      }
    }
  }, []);
  
  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);
  
  const currentCard = cards[cardOrder[currentIndex]];
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle keyboard shortcuts when editor is open
      if (showEditor) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          previousCard();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextCard();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          flipCard();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          shuffleCards();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetProgress();
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          setShowAll(!showAll);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setShowEditor(!showEditor);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, showAll, showEditor]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < cardOrder.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAllCardsFlipped(new Set());
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setAllCardsFlipped(new Set());
    setCardOrder([...Array(cards.length).keys()]);
  };

  const addCard = (newCard) => {
    const cardWithId = {
      ...newCard,
      id: Math.max(...cards.map(c => c.id), 0) + 1
    };
    const updatedCards = [...cards, cardWithId];
    setCards(updatedCards);
    setCardOrder([...Array(updatedCards.length).keys()]);
  };

  const updateCard = (cardId, updatedCard) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...updatedCard, id: cardId } : card
    );
    setCards(updatedCards);
  };

  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    setCardOrder([...Array(updatedCards.length).keys()]);
    if (currentIndex >= updatedCards.length) {
      setCurrentIndex(Math.max(0, updatedCards.length - 1));
    }
  };

  const exportCards = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashcards-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importCards = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedCards = JSON.parse(e.target.result);
          if (Array.isArray(importedCards) && importedCards.length > 0) {
            // Validate that imported cards have required fields
            const validCards = importedCards.filter(card => 
              card.english && card.arabic && card.romanization
            );
            if (validCards.length > 0) {
              setCards(validCards);
              setCardOrder([...Array(validCards.length).keys()]);
              setCurrentIndex(0);
              alert(`Successfully imported ${validCards.length} cards!`);
            } else {
              alert('No valid cards found in the file. Each card needs english, arabic, and romanization fields.');
            }
          } else {
            alert('Invalid file format. Expected an array of card objects.');
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const toggleCardFlip = (cardId) => {
    const newFlipped = new Set(allCardsFlipped);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setAllCardsFlipped(newFlipped);
  };

  if (showAll) {
    return (
      <div className="flashcard-app">
        <style jsx>{`
          .flashcard-app {
            width: 100%;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            box-sizing: border-box;
          }
          
          .app-header {
            text-align: center;
            margin-bottom: 2rem;
            color: white;
          }
          
          .app-title {
            font-size: 2.5rem;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .app-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 0.5rem 0;
          }
          
          .controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
          }
          
          .btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
          }
          
          .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
          }
          
          .btn:active {
            transform: translateY(0);
          }
          
          .file-input-label {
            cursor: pointer;
          }
          
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .flashcard-container {
            perspective: 1000px;
            height: 200px;
          }
          
          .flashcard {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s;
            cursor: pointer;
          }
          
          .flashcard.flipped {
            transform: rotateY(180deg);
          }
          
          .flashcard-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .flashcard-front {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
            color: #333;
            transform: rotateY(0deg);
          }
          
          .flashcard-back {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
            color: white;
            transform: rotateY(180deg);
          }
          
          .card-content {
            text-align: center;
            padding: 1rem;
          }
          
          .language-label {
            font-size: 0.8rem;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
          }
          
          .main-text {
            font-size: 1.5rem;
            margin: 0.5rem 0;
          }
          
          .arabic-text {
            font-size: 1.8rem;
            font-family: 'Noto Sans Arabic', 'Arial Unicode MS', serif;
          }
          
          .romanization {
            font-size: 1rem;
            font-style: italic;
            opacity: 0.8;
            margin: 0.5rem 0;
          }
          
          .flip-hint {
            font-size: 0.8rem;
            opacity: 0.6;
            margin-top: 0.5rem;
          }
          
          .keyboard-hints {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          }
          
          .keyboard-hints h3 {
            color: white;
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
          }
          
          .hints-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.9);
          }
          
          .hint-item {
            display: flex;
            justify-content: space-between;
          }
          
          .key {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
          }
        `}</style>
        
        <div className="app-header">
          <h1 className="app-title">
            <BookOpen size={40} />
            Arabic Flashcards
          </h1>
          <p className="app-subtitle">All Cards View - Click any card to flip</p>
        </div>
        
        <div className="controls">
          <button className="btn" onClick={() => setShowAll(false)}>
            Single Card Mode
          </button>
          <button className="btn" onClick={() => setShowEditor(true)}>
            Manage Cards
          </button>
          <button className="btn" onClick={shuffleCards}>
            <Shuffle size={18} />
            Shuffle Cards
          </button>
          <button className="btn" onClick={resetProgress}>
            <RotateCcw size={18} />
            Reset All
          </button>
          <button className="btn" onClick={exportCards}>
            Export Cards
          </button>
          <label className="btn file-input-label">
            Import Cards
            <input
              type="file"
              accept=".json"
              onChange={importCards}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        
        <div className="grid-container">
          {cardOrder.map((cardIndex) => {
            const card = cards[cardIndex];
            return (
              <FlashCard
                key={card.id}
                card={card}
                isFlipped={allCardsFlipped.has(card.id)}
                onFlip={() => toggleCardFlip(card.id)}
              />
            );
          })}
        </div>
        
        {showEditor && (
          <CardEditor
            cards={cards}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onClose={() => setShowEditor(false)}
          />
        )}
        
        <div className="keyboard-hints">
          <h3>Keyboard Shortcuts</h3>
          <div className="hints-grid">
            <div className="hint-item">
              <span>Single Card Mode</span>
              <span className="key">V</span>
            </div>
            <div className="hint-item">
              <span>Manage Cards</span>
              <span className="key">M</span>
            </div>
            <div className="hint-item">
              <span>Shuffle</span>
              <span className="key">S</span>
            </div>
            <div className="hint-item">
              <span>Reset</span>
              <span className="key">R</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-app">
      <style jsx>{`
        .flashcard-app {
          width: 100%;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          box-sizing: border-box;
        }
        
        .app-header {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
        }
        
        .app-title {
          font-size: 2.5rem;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .app-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0.5rem 0;
        }
        
        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: white;
        }
        
        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-weight: 500;
          min-width: 60px;
          text-align: right;
        }
        
        .card-area {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        
        .flashcard-container {
          perspective: 1000px;
          width: 400px;
          height: 250px;
        }
        
        .flashcard {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s;
          cursor: pointer;
        }
        
        .flashcard.flipped {
          transform: rotateY(180deg);
        }
        
        .flashcard-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .flashcard-front {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          color: #333;
          transform: rotateY(0deg);
        }
        
        .flashcard-back {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
          color: white;
          transform: rotateY(180deg);
        }
        
        .card-content {
          text-align: center;
          padding: 2rem;
        }
        
        .language-label {
          font-size: 0.9rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }
        
        .main-text {
          font-size: 2rem;
          margin: 1rem 0;
        }
        
        .arabic-text {
          font-size: 2.5rem;
          font-family: 'Noto Sans Arabic', 'Arial Unicode MS', serif;
        }
        
        .romanization {
          font-size: 1.2rem;
          font-style: italic;
          opacity: 0.8;
          margin: 1rem 0;
        }
        
        .flip-hint {
          font-size: 0.9rem;
          opacity: 0.6;
          margin-top: 1rem;
        }
        
        .navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .nav-btn:active {
          transform: translateY(0);
        }
        
        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .nav-btn:disabled:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: none;
        }
        
        .controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }
        
        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        .file-input-label {
          cursor: pointer;
        }
        
        .keyboard-hints {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          backdrop-filter: blur(10px);
        }
        
        .keyboard-hints h3 {
          color: white;
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
        }
        
        .hints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hint-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .key {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: monospace;
          font-weight: bold;
        }
        
        .card-editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .card-editor {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .editor-header h2 {
          margin: 0;
          color: #333;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .editor-content {
          padding: 2rem;
        }
        
        .editor-section {
          margin-bottom: 3rem;
        }
        
        .editor-section h3 {
          color: #333;
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          color: #555;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e1e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
        }
        
        .btn-primary, .btn-secondary, .btn-small, .btn-danger {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
        }
        
        .btn-primary:hover {
          background: #5a6fd8;
        }
        
        .btn-secondary {
          background: #f1f1f1;
          color: #333;
        }
        
        .btn-secondary:hover {
          background: #e1e1e1;
        }
        
        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          background: #f1f1f1;
          color: #333;
        }
        
        .btn-small:hover {
          background: #e1e1e1;
        }
        
        .btn-danger {
          background: #ff4757;
          color: white;
        }
        
        .btn-danger:hover {
          background: #ff3742;
        }
        
        .cards-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
        }
        
        .card-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .card-item:last-child {
          border-bottom: none;
        }
        
        .card-info {
          flex: 1;
          color: #333;
        }
        
        .card-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .flashcard-container {
            width: 100%;
            max-width: 350px;
            height: 220px;
          }
          
          .card-content {
            padding: 1.5rem;
          }
          
          .main-text {
            font-size: 1.7rem;
          }
          
          .arabic-text {
            font-size: 2rem;
          }
          
          .navigation {
            flex-wrap: wrap;
          }
          
          .nav-btn, .btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <div className="app-header">
        <h1 className="app-title">
          <BookOpen size={40} />
          Arabic Flashcards
        </h1>
        <p className="app-subtitle">Learn Arabic vocabulary with interactive flashcards</p>
      </div>
      
      <ProgressBar current={currentIndex} total={cardOrder.length} />
      
      <div className="card-area">
        <FlashCard
          ref={cardRef}
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={flipCard}
        />
      </div>
      
      <div className="navigation">
        <button 
          className="nav-btn"
          onClick={previousCard}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <button className="nav-btn" onClick={flipCard}>
          <RotateCcw size={20} />
          Flip Card
        </button>
        
        <button 
          className="nav-btn"
          onClick={nextCard}
          disabled={currentIndex === cardOrder.length - 1}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="controls">
        <button className="btn" onClick={() => setShowAll(true)}>
          View All Cards
        </button>
        <button className="btn" onClick={() => setShowEditor(true)}>
          Manage Cards
        </button>
        <button className="btn" onClick={shuffleCards}>
          <Shuffle size={18} />
          Shuffle Cards
        </button>
        <button className="btn" onClick={resetProgress}>
          <RotateCcw size={18} />
          Reset Progress
        </button>
        <button className="btn" onClick={exportCards}>
          Export Cards
        </button>
        <label className="btn file-input-label">
          Import Cards
          <input
            type="file"
            accept=".json"
            onChange={importCards}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      
      {showEditor && (
        <CardEditor
          cards={cards}
          onAddCard={addCard}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
          onClose={() => setShowEditor(false)}
        />
      )}
      
      <div className="keyboard-hints">
        <h3>Keyboard Shortcuts</h3>
        <div className="hints-grid">
          <div className="hint-item">
            <span>Previous Card</span>
            <span className="key">← / ↑</span>
          </div>
          <div className="hint-item">
            <span>Next Card</span>
            <span className="key">→ / ↓</span>
          </div>
          <div className="hint-item">
            <span>Flip Card</span>
            <span className="key">Space / Enter</span>
          </div>
          <div className="hint-item">
            <span>Shuffle</span>
            <span className="key">S</span>
          </div>
          <div className="hint-item">
            <span>Reset</span>
            <span className="key">R</span>
          </div>
          <div className="hint-item">
            <span>View All</span>
            <span className="key">V</span>
          </div>
          <div className="hint-item">
            <span>Manage Cards</span>
            <span className="key">M</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;
