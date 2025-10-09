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
  const hasMoved = useRef(false);
  const accRotationDeg = useRef(0);
  const prevAngleRad = useRef(0);
  const wheelCenter = useRef({ x: 0, y: 0 });
  const targetRotationDegRef = useRef(0);
  const displayRotationDegRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const velocitySamples = useRef<Array<{ time: number; rotation: number }>>([]);
  const velocity = useRef(0);
  const lastInertiaTime = useRef(0);
  const isInertia = useRef(false);

  const animate = () => {
    const alpha = 0.25;
    const diff = targetRotationDegRef.current - displayRotationDegRef.current;
    displayRotationDegRef.current += diff * alpha;
    setRotation(displayRotationDegRef.current);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const animateInertia = (currentTime: number) => {
    const dt = (currentTime - lastInertiaTime.current) / 1000; 
    lastInertiaTime.current = currentTime;

    const friction = 0.95;
    const threshold = 5; 

    targetRotationDegRef.current += velocity.current * dt;
    velocity.current *= friction;

    const alpha = 0.25;
    const diff = targetRotationDegRef.current - displayRotationDegRef.current;
    displayRotationDegRef.current += diff * alpha;
    setRotation(displayRotationDegRef.current);

    if (Math.abs(velocity.current) < threshold) {
      isInertia.current = false;
      velocity.current = 0;
      return;
    }

    animationFrameId.current = requestAnimationFrame(animateInertia);
  };

  const startAnimation = () => {
    if (animationFrameId.current === null) {
      isInertia.current = false;
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  const startInertia = (initialVelocity: number) => {
    stopAnimation();
    velocity.current = initialVelocity;
    isInertia.current = true;
    lastInertiaTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animateInertia);
  };

  const stopAnimation = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    isInertia.current = false;
    velocity.current = 0;
  };

  const getCenteredCardIndex = () => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const anglePerCard = 360 / cards.length;
    const index = Math.round(normalizedRotation / anglePerCard) % cards.length;
    return (cards.length - index) % cards.length;
  };

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  const handleCardClick = (card: TarotWheelCard, index: number) => {
    if (selectedCard) return;
    
    const centeredIndex = getCenteredCardIndex();
    if (index !== centeredIndex) return;
    
    stopAnimation();
    
    setSelectedCard(card);
    setIsFlipping(true);

    setTimeout(() => {
      setIsFlipping(false);
      setShowFullCard(true);
      onCardSelect?.(card);
    }, 1500);
  };

  const resetWheel = () => {
    setSelectedCard(null);
    setShowFullCard(false);
    setIsFlipping(false);
    setRotation(0);
    accRotationDeg.current = 0;
    targetRotationDegRef.current = 0;
    displayRotationDegRef.current = 0;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedCard || isFlipping) return;
    
    // Don't capture if clicking on a card element
    const target = e.target as HTMLElement;
    if (target.closest('.spinning-wheel__card')) {
      return; // Let the card handle the click
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
    
    stopAnimation();
    
    isDragging.current = true;
    hasMoved.current = false;
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    wheelCenter.current.x = rect.left + rect.width / 2;
    wheelCenter.current.y = rect.top + rect.height / 2;
    prevAngleRad.current = Math.atan2(
      e.clientY - wheelCenter.current.y,
      e.clientX - wheelCenter.current.x
    );
    
    velocitySamples.current = [];
    
    startAnimation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || selectedCard || isFlipping) return;

    hasMoved.current = true;

    const angleNow = Math.atan2(
      e.clientY - wheelCenter.current.y,
      e.clientX - wheelCenter.current.x
    );
    
    let delta = angleNow - prevAngleRad.current;
    
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    
    accRotationDeg.current += delta * 180 / Math.PI;
    prevAngleRad.current = angleNow;
    targetRotationDegRef.current = accRotationDeg.current;
    
    const now = performance.now();
    velocitySamples.current.push({ time: now, rotation: accRotationDeg.current });
    if (velocitySamples.current.length > 6) {
      velocitySamples.current.shift();
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    
    // Only apply inertia if user actually dragged
    if (hasMoved.current && velocitySamples.current.length >= 2) {
      const samples = velocitySamples.current;
      const first = samples[0];
      const last = samples[samples.length - 1];
      
      const timeDiff = (last.time - first.time) / 1000;
      const rotationDiff = last.rotation - first.rotation;
      
      if (timeDiff > 0) {
        const calculatedVelocity = rotationDiff / timeDiff;
        startInertia(calculatedVelocity);
      }
    }
    
    velocitySamples.current = [];
    hasMoved.current = false;
  };

  const centeredCardIndex = getCenteredCardIndex();

  return (
    <div className="spinning-wheel">    
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

      <div className="spinning-wheel__indicator">
        <div className="spinning-wheel__indicator-arrow"></div>
      </div>

      <div 
        ref={wheelRef}
        className={`spinning-wheel__container ${selectedCard ? 'spinning-wheel__container--disabled' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >   
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

