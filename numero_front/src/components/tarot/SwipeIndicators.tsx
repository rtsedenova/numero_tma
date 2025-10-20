import React from "react";

type SwipeIndicatorsProps = {
  text?: string;        // надпись по центру
  className?: string;   // доп. классы контейнера
  size?: number;        // высота стрелки в px
  opacity?: number;     // прозрачность белого (0..1)
};

export const SwipeIndicators: React.FC<SwipeIndicatorsProps> = ({
  text = "Листайте",
  className = "",
  size = 42,
  opacity = 0.75,
}) => {
  const stroke = `rgba(255,255,255,${opacity})`;
  const textColor = `rgba(255,255,255,${Math.min(opacity, 1)})`;

  return (
    <div className={`flex items-center justify-center gap-4 select-none ${className}`} aria-hidden="true">
      <Arrow dir="left"  size={size} stroke={stroke} />
      <span style={{ color: textColor }}>{text}</span>
      <Arrow dir="right" size={size} stroke={stroke} />
    </div>
  );
};

type ArrowProps = {
  dir: "left" | "right";
  size: number;      // высота
  stroke: string;    // цвет линии
};

/** Универсальная пунктирная стрелка (влево/вправо), без анимаций */
const Arrow: React.FC<ArrowProps> = ({ dir, size, stroke }) => {
  const w = Math.round(size * 2);  // ширина ~ в 2 раза выше
  const h = size;
  const mid = h / 2;

  // линия: слева-направо; наконечник зеркалим по dir
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
      style={{ display: "block", opacity: 0.95 }}
    >
      <path d={linePath} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" />
      <path d={headPath} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
