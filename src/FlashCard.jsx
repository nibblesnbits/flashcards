import { useEffect, useState } from 'react';

export const FlashCard = ({ card, isFlipped, onFlip, className = "" }) => {
    const [romanizationVisible, setRomanizationVisible] = useState(false);

    const reveal = (e) => {
        // Prevent the card from flipping when clicking the button
        e.stopPropagation();
        setRomanizationVisible(true);
    };

    useEffect(() => {
        if (!isFlipped) {
            setRomanizationVisible(false);
        }
    }, [isFlipped]);

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
                        {romanizationVisible ? (
                            <div className="romanization">{card.romanization}</div>
                        ) : (
                            <button className="btn reveal-btn" onClick={reveal}>
                                Reveal Romanization
                            </button>
                        )}
                        <div className="flip-hint">Click to flip back</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
