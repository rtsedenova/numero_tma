// TarotWheel.tsx
import React from 'react';
import { TarotCard } from './TarotCard';
import { clamp, springTo } from './helpers';
import { useDragX } from './useDragX';
import { tarotApi, TarotCategory, TarotDrawResponse } from '@/config/api'; // путь подправь под свой проект

export interface WheelConfig {
  radiusDesktop: number;
  radiusMobile: number;
  arcAngle: number;
  cardCount: number;
  cardW?: number;
  cardH?: number;
}

interface TarotWheelProps {
  config: WheelConfig;
  category?: TarotCategory | null; // например, 'love'|'finance'|'health'|'future'|'yesno'
  onDrawComplete?: (resp: TarotDrawResponse) => void; // колбэк наверх
  onNoCategorySelected?: () => void; // когда пытаются кликнуть без выбора категории
}

export const TarotWheel: React.FC<TarotWheelProps> = ({ config, category, onDrawComplete, onNoCategorySelected }) => {
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

  const arcRad  = ((config.arcAngle || 40) * Math.PI) / 180;
  const centerA = (3 * Math.PI) / 2;
  const startA  = centerA - arcRad / 2;
  const stepA   = arcRad / (n - 1);

  const anchors = React.useMemo(() => {
    const arr = Array.from({ length: n }, (_, k) => {
      const a  = startA + stepA * k;
      const cx = R + Math.cos(a) * R;
      const cy = R + Math.sin(a) * R;
      return { a, x: cx, y: cy, rot: (a * 180) / Math.PI - 90 };
    });

    const minX = Math.min(...arr.map(p => p.x - W / 2));
    const minY = Math.min(...arr.map(p => p.y - H / 2));
    const maxX = Math.max(...arr.map(p => p.x + W / 2));
    const maxY = Math.max(...arr.map(p => p.y + H / 2));

    return { arr, minX, minY, width: maxX - minX, height: maxY - minY };
  }, [R, W, H, n, startA, stepA]);

  const sMin = -(n - 1) / 2;
  const sMax =  +(n - 1) / 2;

  const [s, setS] = React.useState(0);
  const sRef = React.useRef(s);
  sRef.current = s;

  const [dragging, setDragging] = React.useState(false);
  const stopSpringRef = React.useRef<null | (() => void)>(null);

  // --- СЕТКА: запрос к бэку по клику ---
  const [loading, setLoading] = React.useState(false);

  const handleCardClick = async () => {
    if (loading) return;
    
    if (!category) {
      onNoCategorySelected?.();
      return;
    }
    
    console.log('[tarot] Card clicked, making request...', { category });
    
    try {
      setLoading(true);
      const resp = await tarotApi.draw({ category });
      console.log('[tarot] Draw response received:', resp);
      
      if (!resp || !resp.ok) {
        console.error('[tarot] Invalid response:', resp);
        alert('Ошибка: Неверный ответ от сервера');
        return;
      }
      
      console.log('[tarot] Calling onDrawComplete with:', resp);
      onDrawComplete?.(resp);
      console.log('[tarot] onDrawComplete called successfully');
    } catch (e) {
      console.error('[tarot] draw error:', e);
      if (e instanceof Error) {
        alert(`Ошибка запроса: ${e.message}`);
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
      setS(prev => clamp(prev - ds, sMin, sMax));
    },
    onEnd: (_totalDx, velocityX) => {
      setDragging(false);
      const v_s  = (velocityX / 1000) / (R * stepA);
      const half = (n - 1) / 2;

      let target = sRef.current + v_s * 0.25;
      const nearestI = Math.round(target + half);
      target = clamp(nearestI - half, sMin, sMax);

      stopSpringRef.current = springTo({
        from: sRef.current,
        to: target,
        onUpdate: (x) => setS(x),
        onFinish: () => { stopSpringRef.current = null; },
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
  const ACTIVE_LIFT_MOBILE  = 28;
  const ACTIVE_TILT_DESKTOP = -8;
  const ACTIVE_TILT_MOBILE  = -5;

  const proximity = (i: number, centerExact: number) => {
    const d = Math.abs(i - centerExact);
    const t = 1 - Math.min(1, d / 0.6);
    return t < 0 ? 0 : t;
  };

  const cards = React.useMemo(() => {
    const res: Array<{ i: number; x: number; y: number; rot: number; activeWeight: number }> = [];
    const centerExact = s + (n - 1) / 2;
    const liftPx  = isMobile ? ACTIVE_LIFT_MOBILE  : ACTIVE_LIFT_DESKTOP;
    const tiltDeg = isMobile ? ACTIVE_TILT_MOBILE : ACTIVE_TILT_DESKTOP;

    for (let i = 0; i < n; i++) {
      const p = i - s;
      const k = Math.max(0, Math.min(n - 2, Math.floor(p)));
      const t = Math.max(0, Math.min(1, p - k));

      const a = anchors.arr[k];
      const b = anchors.arr[k + 1];
      const an = a && b ? null : anchors.arr[Math.max(0, Math.min(n - 1, i))];

      const baseX = a && b ? (a.x + (b.x - a.x) * t) : an!.x;
      const baseY = a && b ? (a.y + (b.y - a.y) * t) : an!.y;
      let   rot   = a && b ? (a.rot + (b.rot - a.rot) * t) : an!.rot;

      const x = baseX - W / 2 - anchors.minX;
      let y = baseY - H / 2 - anchors.minY;

      const act = proximity(i, centerExact);
      if (act > 0) {
        y -= liftPx * act;
        rot += tiltDeg * act;
      }
      res.push({ i, x, y, rot, activeWeight: act });
    }
    return res;
  }, [n, s, anchors, W, H, isMobile]);

  const shadowPadding = 60;
  const dragAreaExtension = 200;

  return (
    <div
      {...bind}
      className="relative select-none"
      style={{
        width: `${anchors.width + shadowPadding * 2}px`,
        height: `${anchors.height + shadowPadding + dragAreaExtension}px`,
        cursor: loading ? 'wait' : 'grab',
        paddingTop: `${shadowPadding}px`,
        paddingLeft: `${shadowPadding}px`,
        paddingRight: `${shadowPadding}px`,
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      aria-busy={loading}
    >
      {cards.map(({ i, x, y, rot }) => (
        <div
          key={i}
          className="absolute will-change-transform pointer-events-none"
          style={{
            width: `${W}px`,
            height: `${H}px`,
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
            transformOrigin: 'center center',
            zIndex: i,
            transition: dragging ? 'none' : 'transform 90ms linear',
          }}
        >
          <TarotCard
            index={i}
            width={W}
            disabled={loading}
          />
        </div>
      ))}
    </div>
  );
};
