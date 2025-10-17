// src/pages/tarot.page.tsx
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { TarotStage } from "@/components/tarot/tarot-wheel/TarotStage";
import { TarotWheel, WheelConfig } from "@/components/tarot/tarot-wheel/TarotWheel";
import TarotCategorySelect from "@/components/tarot/TarotCategorySelect";
import { TarotCardFlipOverlay } from "@/components/tarot/TarotCardFlipOverlay";

import type { TarotDrawResponse, TarotCategory } from "@/config/api";

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

        {/* Колесо */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 z-0">
          <TarotWheel
            config={wheelConfig}
            category={category}
            onDrawComplete={handleDrawComplete}
            onNoCategorySelected={() => setShowCategoryWarning(true)}
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
