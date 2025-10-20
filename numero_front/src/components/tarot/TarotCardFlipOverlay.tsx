import React, { useEffect, useState, useRef } from 'react';
import type { TarotOrientation } from '@/types/tarot';

export interface TarotCardFlipOverlayProps {
  cardName: string;
  cardImageKey?: string;
  cardImage?: string;
  orientation: TarotOrientation;
  onComplete: () => void;
}

export const TarotCardFlipOverlay: React.FC<TarotCardFlipOverlayProps> = ({
  cardName,
  cardImageKey,
  cardImage,
  orientation,
  onComplete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const [enter, setEnter] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  // --- Стартовые таймеры: flip через 500мс, кнопка — через 2000мс
  useEffect(() => {
    // Включаем анимацию появления на следующий кадр,
    // чтобы CSS-транзишены отработали (иначе будет без анимации)
    const raf = requestAnimationFrame(() => setEnter(true));

    const flipTimer = setTimeout(() => setIsFlipped(true), 500);
    const buttonTimer = setTimeout(() => setShowButton(true), 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(flipTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const imgSrc = cardImageKey || cardImage;

  // --- Быстрый фолбэк на alt, если картинка долго не грузится
  useEffect(() => {
    if (imgSrc) {
      const timeout = setTimeout(() => {
        const img = imgRef.current;
        if (img && !img.complete) {
          img.src = '';
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [imgSrc]);

  // --- Комбинируем "появление" и "флип" в один transform:
  //     - при enter=false: лёгкий translateY+scale
  //     - rotateY управляется isFlipped независимо
  const baseEnterTransform = enter ? 'translateY(0px) scale(1)' : 'translateY(8px) scale(0.96)';
  const flipDeg = isFlipped ? 180 : 0;
  const cardTransform = `${baseEnterTransform} rotateY(${flipDeg}deg)`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
      // Плавный fade-in фона
      style={{
        opacity: enter ? 1 : 0,
        transition: 'opacity 300ms ease-out, backdrop-filter 300ms ease-out',
      }}
    >
      <div style={{ perspective: '1000px' }}>
        <div
          className="relative w-[240px] h-[420px]"
          // Плавное появление карточки (opacity + translateY/scale), флип — rotateY
          style={{
            transformStyle: 'preserve-3d',
            transform: cardTransform,
            opacity: enter ? 1 : 0,
            transition: 'transform 500ms ease-out, opacity 360ms ease-out',
          }}
        >
          {/* Рубашка (обратная сторона), backface скрыт */}
          <div
            className="absolute inset-0 rounded-[12px] overflow-hidden bg-[linear-gradient(180deg,#2b1b4a_0%,#3a2a60_55%,#271f44_100%)] border-2 border-[rgba(167,139,250,0.55)] shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-[10px] rounded-[8px] border border-white/10" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-[36%] aspect-square rounded-full border-2 border-[rgba(167,139,250,0.6)] bg-white/[.02] flex items-center justify-center">
                <span className="text-white/80 text-[42px] leading-none">✧</span>
              </div>
            </div>
          </div>

          {/* Лицевая сторона. Для reversed добавляем rotate(180deg) по Z */}
          <div
            className="absolute inset-0 rounded-[12px] overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: orientation === 'reversed'
                ? 'rotateY(180deg) rotate(180deg)'
                : 'rotateY(180deg)',
            }}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt={cardName}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 h-[44px] flex items-center justify-center">
        <button
          onClick={onComplete}
          style={{
            opacity: showButton ? 1 : 0,
            pointerEvents: showButton ? 'auto' : 'none',
            transition: 'opacity 380ms ease-out, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
            willChange: 'opacity',
          }}
          className={`
            inline-flex px-8 py-1.5 items-center gap-1 rounded-full
            border border-violet-300/80
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]
            bg-gradient-to-r from-fuchsia-400/15 via-violet-400/15 to-indigo-400/15
            text-violet-100 font-semibold whitespace-nowrap
            transition-colors
            hover:from-fuchsia-400/30 hover:via-violet-400/25 hover:to-indigo-400/25
            hover:border-violet-200/90
          `}
          aria-hidden={showButton ? 'false' : 'true'}
        >
          Узнать результат
        </button>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `,
        }}
      />
    </div>
  );
};
