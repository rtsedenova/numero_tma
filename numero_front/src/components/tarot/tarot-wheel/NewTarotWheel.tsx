import { FC, useState, useRef, useEffect } from "react";
import { NewTarotCard } from "./NewTarotCard";
import "./NewTarotWheel.scss";

export interface NewTarotWheelCard {
  id: string | number;
  image: string;
  alt: string;
}

interface NewTarotWheelProps {
  cards: NewTarotWheelCard[];
  className?: string;
}

export const NewTarotWheel: FC<NewTarotWheelProps> = ({ cards, className }) => {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isDraggingState, setIsDraggingState] = useState(false);
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPosition = useRef(1);

  const totalCards = 26;
  const totalPositions = 78;
  const angleStep = 360 / totalCards;

  // Calculate which card position (0-25) and which turn (0-2)
  const currentCardIndex = (currentPosition - 1) % totalCards; // 0-25
  const currentTurn = Math.floor((currentPosition - 1) / totalCards); // 0, 1, or 2
  const currentCardNumber = currentCardIndex + 1 + (currentTurn * totalCards); // The effective card number (1-78)

  // Calculate rotation angle - must allow full 3 rotations (0 to -1080 degrees)
  const rotationAngle = -((currentPosition - 1) * angleStep);
  
  // Track marker card (card index 0) - this is the card that marks when we complete a turn
  const markerCardIndex = 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsDraggingState(true);
    startX.current = e.clientX;
    startPosition.current = currentPosition;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - startX.current;
    // Sensitivity: 5 pixels per position (~390px drag for all 78 positions)
    const positionDelta = Math.round(-deltaX / 24);
    const newPosition = startPosition.current + positionDelta;
    
    // Clamp between 1 and 78
    const clampedPosition = Math.max(1, Math.min(totalPositions, newPosition));
    setCurrentPosition(clampedPosition);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDragging.current = false;
      setIsDraggingState(false);
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  return (
    <div 
      className={`new-tarot-wheel ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Selected card indicator at the top */}
      <div className="new-tarot-wheel__selected">
        <div className="new-tarot-wheel__selected-label">Выбранная карта</div>
        <div className="new-tarot-wheel__selected-number">{currentCardNumber}</div>
        <div className="new-tarot-wheel__selected-detail">
          Карта {currentCardIndex + 1} (Круг {currentTurn + 1})
        </div>
      </div>

      <div 
        className={`new-tarot-wheel__cards-container ${isDraggingState ? 'new-tarot-wheel__cards-container--dragging' : ''}`}
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          willChange: isDraggingState ? 'transform' : 'auto',
        }}
      >
        {cards.map((card, index) => {
          const angle = index * angleStep;
          const isMarker = index === markerCardIndex;
          const cardEffectiveNumber = index + 1 + (currentTurn * totalCards);
          
          return (
            <NewTarotCard
              key={card.id}
              card={card}
              angle={angle}
              isMarker={isMarker}
              cardNumber={cardEffectiveNumber}
            />
          );
        })}
      </div>
      
      {/* Turn tracking info */}
      <div className="new-tarot-wheel__turn-tracker">
        <div className="new-tarot-wheel__turn-label">Круг (Turn)</div>
        <div className="new-tarot-wheel__turn-number">{currentTurn + 1} / 3</div>
        <div className="new-tarot-wheel__turn-detail">
          {currentTurn === 0 && "Карты 1-26"}
          {currentTurn === 1 && "Карты 27-52"}
          {currentTurn === 2 && "Карты 53-78"}
        </div>
      </div>
      
      {/* Position indicator */}
      <div className="new-tarot-wheel__position">
        <div>Позиция: {currentCardNumber} / {totalPositions}</div>
        <div className="new-tarot-wheel__rotation-info">
          Полных оборотов: {currentTurn}
        </div>
      </div>
    </div>
  );
};
