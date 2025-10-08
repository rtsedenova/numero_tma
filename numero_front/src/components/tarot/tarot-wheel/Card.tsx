import { FC, useState } from "react";
import "./Card.scss";

export interface CardProps {
  className?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  width?: number;
  height?: number;
}

export const Card: FC<CardProps> = ({
  className = "",
  isFlipped = false,
  onFlip,
  width = 200,
  height = 300,
}) => {
  const [flipped, setFlipped] = useState(isFlipped);

  const handleClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setFlipped(!flipped);
    }
  };

  const cardStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div
      className={`tarot-card ${className}`}
      style={cardStyle}
      onClick={handleClick}
    >
      <div className={`tarot-card__inner ${flipped || isFlipped ? "tarot-card__inner--flipped" : ""}`}>
        {/* Front side - Pink */}
        <div className="tarot-card__face tarot-card__face--front">
          <div className="tarot-card__content tarot-card__content--front">
            {/* Front content */}
          </div>
        </div>
        
        {/* Back side - Blue */}
        <div className="tarot-card__face tarot-card__face--back">
          <div className="tarot-card__content tarot-card__content--back">
            {/* Back content */}
          </div>
        </div>
      </div>
    </div>
  );
};

