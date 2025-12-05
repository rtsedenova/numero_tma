import React from 'react';
import { TarotCard } from './TarotCard';
import { useDragX } from './useDragX';
import { clamp, springTo } from '@/helpers/tarotWheelHelpers';
import { tarotApi } from '@/api/tarot';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { usePredictionAttempts } from '@/storage/predictionAttempts';
import type {
  TarotCategory,
  TarotDrawResponse,
  WheelConfig,
} from '@/types/tarot';

interface TarotWheelProps {
  config: WheelConfig;
  category?: TarotCategory | null;
  onDrawComplete?: (resp: TarotDrawResponse) => void;
  onNoCategorySelected?: () => void;
  onSelectedCardChange?: (cardIndex: number) => void;
}

export function TarotWheel({
  config,
  category,
  onDrawComplete,
  onNoCategorySelected,
  onSelectedCardChange,
}: TarotWheelProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const n = Math.max(2, Math.floor(config.cardCount || 0));
  const R = (isMobile ? config.radiusMobile : config.radiusDesktop) || 300;
  const W = config.cardW ?? 80;
  const H = config.cardH ?? 141.2;

  const arcRad = ((config.arcAngle || 40) * Math.PI) / 180;
  const centerA = (3 * Math.PI) / 2;
  const startA = centerA - arcRad / 2;
  const stepA = arcRad / (n - 1);

  const anchors = React.useMemo(() => {
    const arr = Array.from({ length: n }, (_, index) => {
      const angle = startA + stepA * index;
      const x = R + Math.cos(angle) * R;
      const y = R + Math.sin(angle) * R;
      return { angle, x, y, rot: (angle * 180) / Math.PI - 90 };
    });

    const minX = Math.min(...arr.map((p) => p.x - W / 2));
    const minY = Math.min(...arr.map((p) => p.y - H / 2));
    const maxX = Math.max(...arr.map((p) => p.x + W / 2));
    const maxY = Math.max(...arr.map((p) => p.y + H / 2));

    return { arr, minX, minY, width: maxX - minX, height: maxY - minY };
  }, [R, W, H, n, startA, stepA]);

  const sMin = -(n - 1) / 2;
  const sMax = (n - 1) / 2;

  const [s, setS] = React.useState(0);
  const sRef = React.useRef(s);
  sRef.current = s;

  const [dragging, setDragging] = React.useState(false);
  const stopSpringRef = React.useRef<null | (() => void)>(null);

  const [loading, setLoading] = React.useState(false);

  const { user } = useTelegramUser();
  const {
    tarotFreePredictionsLeft,
    credits,
    isLoading: isPredictionsLoading,
  } = usePredictionAttempts();

  const handleCardClick = async () => {
    if (loading) return;

    if (!category) {
      onNoCategorySelected?.();
      return;
    }

    const CREDITS_PER_PREDICTION = 100;

    if (
      isPredictionsLoading ||
      tarotFreePredictionsLeft === null ||
      credits === null
    ) {
      return;
    }

    if (tarotFreePredictionsLeft === 0) {
      if (credits < CREDITS_PER_PREDICTION) {
        alert(
          'Бесплатные предсказания закончились. Вам нужно минимум 100 кредитов для получения предсказания. Пожалуйста, купите кредиты.',
        );
        return;
      }
    }

    if (!user?.id) {
      alert('Ошибка: не удалось определить Telegram ID');
      return;
    }

    try {
      setLoading(true);

      const resp = await tarotApi.draw({
        category,
        telegramId: user.id,
      });

      if (!resp || !resp.ok) {
        if (resp?.code === 'NO_PREDICTIONS_LEFT') {
          alert(
            'У вас закончились предсказания. Пожалуйста, купите кредиты.',
          );
          return;
        }

        alert('Ошибка: неверный ответ сервера');
        return;
      }

      onDrawComplete?.(resp);
    } catch (error) {
      console.error('[TarotWheel] draw error', { error });

      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('no predictions') || message.includes('403')) {
          alert(
            'У вас закончились предсказания. Пожалуйста, купите кредиты.',
          );
        } else {
          alert(`Ошибка запроса: ${error.message}`);
        }
      } else {
        alert('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  const bind = useDragX({
    onStart: () => {
      setDragging(true);
      stopSpringRef.current?.();
      stopSpringRef.current = null;
    },
    onDelta: (dx) => {
      const ds = dx / (R * stepA);
      setS((prev) => clamp(prev - ds, sMin, sMax));
    },
    onEnd: (_totalDx, velocityX) => {
      setDragging(false);

      const v = (velocityX / 1000) / (R * stepA);
      const half = (n - 1) / 2;

      let target = sRef.current + v * 0.25;
      const nearestIndex = Math.round(target + half);
      target = clamp(nearestIndex - half, sMin, sMax);

      stopSpringRef.current = springTo({
        from: sRef.current,
        to: target,
        onUpdate: (value) => setS(value),
        onFinish: () => {
          stopSpringRef.current = null;
        },
        k: 680,
        c: 30,
      });
    },
    onClick: () => {
      handleCardClick();
    },
    lockY: true,
  });

  const ACTIVE_LIFT_DESKTOP = 34;
  const ACTIVE_LIFT_MOBILE = 28;
  const ACTIVE_TILT_DESKTOP = -8;
  const ACTIVE_TILT_MOBILE = -5;

  const proximity = (index: number, centerExact: number) => {
    const distance = Math.abs(index - centerExact);
    const t = 1 - Math.min(1, distance / 0.6);
    return t < 0 ? 0 : t;
  };

  const cards = React.useMemo(() => {
    const items: Array<{
      index: number;
      x: number;
      y: number;
      rot: number;
      activeWeight: number;
    }> = [];

    const centerExact = s + (n - 1) / 2;
    const lift = isMobile ? ACTIVE_LIFT_MOBILE : ACTIVE_LIFT_DESKTOP;
    const tilt = isMobile ? ACTIVE_TILT_MOBILE : ACTIVE_TILT_DESKTOP;

    for (let index = 0; index < n; index += 1) {
      const p = index - s;
      const k = Math.max(0, Math.min(n - 2, Math.floor(p)));
      const t = Math.max(0, Math.min(1, p - k));

      const a = anchors.arr[k];
      const b = anchors.arr[k + 1];
      const fallback =
        a && b
          ? null
          : anchors.arr[Math.max(0, Math.min(n - 1, index))];

      const baseX = a && b ? a.x + (b.x - a.x) * t : fallback!.x;
      const baseY = a && b ? a.y + (b.y - a.y) * t : fallback!.y;
      let rot = a && b ? a.rot + (b.rot - a.rot) * t : fallback!.rot;

      const x = baseX - W / 2 - anchors.minX;
      let y = baseY - H / 2 - anchors.minY;

      const activeWeight = proximity(index, centerExact);

      if (activeWeight > 0) {
        y -= lift * activeWeight;
        rot += tilt * activeWeight;
      }

      items.push({ index, x, y, rot, activeWeight });
    }

    return items;
  }, [anchors, isMobile, n, s, W, H]);

  React.useEffect(() => {
    const centerExact = s + (n - 1) / 2;
    const selectedCardIndex = Math.round(centerExact);
    const clampedIndex = Math.max(0, Math.min(n - 1, selectedCardIndex));
    onSelectedCardChange?.(clampedIndex);
  }, [s, n, onSelectedCardChange]);

  const shadowPadding = 60;
  const dragAreaExtension = 200;

  return (
    <div
      {...bind}
      className="relative select-none"
      style={{
        width: `${anchors.width + shadowPadding * 2}px`,
        height: `${anchors.height + shadowPadding + dragAreaExtension}px`,
        cursor: 'grab',
        paddingTop: `${shadowPadding}px`,
        paddingLeft: `${shadowPadding}px`,
        paddingRight: `${shadowPadding}px`,
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {cards.map(({ index, x, y, rot }) => (
        <div
          key={index}
          className="absolute will-change-transform pointer-events-none"
          style={{
            width: `${W}px`,
            height: `${H}px`,
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
            transformOrigin: 'center center',
            zIndex: index,
            transition: dragging ? 'none' : 'transform 90ms linear',
          }}
        >
          <TarotCard index={index} width={W} disabled={false} />
        </div>
      ))}
    </div>
  );
}
