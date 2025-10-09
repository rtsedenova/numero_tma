import { FC, useState, useRef, useEffect } from "react";
import { TarotCard } from "./TarotCard";
import "./TarotWheel.scss";

/**
 * Карточка колеса
 */
export interface TarotWheelCard {
  id: string | number;
  image: string;
  alt: string;
}

/**
 * Props:
 * - cards           — список карт для отображения
 * - onCardSelect    — коллбэк при выборе карты (после flip)
 * - spacing         — шаг «прокрутки» между соседними картами в условных px (отвечает за плотность/скорость)
 * - rayAngle        — угол луча для позиционирования карты (используется в TarotCard для геометрии)
 * - flipDurationMs  — длительность анимации переворота карты
 * - inertiaFriction — коэффициент затухания инерции (0..1), больше — дольше крутится
 * - inertiaStopV    — порог скорости, ниже которого инерция останавливается
 */
interface TarotWheelProps {
  cards: TarotWheelCard[];
  onCardSelect?: (card: TarotWheelCard) => void;
  spacing?: number;
  rayAngle?: number;
  flipDurationMs?: number;
  inertiaFriction?: number;
  inertiaStopV?: number;
}

export const TarotWheel: FC<TarotWheelProps> = ({
  cards,
  onCardSelect,
  spacing = 100,
  rayAngle = 90,
  flipDurationMs = 1500,
  inertiaFriction = 0.95,
  inertiaStopV = 5,
}) => {
  // ── UI/Animation state ────────────────────────────────────────────────────────
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedCard, setSelectedCard] = useState<TarotWheelCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFullCard, setShowFullCard] = useState(false);

  // ── Drag / Inertia runtime refs (не вызывают ререндер) ───────────────────────
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const accScrollOffset = useRef(0);
  const prevY = useRef(0);

  const targetScrollRef = useRef(0);
  const displayScrollRef = useRef(0);

  const animationFrameId = useRef<number | null>(null);
  const velocitySamples = useRef<Array<{ time: number; scroll: number }>>([]);
  const velocity = useRef(0);
  const lastInertiaTime = useRef(0);
  const isInertia = useRef(false);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const maxScroll = Math.max(0, (cards.length - 1) * spacing);

  const clampScroll = (v: number) => Math.max(0, Math.min(maxScroll, v));

  const getCenteredCardIndex = (value = scrollOffset) => {
    const clamped = clampScroll(value);
    const index = Math.round(clamped / spacing);
    return Math.max(0, Math.min(cards.length - 1, index));
  };

  // ── Lifecycles ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => stopAnimation();
  }, []);

  // ── Core animation loops ─────────────────────────────────────────────────────
  const animate = () => {
    const alpha = 0.25; // сглаживание движения к целевому скроллу
    const diff = targetScrollRef.current - displayScrollRef.current;
    displayScrollRef.current += diff * alpha;
    setScrollOffset(displayScrollRef.current);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const animateInertia = (t: number) => {
    const dt = (t - lastInertiaTime.current) / 1000;
    lastInertiaTime.current = t;

    targetScrollRef.current = clampScroll(targetScrollRef.current + velocity.current * dt);
    velocity.current *= inertiaFriction;

    const alpha = 0.25;
    const diff = targetScrollRef.current - displayScrollRef.current;
    displayScrollRef.current += diff * alpha;
    setScrollOffset(displayScrollRef.current);

    if (Math.abs(velocity.current) < inertiaStopV) {
      isInertia.current = false;
      velocity.current = 0;
      return;
    }
    animationFrameId.current = requestAnimationFrame(animateInertia);
  };

  const startAnimation = () => {
    if (animationFrameId.current == null) {
      isInertia.current = false;
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  const startInertia = (initialVelocity: number) => {
    stopAnimation();
    velocity.current = initialVelocity;
    isInertia.current = true;
    lastInertiaTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animateInertia);
  };

  const stopAnimation = () => {
    if (animationFrameId.current != null) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null;
    isInertia.current = false;
    velocity.current = 0;
  };

  // ── Handlers: Tap/Click ──────────────────────────────────────────────────────
  const handleCardClick = (card: TarotWheelCard, index: number) => {
    if (selectedCard) return;
    if (index !== getCenteredCardIndex()) return;

    stopAnimation();

    setSelectedCard(card);
    setIsFlipping(true);

    window.setTimeout(() => {
      setIsFlipping(false);
      setShowFullCard(true);
      onCardSelect?.(card);
    }, flipDurationMs);
  };

  const resetWheel = () => {
    setSelectedCard(null);
    setShowFullCard(false);
    setIsFlipping(false);
    setScrollOffset(0);

    accScrollOffset.current = 0;
    targetScrollRef.current = 0;
    displayScrollRef.current = 0;

    stopAnimation();
  };

  // ── Handlers: Pointer/Drag ───────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedCard || isFlipping) return;

    // если попали по карте — клики обрабатываются на карточке
    if ((e.target as HTMLElement).closest(".spinning-wheel__card")) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    stopAnimation();

    isDragging.current = true;
    hasMoved.current = false;
    prevY.current = e.clientY;
    velocitySamples.current = [];

    startAnimation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || selectedCard || isFlipping) return;

    hasMoved.current = true;
    const deltaY = prevY.current - e.clientY;

    accScrollOffset.current = clampScroll(accScrollOffset.current + deltaY);
    prevY.current = e.clientY;
    targetScrollRef.current = accScrollOffset.current;

    const now = performance.now();
    velocitySamples.current.push({ time: now, scroll: accScrollOffset.current });
    if (velocitySamples.current.length > 6) velocitySamples.current.shift();
  };

  const handlePointerUp = () => {
    isDragging.current = false;

    if (hasMoved.current && velocitySamples.current.length >= 2) {
      const samples = velocitySamples.current;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = (last.time - first.time) / 1000;
      const ds = last.scroll - first.scroll;
      if (dt > 0) startInertia(ds / dt);
    }

    velocitySamples.current = [];
    hasMoved.current = false;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const centeredCardIndex = getCenteredCardIndex();

  return (
    <div className="spinning-wheel" aria-live="polite">
      {/* ── Overlay выбранной карты ─────────────────────────────────────────── */}
      {showFullCard && selectedCard && (
        <div className="spinning-wheel__full-card" role="dialog" aria-modal="true">
          <div className="spinning-wheel__full-card-content">
            <img src={selectedCard.image} alt={selectedCard.alt} />
            <h3>{selectedCard.alt}</h3>
            <button onClick={resetWheel} className="spinning-wheel__reset-btn">
              Draw Another Card
            </button>
          </div>
        </div>
      )}

      {/* ── Индикатор центра (стрелка) ──────────────────────────────────────── */}
      <div className="spinning-wheel__indicator" aria-hidden="true">
        <div className="spinning-wheel__indicator-arrow" />
      </div>

      {/* ── Контейнер прокрутки/инерции ─────────────────────────────────────── */}
      <div
        className={`spinning-wheel__container ${selectedCard ? "spinning-wheel__container--disabled" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="spinning-wheel__wheel">
          {cards.map((card, index) => {
            const isCentered = index === centeredCardIndex;
            const offsetFromCenter = index * spacing - scrollOffset;

            return (
              <TarotCard
                key={card.id}
                card={card}
                offsetFromCenter={offsetFromCenter} // смещение относительно центра (управляет позицией)
                rayAngle={rayAngle}                 // угол луча (геометрия раскладки)
                isCentered={isCentered}             // подсветка/приоритет
                isFlipping={isFlipping}             // состояние flip анимации
                hasSelectedCard={!!selectedCard}    // дизейбл взаимодействий
                onClick={() => handleCardClick(card, index)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
