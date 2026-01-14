import React, { useEffect, useRef, useState } from "react";
import type { TarotOrientation } from "@/types/tarot";
import { TarotCardBack } from "./tarot-wheel/TarotCardBack";

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

  useEffect(() => {
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

  useEffect(() => {
    if (!imgSrc) return;
    const timeout = setTimeout(() => {
      const img = imgRef.current;
      if (img && !img.complete) img.src = "";
    }, 3000);
    return () => clearTimeout(timeout);
  }, [imgSrc]);

  const baseEnterTransform = enter
    ? "translateY(0px) scale(1)"
    : "translateY(8px) scale(0.96)";
  const flipDeg = isFlipped ? 180 : 0;
  const cardTransform = `${baseEnterTransform} rotateY(${flipDeg}deg)`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
      style={{
        opacity: enter ? 1 : 0,
        transition: "opacity 300ms ease-out, backdrop-filter 300ms ease-out",
      }}
    >

      <div className="pointer-events-none absolute inset-0 magic-bg" />
      <div className="pointer-events-none absolute inset-0 magic-stars" />

      <div style={{ perspective: "1000px" }}>
        <div className="relative w-[244px] h-[424px]">
          <div 
            className="pointer-events-none absolute inset-[-34px] -z-10"
            style={{
              borderRadius: '999px',
              background: 'radial-gradient(circle at center, var(--result-number-glow) 0%, transparent 70%)',
              filter: 'blur(16px)',
              opacity: 0.85,
              transform: 'scale(1)',
              animation: 'glowPulse 2.6s ease-in-out infinite',
              willChange: 'opacity, transform',
            }}
          />

          <div
            className="relative w-[240px] h-[420px]"
            style={{
              transformStyle: "preserve-3d",
              transform: cardTransform,
              opacity: enter ? 1 : 0,
              transition: "transform 500ms ease-out, opacity 360ms ease-out",
            }}
          >
            <div
              className="absolute inset-0 rounded-[12px] overflow-hidden border-2 shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <TarotCardBack
                innerBorderInset="10px"
                innerBorderRadius="8px"
                sigilHeight="36%"
                sigilBorderWidth="border-2"
                sigilIconSize={42}
              />
            </div>

            {imgSrc && (
              <div
                className="absolute inset-0 rounded-[12px] overflow-hidden shadow-2xl ring-2 ring-purple-300/65"
                style={{
                  backfaceVisibility: "hidden",
                  transform:
                    orientation === "reversed"
                      ? "rotateY(180deg) rotate(180deg)"
                      : "rotateY(180deg)",
                }}
              >
                <img
                  ref={imgRef}
                  src={`/prediction_mini_app/${imgSrc}`}
                  alt={cardName}
                  className="w-full h-full object-cover  "
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.error(
                      "[TarotCardFlipOverlay] Image failed to load:",
                      imgSrc
                    );
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 h-[44px] flex items-center justify-center">
        <button
          onClick={onComplete}
          style={{
            opacity: showButton ? 1 : 0,
            pointerEvents: showButton ? "auto" : "none",
            transition: "opacity 380ms ease-out",
            willChange: "opacity",
          }}
          className="
            inline-flex items-center gap-2 px-4 py-1 rounded-full
            [background-image:var(--gradient-bg)]
            transition-all duration-300 ease-out
            hover:[background-image:var(--gradient-bg-hover)]
            whitespace-nowrap
          "
          aria-hidden={showButton ? "false" : "true"}
        >
          <span className="text-sm font-medium text-[var(--button-text)]">
            Узнать результат
          </span>
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .magic-bg{
              background:
                radial-gradient(
                  700px 420px at 50% 45%,
                  rgba(216,185,255,0.38),
                  rgba(142,86,186,0.18),
                  transparent 70%
                ),
                radial-gradient(
                  900px 520px at 50% 60%,
                  rgba(255,255,255,0.10),
                  transparent 60%
                ),
                radial-gradient(
                  1200px 700px at 50% 50%,
                  rgba(0,0,0,0.05),
                  rgba(0,0,0,0.65) 70%,
                  rgba(0,0,0,0.85) 100%
                );
            }

            @keyframes magicGlow{
              0%   { opacity: .75; transform: scale(1); }
              50%  { opacity: 1;   transform: scale(1.02); }
              100% { opacity: .75; transform: scale(1); }
            }

            .magic-stars{
              opacity: .8;
              background-image:
                radial-gradient(circle, rgba(255,255,255,.85) 0 1px, transparent 2px),
                radial-gradient(circle, rgba(196,165,232,.55) 0 1px, transparent 2px),
                radial-gradient(circle, rgba(255,255,255,.6) 0 1px, transparent 2px);
              background-size: 140px 140px, 220px 220px, 320px 320px;
              background-position: 0 0, 40px 70px, 120px 30px;

              filter: blur(.15px);
              animation: starsDrift 10s linear infinite, starsTwinkle 2.8s ease-in-out infinite;
              will-change: background-position, opacity;
            }

            @keyframes starsDrift{
              from { background-position: 0 0, 40px 70px, 120px 30px; }
              to   { background-position: 140px 220px, -180px 260px, 320px -220px; }
            }

            @keyframes starsTwinkle{
              0%,100% { opacity: .5; }
              50%     { opacity: .95; }
            }

            @keyframes glowPulse{
              0%,100% { opacity: 0.75; transform: scale3d(0.98, 0.98, 1); }
              50% { opacity: 1; transform: scale3d(1.05, 1.05, 1); }
            }
          `,
        }}
      />
    </div>
  );
};
