import { FC, PropsWithChildren } from "react";
import "./TarotStage.scss";

/**
 * TarotStage — контейнер для Tarot компонентов
 */
interface TarotStageProps extends PropsWithChildren {
  className?: string; // дополнительные CSS классы
  height?: string; // высота стейджа (CSS size)
  padding?: string; // внутренние отступы (CSS size)
  radius?: string; // скругление (CSS size)
  bgStart?: string; // начальный цвет градиента
  bgEnd?: string; // конечный цвет градиента
}

export const TarotStage: FC<TarotStageProps> = ({
  children,
  className = "",
  height,
  padding,
  radius,
  bgStart,
  bgEnd,
}) => {
  const style: React.CSSProperties = {
    ...(height && { ["--stage-h" as any]: height }),
    ...(padding && { ["--stage-pad" as any]: padding }),
    ...(radius && { ["--stage-radius" as any]: radius }),
    ...(bgStart && { ["--stage-bg-start" as any]: bgStart }),
    ...(bgEnd && { ["--stage-bg-end" as any]: bgEnd }),
  };

  return (
    <section
      className={`tarot-stage ${className}`.trim()}
      style={style}
      role="group"
      aria-label="Tarot stage"
    >
      {/* ── Контент ─────────────────────────────────────────────────────────── */}
      <div className="tarot-stage__content">{children}</div>
    </section>
  );
};
