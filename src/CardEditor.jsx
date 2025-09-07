import { useState } from 'react';

export const CardEditor = ({ cards, onAddCard, onUpdateCard, onDeleteCard, onClose }) => {
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
                onChange={(e) => setNewCard({ ...newCard, english: e.target.value })}
                placeholder="Enter English word/phrase" />
            </div>
            <div className="form-group">
              <label>Arabic:</label>
              <input
                type="text"
                value={newCard.arabic}
                onChange={(e) => setNewCard({ ...newCard, arabic: e.target.value })}
                placeholder="Enter Arabic text"
                dir="rtl" />
            </div>
            <div className="form-group">
              <label>Romanization:</label>
              <input
                type="text"
                value={newCard.romanization}
                onChange={(e) => setNewCard({ ...newCard, romanization: e.target.value })}
                placeholder="Enter romanized pronunciation" />
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
                  onChange={(e) => setEditingCard({ ...editingCard, english: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Arabic:</label>
                <input
                  type="text"
                  value={editingCard.arabic}
                  onChange={(e) => setEditingCard({ ...editingCard, arabic: e.target.value })}
                  dir="rtl" />
              </div>
              <div className="form-group">
                <label>Romanization:</label>
                <input
                  type="text"
                  value={editingCard.romanization}
                  onChange={(e) => setEditingCard({ ...editingCard, romanization: e.target.value })} />
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
