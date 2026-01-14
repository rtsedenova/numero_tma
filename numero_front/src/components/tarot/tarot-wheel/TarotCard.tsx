import React from "react";
import { TarotCardBack } from "./TarotCardBack";

export interface TarotCardProps {
  index: number;
  width?: number;
  className?: string;
  withSigil?: boolean;
  showCorners?: boolean;
  onClick?: () => void;          
  disabled?: boolean;      
}

export const TarotCard: React.FC<TarotCardProps> = ({
  width = 80,
  className = "",
  withSigil = true,
  showCorners = true,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={[
        "relative rounded-[8px] overflow-hidden select-none",
        "border shadow-md",
        disabled ? "opacity-70 cursor-wait" : "hover:brightness-[1.05] active:scale-[0.99] cursor-pointer",
        className,
      ].join(" ")}
      style={{ 
        width, 
        aspectRatio: "1 / 1.765",
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
      aria-label="Tarot card back"
      aria-disabled={disabled}
    >
      <TarotCardBack
        withSigil={withSigil}
        showCorners={showCorners}
      />
    </button>
  );
};
