import { FC, PropsWithChildren } from "react";
import "./TarotStage.scss";

/**
 * Props:
 * - className     — дополнительные классы
 * - maxWidth      — максимальная ширина контейнера (CSS size)
 * - height        — высота стейджа (CSS size); если не задана — берём 400px
 * - padding       — внутренние отступы (CSS size)
 * - radius        — скругление (CSS size)
 * - bgStart       — цвет начала градиента фона
 * - bgEnd         — цвет конца градиента фона
 * - pulseEnabled  — включает/выключает фоновые пульсирующие хайлайты
 * - pulseSize     — размер фонового блика (CSS size, напр. "600px")
 */
interface TarotStageProps extends PropsWithChildren {
  className?: string;
  maxWidth?: string;
  height?: string;
  padding?: string;
  radius?: string;
  bgStart?: string;
  bgEnd?: string;
  pulseEnabled?: boolean;
  pulseSize?: string;
}

export const TarotStage: FC<TarotStageProps> = ({
  children,
  className = "",
  maxWidth,
  height,
  padding,
  radius,
  bgStart,
  bgEnd,
  pulseEnabled = true,
  pulseSize,
}) => {
  const style: React.CSSProperties = {
    ...(maxWidth && { ["--stage-max-w" as any]: maxWidth }),
    ...(height && { ["--stage-h" as any]: height }),
    ...(padding && { ["--stage-pad" as any]: padding }),
    ...(radius && { ["--stage-radius" as any]: radius }),
    ...(bgStart && { ["--stage-bg-start" as any]: bgStart }),
    ...(bgEnd && { ["--stage-bg-end" as any]: bgEnd }),
    ...(pulseSize && { ["--stage-pulse-size" as any]: pulseSize }),
    ["--stage-pulse-enabled" as any]: pulseEnabled ? "1" : "0",
  };

  return (
    <section
      className={`tarot-stage ${className}`.trim()}
      style={style}
      role="group"
      aria-label="Tarot stage"
    >
      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="tarot-stage__content">{children}</div>
    </section>
  );
};
