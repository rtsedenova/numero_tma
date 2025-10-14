import { FC } from "react";
import "./NewTarotCard.scss";

export interface NewTarotCardProps {
  card: {
    id: string | number;
    image: string;
    alt: string;
  };
  angle: number;
  className?: string;
  isMarker?: boolean;
  cardNumber?: number;
}

export const NewTarotCard: FC<NewTarotCardProps> = ({ 
  card, 
  angle, 
  className,
  isMarker = false,
  cardNumber
}) => {
  return (
    <div
      className={`new-tarot-card ${isMarker ? 'new-tarot-card--marker' : ''} ${className ?? ""}`}
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--wheel-radius)))`,
      }}
    >
      <div 
        className="new-tarot-card__container" 
        title={card.alt}
      >
        {isMarker && (
          <div className="new-tarot-card__marker-badge">
            ⭐
          </div>
        )}
        {cardNumber !== undefined && (
          <div className="new-tarot-card__number">
            {cardNumber}
          </div>
        )}
      </div>
    </div>
  );
};
