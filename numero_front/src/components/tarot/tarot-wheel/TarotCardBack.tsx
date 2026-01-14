import React from "react";

const cornerPositions = [
  "top-[7px] left-[7px]",
  "top-[7px] right-[7px]",
  "bottom-[7px] left-[7px]",
  "bottom-[7px] right-[7px]",
];

interface TarotCardBackProps {
  withSigil?: boolean;
  showCorners?: boolean;
  innerBorderInset?: string;
  innerBorderRadius?: string;
  sigilHeight?: string;
  sigilBorderWidth?: string;
  sigilIconSize?: number;
}

export const TarotCardBack: React.FC<TarotCardBackProps> = ({
  withSigil = true,
  showCorners = true,
  innerBorderInset = "9px",
  innerBorderRadius = "6px",
  sigilHeight = "34%",
  sigilBorderWidth = "border",
  sigilIconSize = 24,
}) => {
  return (
    <>
      <div 
        className="pointer-events-none absolute border" 
        style={{ 
          inset: innerBorderInset,
          borderRadius: innerBorderRadius,
          borderColor: 'var(--card-inner-border)',
        }}
      />
      {withSigil && (
        <div className="absolute inset-0 grid place-items-center">
          <div 
            className={`aspect-square rounded-full ${sigilBorderWidth} flex items-center justify-center`}
            style={{
              height: sigilHeight,
              borderColor: 'var(--card-border)',
            }}
          >
            <span 
              className="leading-none"
              style={{ 
                color: 'var(--card-sigil-icon)',
                fontSize: `${sigilIconSize}px`,
              }}
            >
              ✧
            </span>
          </div>
        </div>
      )}
      {showCorners &&
        cornerPositions.map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} h-2.5 w-2.5 rounded-full`}
            style={{ backgroundColor: "var(--card-corner)" }}
          />
        ))}
    </>
  );
};
