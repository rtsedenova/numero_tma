import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WarningCircle } from 'phosphor-react';

import { Page } from '@/components/Page';
import { TarotStage } from '@/components/tarot/tarot-wheel/TarotStage';
import { TarotWheel } from '@/components/tarot/tarot-wheel/TarotWheel';
import TarotCategorySelect from '@/components/tarot/TarotCategorySelect';
import { TarotCardFlipOverlay } from '@/components/tarot/TarotCardFlipOverlay';
import { SelectedCard } from '@/components/tarot/SelectedCard';
import { SwipeIndicators } from '@/components/tarot/SwipeIndicators';
import { usePredictionAttempts } from '@/storage/predictionAttempts';
import { useTarotCategoryStore } from '@/storage/tarotCategoryStorage';

import type { TarotDrawResponse, TarotCategory, WheelConfig } from '@/types/tarot';

const CREDITS_PER_PREDICTION = 100;

export function TarotPage() {
  const navigate = useNavigate();
  const {
    tarotFreePredictionsLeft,
    credits,
    isLoading: isPredictionsLoading,
    updatePredictions,
  } = usePredictionAttempts();

  const { category, setCategory } = useTarotCategoryStore();

  const wheelConfig: WheelConfig = {
    radiusDesktop: 2500,
    radiusMobile: 1800,
    arcAngle: 40,
    cardCount: 78,
  };
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
      replace: true,
    });
  };

  return (
    <Page>
      <TarotStage>
        {hasNoPredictions && (
          <div className="absolute left-1/2 top-20 z-[10000] max-w-md -translate-x-1/2 rounded-xl border border-orange-300/30 bg-orange-500/10 p-4 text-center">
            <span className="mb-3 block text-orange-200">
              Бесплатные предсказания закончились. Для получения предсказания
              необходимо минимум 100 кредитов. Пожалуйста, купите кредиты для
              продолжения.
            </span>
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="mt-3 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-2 font-medium text-white transition hover:brightness-110 active:brightness-95"
            >
              Купить кредиты
            </button>
          </div>
        )}

        <div className="tarot-page absolute left-1/2 top-6 z-[9999] flex -translate-x-1/2 flex-col items-center">
          <div className="flex flex-col gap-2 w-full">
            <TarotCategorySelect
              category={category}
              onChange={(next: TarotCategory) => {
                setCategory(next);
                setShowCategoryWarning(false);
              }}
            />
            {showCategoryWarning && (
              <p className="text-red-400 text-sm whitespace-nowrap text-start flex items-center gap-1">
                <WarningCircle size={16} /> Пожалуйста, выберите категорию.
              </p>
            )}
          </div>
        </div>

        <div className="absolute left-1/2 top-42 md:top-38 z-[9998] -translate-x-1/2">
          <SelectedCard
            selectedIndex={selectedCardIndex}
            totalCards={wheelConfig.cardCount}
          />
        </div>

        <div className="absolute bottom-10 left-1/2 z-[-1] -translate-x-1/2">
          <SwipeIndicators />
        </div>

        <div className="absolute -bottom-46 md:-bottom-52 left-1/2 z-0 -translate-x-1/2">
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
