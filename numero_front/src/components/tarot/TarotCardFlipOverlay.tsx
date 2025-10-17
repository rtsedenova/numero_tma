// TarotCardFlipOverlay.tsx
import React, { useEffect, useState } from 'react';
import { imageUrl } from '@/config/api';

export interface TarotCardFlipOverlayProps {
  cardName: string;
  cardImageKey?: string;
  cardImage?: string;
  orientation: 'upright' | 'reversed';
  onComplete: () => void;
}

export const TarotCardFlipOverlay: React.FC<TarotCardFlipOverlayProps> = ({
  cardName,
  cardImageKey,
  cardImage,
  orientation,
  onComplete,
}) => {
  console.log('[TarotCardFlipOverlay] Mounted with props:', { cardName, cardImageKey, cardImage, orientation });
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    console.log('[TarotCardFlipOverlay] Setting up timers');
    
    // Запускаем переворот через небольшую задержку
    const flipTimer = setTimeout(() => {
      console.log('[TarotCardFlipOverlay] Flipping card');
      setIsFlipped(true);
    }, 500);

    // Показываем кнопку после завершения анимации
    const buttonTimer = setTimeout(() => {
      console.log('[TarotCardFlipOverlay] Showing button');
      setShowButton(true);
    }, 2000);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const imgSrc = imageUrl(cardImageKey || cardImage);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Карта с flip анимацией */}
      <div className="perspective-1000">
        <div
          className={`relative w-[280px] h-[494px] transition-transform duration-1000 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Задняя сторона (рубашка) */}
          <div
            className="absolute inset-0 backface-hidden rounded-[12px] overflow-hidden bg-[linear-gradient(180deg,#2b1b4a_0%,#3a2a60_55%,#271f44_100%)] border-2 border-[rgba(167,139,250,0.55)] shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="absolute inset-[10px] rounded-[8px] border border-white/10" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-[36%] aspect-square rounded-full border-2 border-[rgba(167,139,250,0.6)] bg-white/[.02] flex items-center justify-center">
                <span className="text-white/80 text-[32px] leading-none">✧</span>
              </div>
            </div>
          </div>

          {/* Передняя сторона (лицо карты) */}
          <div
            className="absolute inset-0 backface-hidden rounded-[12px] overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: orientation === 'reversed' ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)',
            }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={cardName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                <span className="text-white text-xl font-bold text-center px-4">
                  {cardName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка "Узнать результат" */}
      {showButton && (
        <button
          onClick={onComplete}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in"
        >
          Узнать результат
        </button>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

