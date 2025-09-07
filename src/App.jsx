import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen } from 'lucide-react';
import './App.css';
import { sampleCards } from './sampleCards';
import { FlashCard } from './FlashCard';
import { ProgressBar } from './ProgressBar';
import { CardEditor } from './CardEditor';
import { AllCardsView } from './AllCardsView';

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
          alert('Error parsing JSON file. Please check the format.', error);
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
      <AllCardsView
        cards={cards}
        cardOrder={cardOrder}
        allCardsFlipped={allCardsFlipped}
        setShowAll={setShowAll}
        setShowEditor={setShowEditor}
        shuffleCards={shuffleCards}
        resetProgress={resetProgress}
        exportCards={exportCards}
        importCards={importCards}
        toggleCardFlip={toggleCardFlip}
        showEditor={showEditor}
        addCard={addCard}
        updateCard={updateCard}
        deleteCard={deleteCard}
      />
    );
  }

  return (
    <div className="flashcard-app">
      
      
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
