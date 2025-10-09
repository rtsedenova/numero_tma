import { FC } from 'react';
import { TarotWheelCard } from './TarotWheel';

export interface TarotCardProps {
  card: TarotWheelCard;
  angle: number;
  isCentered: boolean;
  isFlipping: boolean;
  wheelRadius: number;
  hasSelectedCard: boolean;
  onClick: () => void;
}

/**
 * TarotCard - Individual card in the spinning wheel
 * Renders a card with proper positioning and flip animation
 */
export const TarotCard: FC<TarotCardProps> = ({
  card,
  angle,
  isCentered,
  isFlipping,
  wheelRadius,
  hasSelectedCard,
  onClick,
}) => {
  return (
    <div
      className={`spinning-wheel__card ${isCentered ? 'spinning-wheel__card--centered' : ''} ${isFlipping && isCentered ? 'spinning-wheel__card--flipping' : ''}`}
      style={{
        transform: `rotate(${angle}deg) translateY(-${wheelRadius}px)`,
        cursor: isCentered && !hasSelectedCard ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div className="spinning-wheel__card-inner">
        <div className="spinning-wheel__card-back">
          <div className="card-pattern"></div>
        </div>
        <div className="spinning-wheel__card-front">
          <img src={card.image} alt={card.alt} />
        </div>
      </div>
    </div>
  );
};

