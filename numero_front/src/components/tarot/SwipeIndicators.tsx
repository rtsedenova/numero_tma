import React from "react";

type SwipeIndicatorsProps = {
  text?: string;        
  className?: string;  
  size?: number;       
  opacity?: number;     
};

export const SwipeIndicators: React.FC<SwipeIndicatorsProps> = ({
  text = "Листайте",
  className = "",
  size = 42,
  opacity = 0.75,
}) => {
  return (
    <div 
      className={`flex items-center justify-center gap-4 select-none ${className}`} 
      style={{ 
        color: 'var(--text)',
        opacity: opacity,
      }}
      aria-hidden="true"
    >
      <Arrow dir="left"  size={size} />
      <span className="font-medium">{text}</span>
      <Arrow dir="right" size={size} />
    </div>
  );
};

type ArrowProps = {
  dir: "left" | "right";
  size: number;
};

const Arrow: React.FC<ArrowProps> = ({ dir, size }) => {
  const w = Math.round(size * 2);  
  const h = size;
  const mid = h / 2;

  const linePath =
    dir === "right"
      ? `M 2 ${mid} L ${w - 10} ${mid}`
      : `M ${w - 2} ${mid} L 10 ${mid}`;

  const headPath =
    dir === "right"
      ? `M ${w - 14} ${mid - 6} L ${w - 2} ${mid} L ${w - 14} ${mid + 6}`
      : `M 14 ${mid - 6} L 2 ${mid} L 14 ${mid + 6}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className="text-[var(--text)]"
    >
      <path d={linePath} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" />
      <path d={headPath} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
