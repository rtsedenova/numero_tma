import { FC, PropsWithChildren } from 'react';
import './TarotStage.scss';

interface TarotStageProps extends PropsWithChildren {
  className?: string;
}

/**
 * TarotStage - Scene container that centers and organizes tarot card components
 * This component provides a centered stage for displaying tarot elements
 */
export const TarotStage: FC<TarotStageProps> = ({ children, className = '' }) => {
  return (
    <div className={`tarot-stage ${className}`}>
      <div className="tarot-stage__content">
        {children}
      </div>
    </div>
  );
};

