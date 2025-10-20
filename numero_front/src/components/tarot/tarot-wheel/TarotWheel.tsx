import React from 'react';
import { TarotCard } from './TarotCard';
import { clamp, springTo } from '@/helpers/tarotWheelHelpers';
import { useDragX } from './useDragX';
import { tarotApi } from '@/api/tarot';
import type { TarotCategory, TarotDrawResponse, WheelConfig } from '@/types/tarot';

interface TarotWheelProps {
  config: WheelConfig;
  category?: TarotCategory | null;
  onDrawComplete?: (resp: TarotDrawResponse) => void;
  onNoCategorySelected?: () => void;
  onSelectedCardChange?: (cardIndex: number) => void;
}

export const TarotWheel: React.FC<TarotWheelProps> = ({
  config,
  category,
  onDrawComplete,
  onNoCategorySelected,
  onSelectedCardChange,
}) => {
  // --- Определяем мобильный режим один раз и при ресайзе
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // --- Базовые параметры колоды/сцены
  const n = Math.max(2, Math.floor(config.cardCount || 0)); // количество карт
  const R = (isMobile ? config.radiusMobile : config.radiusDesktop) || 300; // радиус
  const W = config.cardW ?? 80; // ширина
  const H = config.cardH ?? 141.2; // высота

  // --- Геометрия дуги (в радианах): нижняя точка круга как центр (270°)
  const arcRad  = ((config.arcAngle || 40) * Math.PI) / 180; // длина дуги в радианах
  const centerA = (3 * Math.PI) / 2; // центральный угол, вокруг которого строится дуга
  const startA  = centerA - arcRad / 2; // угол начала дуги (левый край)
  const stepA   = arcRad / (n - 1); // угловой шаг между соседними картами

//       90° (π/2)
//           ↑
// 180° ←    •    → 0° (или 360°)
//           ↓
//       270° (3π/2)

  // --- Якорные точки для каждой карты: предвычисляем позиции и поворот
  //     + габариты всей сцены для контейнера
  const anchors = React.useMemo(() => {
    const arr = Array.from({ length: n }, (_, k) => { // создаем массив из n элементов, по одной точке на карту, k — индекс карты
      const a  = startA + stepA * k; // начинаем с startA и прибавляем k раз равный шаг stepA
      // переводим угол a в координаты на окружности радиуса R
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

  // --- Границы скролла в терминах "плавающего индекса" s
  // (n - 1) / 2 → середина диапазона
  const sMin = -(n - 1) / 2; // -((n - 1) / 2) → крайний левый угол
  const sMax =  +(n - 1) / 2;

  // --- Состояние скролла (s) и вспомогательные флаги
  const [s, setS] = React.useState(0);
  const sRef = React.useRef(s);
  sRef.current = s;

  const [dragging, setDragging] = React.useState(false);
  const stopSpringRef = React.useRef<null | (() => void)>(null);

  // --- Флаг запроса на бэкенд (блокируем повторные клики)
  const [loading, setLoading] = React.useState(false);

  // --- Клик по карте: проверка категории и запрос на бэк
  const handleCardClick = async () => {
    if (loading) return;

    if (!category) {
      onNoCategorySelected?.();
      return;
    }

    try {
      setLoading(true);
      const resp = await tarotApi.draw({ category });

      if (!resp || !resp.ok) {
        alert('Ошибка: неверный ответ сервера');
        return;
      }

      // Отдаем результат наверх (родитель откроет оверлей)
      onDrawComplete?.(resp);
    } catch (e) {
      console.error('[tarot] draw error', e);
      if (e instanceof Error) {
        alert(`Ошибка запроса: ${e.message}`);
      } else {
        alert('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Жест прокрутки по X, двигаем s во время драгга, потом пружина
  const bind = useDragX({
    onStart: () => {
      setDragging(true);
      // Останавливаем текущую анимацию пружины, если была
      stopSpringRef.current?.();
      stopSpringRef.current = null;
    },
    onDelta: (dx) => { // dx — насколько пикселей сдвинулись по оси X с начала жеста
      // Перевод пикселей в "шаги по дуге": R*stepA ≈ ширина одного углового шага
      const ds = dx / (R * stepA); // переводит пиксельный сдвиг жеста в «сколько карт» прокрутили
      setS(prev => clamp(prev - ds, sMin, sMax));
    },
    onEnd: (_totalDx, velocityX) => {
      setDragging(false);

      // Перевод скорости пикселей/с в скорость "шагов/с"
      const v_s  = (velocityX / 1000) / (R * stepA); // скорость скролла в “шагах карты” в секунду
      const half = (n - 1) / 2;

      // Остановка на ближайшей к центру карте
      let target = sRef.current + v_s * 0.25;
      const nearestI = Math.round(target + half);
      target = clamp(nearestI - half, sMin, sMax);

      // Плавное доведение пружиной
      stopSpringRef.current = springTo({
        from: sRef.current,
        to: target,
        onUpdate: (x) => setS(x),
        onFinish: () => { stopSpringRef.current = null; },
        k: 680,   // жесткость
        c: 30,    // демпфирование
      });
    },
    onClick: () => {
      // Короткий клик (не драг): выбор карты
      handleCardClick();
    },
    lockY: true, // игнор вертикальных движений
  });

  // --- Параметры визуальных эффектов "центральной" карты
  const ACTIVE_LIFT_DESKTOP = 34;
  const ACTIVE_LIFT_MOBILE  = 28;
  const ACTIVE_TILT_DESKTOP = -8;
  const ACTIVE_TILT_MOBILE  = -5;

  // --- Функция близости карты к "точному центру": 1 — в центре, 0 — далеко
  const proximity = (i: number, centerExact: number) => {
    const d = Math.abs(i - centerExact);
    const t = 1 - Math.min(1, d / 0.6);
    return t < 0 ? 0 : t;
  };

  // --- Расчет текущих позиций/поворотов всех карт с учетом s и "подсветки"
  const cards = React.useMemo(() => {
    const res: Array<{ i: number; x: number; y: number; rot: number; activeWeight: number }> = [];
    const centerExact = s + (n - 1) / 2;
    const liftPx  = isMobile ? ACTIVE_LIFT_MOBILE  : ACTIVE_LIFT_DESKTOP;
    const tiltDeg = isMobile ? ACTIVE_TILT_MOBILE : ACTIVE_TILT_DESKTOP;

    for (let i = 0; i < n; i++) {
      // p — где сейчас находится карточка i относительно s (между якорями)
      const p = i - s;
      const k = Math.max(0, Math.min(n - 2, Math.floor(p)));
      const t = Math.max(0, Math.min(1, p - k));

      // Линейная интерполяция между двумя соседними якорями на дуге
      const a = anchors.arr[k];
      const b = anchors.arr[k + 1];
      const an = a && b ? null : anchors.arr[Math.max(0, Math.min(n - 1, i))];

      const baseX = a && b ? (a.x + (b.x - a.x) * t) : an!.x;
      const baseY = a && b ? (a.y + (b.y - a.y) * t) : an!.y;
      let   rot   = a && b ? (a.rot + (b.rot - a.rot) * t) : an!.rot;

      // Сдвигаем в локальные координаты контейнера
      const x = baseX - W / 2 - anchors.minX;
      let y = baseY - H / 2 - anchors.minY;

      // Подсветка/поднятие/доп. наклон около центра
      const act = proximity(i, centerExact);
      if (act > 0) {
        y   -= liftPx * act;
        rot += tiltDeg * act;
      }

      res.push({ i, x, y, rot, activeWeight: act });
    }
    return res;
  }, [n, s, anchors, W, H, isMobile]);

  // --- Notify parent about selected card changes
  React.useEffect(() => {
    const centerExact = s + (n - 1) / 2;
    const selectedCardIndex = Math.round(centerExact);
    const clampedIndex = Math.max(0, Math.min(n - 1, selectedCardIndex));
    onSelectedCardChange?.(clampedIndex);
  }, [s, n, onSelectedCardChange]);

  // --- Доп. отступы: место для тени карт и зона для комфортного драга
  const shadowPadding = 60;
  const dragAreaExtension = 200;

  // --- Рендер: один контейнер-обработчик жестов + абсолютные карточки
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
      {cards.map(({ i, x, y, rot }) => (
        <div
          key={i}
          className="absolute will-change-transform pointer-events-none"
          style={{
            width: `${W}px`,
            height: `${H}px`,
            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`,
            transformOrigin: 'center center',
            zIndex: i, // у центральных карт выше индекс => меньше перекрытий
            transition: dragging ? 'none' : 'transform 90ms linear', // мгновенно во время драга, плавно после
          }}
        >
          <TarotCard
            index={i}
            width={W}
            disabled={false}
          />
        </div>
      ))}
    </div>
  );
};
