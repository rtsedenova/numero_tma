import { FC, PropsWithChildren } from "react";
import "./NewTarotStage.scss";

interface NewTarotStageProps extends PropsWithChildren {
  className?: string;
}

export const NewTarotStage: FC<NewTarotStageProps> = ({ children, className }) => {
  return (
    <section className={`new-tarot-stage ${className ?? ""}`}>
      <div className="new-tarot-stage__content">
        <div className="new-tarot-stage__wheel-wrapper">
          {children}
        </div>
      </div>
    </section>
  );
};

