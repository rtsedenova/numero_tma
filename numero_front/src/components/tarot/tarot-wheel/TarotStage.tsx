import { FC, PropsWithChildren } from 'react';
import './TarotStage.scss';

interface TarotStageProps extends PropsWithChildren {
  className?: string;
}

export const TarotStage: FC<TarotStageProps> = ({ children, className = '' }) => {
  return (
    <div className={`tarot-stage ${className}`}>
      <div className="tarot-stage__content">
        {children}
      </div>
    </div>
  );
};

