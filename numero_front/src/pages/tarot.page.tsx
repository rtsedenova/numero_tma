import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { TarotStage } from "@/components/tarot/tarot-wheel/TarotStage";
import { TarotWheel } from "@/components/tarot/tarot-wheel/TarotWheel";
import TarotCategorySelect from "@/components/tarot/TarotCategorySelect";
import { TarotCardFlipOverlay } from "@/components/tarot/TarotCardFlipOverlay";
import { SelectedCard } from "@/components/tarot/SelectedCard";
import { SwipeIndicators } from "@/components/tarot/SwipeIndicators";

import type { TarotDrawResponse, TarotCategory, WheelConfig } from "@/types/tarot";

export const TarotPage: FC = () => {
  const navigate = useNavigate();
  const wheelConfig: WheelConfig = {
    radiusDesktop: 2500,
    radiusMobile: 1800,
    arcAngle: 40,
    cardCount: 78,
  };

  // выбранная категория и результат вытяжки
  const [category, setCategory] = React.useState<TarotCategory | null>(null);
  const [result, setResult] = React.useState<TarotDrawResponse["result"] | null>(null);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [showCategoryWarning, setShowCategoryWarning] = React.useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = React.useState<number | null>(null);

  const handleDrawComplete = (resp: TarotDrawResponse) => {
    console.log('[tarot.page] handleDrawComplete called with:', resp);
    setResult(resp.result);
    setShowOverlay(true);
    console.log('[tarot.page] State updated - result:', resp.result, 'showOverlay: true');
  };

  const handleOverlayComplete = () => {
    if (result) {
      // Переход на страницу результата с передачей данных через state
      navigate("/tarot-result", { state: { result, category } });
    }
  };

  return (
    <Page>
      <TarotStage>
        {/* Панель выбора категории */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center">
          <TarotCategorySelect
            category={category}
            onChange={(next: TarotCategory) => {
              setCategory(next);
              setShowCategoryWarning(false);
            }}
          />
          {showCategoryWarning && (
            <span className="mt-2 text-sm text-red-300 bg-red-900/30 px-3 py-1 rounded-lg backdrop-blur-sm">
              ⚠️ Пожалуйста, выберите категорию
            </span>
          )}
        </div>

        {/* Отображение выбранной карты */}
        <div className="absolute top-38 left-1/2 -translate-x-1/2 z-[9998]">
          <SelectedCard
            selectedIndex={selectedCardIndex}
            totalCards={wheelConfig.cardCount}
          />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[-1]">
          <SwipeIndicators />
        </div>

        {/* Колесо */}
        <div className="absolute -bottom-46 left-1/2 -translate-x-1/2 z-0">
          <TarotWheel
            config={wheelConfig}
            category={category}
            onDrawComplete={handleDrawComplete}
            onNoCategorySelected={() => setShowCategoryWarning(true)}
            onSelectedCardChange={setSelectedCardIndex}
          />
        </div>
      </TarotStage>

      {/* Overlay с flip анимацией */}
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
};
