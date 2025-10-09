import { FC, useMemo } from "react";
import { TarotWheelCard } from "./TarotWheel";
import { arrangeByAngleContour } from "./arrangeByAngleContour";

/**
 * Props:
 * - card              — данные карточки (id, image, alt)
 * - offsetFromCenter  — смещение от центра в условных px (управляет позицией по дуге)
 * - rayAngle          — угол луча, вдоль которого строится дуга (в градусах)
 * - isCentered        — находится ли карта под индикатором (в центре)
 * - isFlipping        — активна ли анимация переворота
 * - hasSelectedCard   — выключает взаимодействия, если уже выбрана карта
 * - onClick           — клик по карте (используется только для центральной)
 * - arcRadius         — радиус дуги, по которой раскладываются карты
 * - className         — доп. классы для обёртки карты
 */
export interface TarotCardProps {
  card: TarotWheelCard;
  offsetFromCenter: number;
  rayAngle: number;
  isCentered: boolean;
  isFlipping: boolean;
  hasSelectedCard: boolean;
  onClick: () => void;
  arcRadius?: number;
  className?: string;
}

export const TarotCard: FC<TarotCardProps> = ({
  card,
  offsetFromCenter,
  rayAngle,
  isCentered,
  isFlipping,
  hasSelectedCard,
  onClick,
  arcRadius = 300,
  className,
}) => {
  // ── Geometry calc (memoized) ────────────────────────────────────────────────
  const { translateX, translateY, rotationDeg } = useMemo(() => {
    const absOffset = Math.abs(offsetFromCenter);
    const side = offsetFromCenter < 0 ? -1 : 1;

    const { x, y, rotationDeg } = arrangeByAngleContour(absOffset, {
      R: arcRadius,
      rayAngleDeg: rayAngle,
    });

    return {
      translateX: side * x,
      translateY: y,
      rotationDeg: side * rotationDeg,
    };
  }, [offsetFromCenter, rayAngle, arcRadius]);

  // ── Interactions & a11y ─────────────────────────────────────────────────────
  const interactive = isCentered && !hasSelectedCard;
  const handleClick = () => {
    if (interactive) onClick();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={[
        "spinning-wheel__card",
        isCentered ? "spinning-wheel__card--centered" : "",
        isFlipping && isCentered ? "spinning-wheel__card--flipping" : "",
        className ?? "",
      ].join(" ").trim()}
      style={{
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationDeg}deg)`,
        cursor: interactive ? "pointer" : "default",
        willChange: "transform",
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-pressed={interactive ? false : undefined}
      aria-label={interactive ? `Select card ${card.alt}` : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="spinning-wheel__card-inner">
        <div className="spinning-wheel__card-back">
          <div className="card-pattern" />
        </div>
        <div className="spinning-wheel__card-front">
          <img src={card.image} alt={card.alt} />
        </div>
      </div>
    </div>
  );
};
