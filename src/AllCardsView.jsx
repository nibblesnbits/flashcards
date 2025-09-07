import React from 'react';
import { BookOpen, Shuffle, RotateCcw } from 'lucide-react';
import { FlashCard } from './FlashCard';
import { CardEditor } from './CardEditor';

export const AllCardsView = ({
  cards,
  cardOrder,
  allCardsFlipped,
  setShowAll,
  setShowEditor,
  shuffleCards,
  resetProgress,
  exportCards,
  importCards,
  toggleCardFlip,
  showEditor,
  addCard,
  updateCard,
  deleteCard,
}) => {
  return (
    <div className="flashcard-app">
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
};
