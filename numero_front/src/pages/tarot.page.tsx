import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { TarotStage } from '@/components/tarot/tarot-wheel/TarotStage';
import { TarotWheel } from '@/components/tarot/tarot-wheel/TarotWheel';
import TarotCategorySelect from '@/components/tarot/TarotCategorySelect';
import { TarotCardFlipOverlay } from '@/components/tarot/TarotCardFlipOverlay';
import { SelectedCard } from '@/components/tarot/SelectedCard';
import { SwipeIndicators } from '@/components/tarot/SwipeIndicators';
import { usePredictionAttempts } from '@/storage/predictionAttempts';
import { useTelegramUser } from '@/hooks/useTelegramUser';

import type { TarotDrawResponse, TarotCategory, WheelConfig } from '@/types/tarot';

const CREDITS_PER_PREDICTION = 100;

export function TarotPage() {
  const navigate = useNavigate();
  const { user } = useTelegramUser();
  const {
    tarotFreePredictionsLeft,
    credits,
    fetchPredictions,
    isLoading: isPredictionsLoading,
    updatePredictions,
  } = usePredictionAttempts();

  useEffect(() => {
    if (!user?.id) return;
    fetchPredictions(user.id);
  }, [user?.id, fetchPredictions]);

  const wheelConfig: WheelConfig = {
    radiusDesktop: 2500,
    radiusMobile: 1800,
    arcAngle: 40,
    cardCount: 78,
  };

  const [category, setCategory] = useState<TarotCategory | null>(null);
  const [result, setResult] = useState<TarotDrawResponse['result'] | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCategoryWarning, setShowCategoryWarning] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const hasNoPredictions =
    !isPredictionsLoading &&
    tarotFreePredictionsLeft !== null &&
    credits !== null &&
    tarotFreePredictionsLeft === 0 &&
    credits < CREDITS_PER_PREDICTION;

  const handleDrawComplete = (resp: TarotDrawResponse) => {
    console.log('[Tarot] draw completed', {
      orientation: resp.result?.orientation,
      tarotFreePredictionsLeft: resp.tarotFreePredictionsLeft,
      credits: resp.credits,
    });

    setResult(resp.result);
    setShowOverlay(true);

    if (
      resp.tarotFreePredictionsLeft !== undefined &&
      resp.numerologyFreePredictionsLeft !== undefined &&
      resp.credits !== undefined
    ) {
      updatePredictions({
        numerologyFreePredictionsLeft: resp.numerologyFreePredictionsLeft,
        tarotFreePredictionsLeft: resp.tarotFreePredictionsLeft,
        credits: resp.credits,
      });
    }
  };

  const handleOverlayComplete = () => {
    if (!result) return;

    navigate('/tarot-result', {
      state: { result, category },
    });
  };

  return (
    <Page>
      <TarotStage>
        {hasNoPredictions && (
          <div className="absolute left-1/2 top-20 z-[10000] max-w-md -translate-x-1/2 rounded-xl border border-orange-300/30 bg-orange-500/10 p-4 text-center">
            <p className="mb-3 text-orange-200">
              Бесплатные предсказания закончились. Для получения предсказания
              необходимо минимум 100 кредитов. Пожалуйста, купите кредиты для
              продолжения.
            </p>
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-2 font-medium text-white transition hover:brightness-110 active:brightness-95"
            >
              Купить кредиты
            </button>
          </div>
        )}

        <div className="absolute left-1/2 top-6 z-[9999] flex -translate-x-1/2 flex-col items-center">
          <TarotCategorySelect
            category={category}
            onChange={(next: TarotCategory) => {
              setCategory(next);
              setShowCategoryWarning(false);
            }}
          />
          {showCategoryWarning && (
            <span className="mt-2 rounded-lg bg-red-900/30 px-3 py-1 text-sm text-red-300 backdrop-blur-sm">
              ⚠️ Пожалуйста, выберите категорию
            </span>
          )}
        </div>

        <div className="absolute left-1/2 top-38 z-[9998] -translate-x-1/2">
          <SelectedCard
            selectedIndex={selectedCardIndex}
            totalCards={wheelConfig.cardCount}
          />
        </div>

        <div className="absolute bottom-10 left-1/2 z-[-1] -translate-x-1/2">
          <SwipeIndicators />
        </div>

        <div className="absolute -bottom-46 left-1/2 z-0 -translate-x-1/2">
          <TarotWheel
            config={wheelConfig}
            category={category}
            onDrawComplete={handleDrawComplete}
            onNoCategorySelected={() => setShowCategoryWarning(true)}
            onSelectedCardChange={setSelectedCardIndex}
          />
        </div>
      </TarotStage>

      {showOverlay && result && (
        <TarotCardFlipOverlay
          cardName={result.card.name}
          cardImageKey={result.card.image_key}
          cardImage={result.card.image}
          orientation={result.orientation}
          onComplete={handleOverlayComplete}
        />
      )}
    </Page>
  );
}
