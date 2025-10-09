import { FC, useState, useRef, useEffect } from 'react';
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
  const accRotationDeg = useRef(0);
  const prevAngleRad = useRef(0);
  const wheelCenter = useRef({ x: 0, y: 0 });
  const targetRotationDegRef = useRef(0);
  const displayRotationDegRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Animation loop for smooth rotation
  const animate = () => {
    const alpha = 0.25;
    const diff = targetRotationDegRef.current - displayRotationDegRef.current;
    displayRotationDegRef.current += diff * alpha;
    setRotation(displayRotationDegRef.current);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Start animation loop
  const startAnimation = () => {
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  // Stop animation loop
  const stopAnimation = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  // Calculate which card is at the center (top)
  const getCenteredCardIndex = () => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const anglePerCard = 360 / cards.length;
    const index = Math.round(normalizedRotation / anglePerCard) % cards.length;
    return (cards.length - index) % cards.length;
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

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
    accRotationDeg.current = 0;
    targetRotationDegRef.current = 0;
    displayRotationDegRef.current = 0;
  };

  // Pointer drag to spin
  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedCard) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    wheelCenter.current.x = rect.left + rect.width / 2;
    wheelCenter.current.y = rect.top + rect.height / 2;
    prevAngleRad.current = Math.atan2(
      e.clientY - wheelCenter.current.y,
      e.clientX - wheelCenter.current.x
    );
    
    startAnimation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || selectedCard) return;

    const angleNow = Math.atan2(
      e.clientY - wheelCenter.current.y,
      e.clientX - wheelCenter.current.x
    );
    
    let delta = angleNow - prevAngleRad.current;
    
    // Normalize delta to (-π, π]
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    
    accRotationDeg.current += delta * 180 / Math.PI;
    prevAngleRad.current = angleNow;
    targetRotationDegRef.current = accRotationDeg.current;
  };

  const handlePointerUp = () => {
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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

