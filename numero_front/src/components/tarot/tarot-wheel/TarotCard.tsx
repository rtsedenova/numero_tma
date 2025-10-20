import React from "react";

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
        "bg-[linear-gradient(180deg,#2b1b4a_0%,#3a2a60_55%,#271f44_100%)]",
        "border border-[rgba(167,139,250,0.55)]",
        "shadow-[0_8px_16px_rgba(0,0,0,0.10)]",
        disabled ? "opacity-70 cursor-wait" : "hover:brightness-[1.05] active:scale-[0.99] cursor-pointer",
        className,
      ].join(" ")}
      style={{ width, aspectRatio: "1 / 1.765" }}
      aria-label="Tarot card back"
      aria-disabled={disabled}
    >
      <div className="pointer-events-none absolute inset-[6px] rounded-[6px] border border-white/10" />
      {withSigil && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-[36%] aspect-square rounded-full border border-[rgba(167,139,250,0.6)] bg-white/[.02] flex items-center justify-center">
            <span className="text-white/80 text-[18px] leading-none">✧</span>
          </div>
        </div>
      )}
      {showCorners && (
        <>
          <span className="absolute top-[6px] left-[6px] h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="absolute top-[6px] right-[6px] h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="absolute bottom-[6px] left-[6px] h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="absolute bottom-[6px] right-[6px] h-1.5 w-1.5 rounded-full bg-white/50" />
        </>
      )}
    </button>
  );
};
