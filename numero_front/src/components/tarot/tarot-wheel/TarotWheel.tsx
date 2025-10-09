import { FC, useState, useRef } from 'react';
import { TarotCard } from './TarotCard';
import './TarotWheel.scss';

export interface TarotWheelCard {
  id: string | number;
  image: string;
  alt: string;
}

interface TarotWheelProps {
  cards: TarotWheelCard[];
  onCardSelect?: (card: TarotWheelCard) => void;
  wheelRadius?: number;
}

/**
 * SpinningWheel - Interactive circular tarot wheel that spins and allows card selection
 * Based on: https://github.com/Ravirajkatkar/Tarot-Card-Wheel
 */
export const TarotWheel: FC<TarotWheelProps> = ({
  cards,
  onCardSelect,
  wheelRadius = 300,
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedCard, setSelectedCard] = useState<TarotWheelCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFullCard, setShowFullCard] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const currentRotation = useRef(0);

  // Calculate which card is at the center (top)
  const getCenteredCardIndex = () => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const anglePerCard = 360 / cards.length;
    const index = Math.round(normalizedRotation / anglePerCard) % cards.length;
    return (cards.length - index) % cards.length;
  };


  // Handle card click
  const handleCardClick = (card: TarotWheelCard, index: number) => {
    if (selectedCard) return;
    
    const centeredIndex = getCenteredCardIndex();
    if (index !== centeredIndex) return; // Only allow clicking centered card
    
    setSelectedCard(card);
    setIsFlipping(true);

    // After flip animation, show full card
    setTimeout(() => {
      setIsFlipping(false);
      setShowFullCard(true);
      onCardSelect?.(card);
    }, 1500);
  };

  // Reset the wheel
  const resetWheel = () => {
    setSelectedCard(null);
    setShowFullCard(false);
    setIsFlipping(false);
    setRotation(0);
  };

  // Mouse/Touch drag to spin
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedCard) return;
    
    isDragging.current = true;
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    startAngle.current = angle - (currentRotation.current * Math.PI / 180);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || selectedCard) return;

    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const rotation = ((angle - startAngle.current) * 180 / Math.PI);
    
    currentRotation.current = rotation;
    setRotation(rotation);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const centeredCardIndex = getCenteredCardIndex();

  return (
    <div className="spinning-wheel">    
      {/* Full Card Display */}
      {showFullCard && selectedCard && (
        <div className="spinning-wheel__full-card">
          <div className="spinning-wheel__full-card-content">
            <img src={selectedCard.image} alt={selectedCard.alt} />
            <h3>{selectedCard.alt}</h3>
            <button onClick={resetWheel} className="spinning-wheel__reset-btn">
              Draw Another Card
            </button>
          </div>
        </div>
      )}

      {/* Bottom indicator pointing up to centered card */}
      <div className="spinning-wheel__indicator">
        <div className="spinning-wheel__indicator-arrow"></div>
      </div>

      {/* Wheel Container */}
      <div 
        ref={wheelRef}
        className={`spinning-wheel__container ${selectedCard ? 'spinning-wheel__container--disabled' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Wheel with cards */}
        <div 
          className="spinning-wheel__wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {cards.map((card, index) => {
            const angle = (360 / cards.length) * index;
            const isCentered = index === centeredCardIndex;
            
            return (
              <TarotCard
                key={card.id}
                card={card}
                angle={angle}
                isCentered={isCentered}
                isFlipping={isFlipping}
                wheelRadius={wheelRadius}
                hasSelectedCard={!!selectedCard}
                onClick={() => handleCardClick(card, index)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

