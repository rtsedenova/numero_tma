import { FC, ReactNode } from "react";
import "./TarotStage.scss";

export interface TarotStageProps {
  children?: ReactNode;
  className?: string;
}

export const TarotStage: FC<TarotStageProps> = ({ children, className = "" }) => {
  return (
    <div className={`tarot-stage ${className}`}>
      <div className="tarot-stage__scene">
        <div className="tarot-stage__arc-container">
          {children}
        </div>
      </div>
    </div>
  );
};

