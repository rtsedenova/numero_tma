import { FC, useCallback } from "react";
import { Page } from "@/components/Page";
import { TarotStage } from "@/components/tarot/tarot-wheel/TarotStage";
import { TarotWheel, TarotWheelCard } from "@/components/tarot/tarot-wheel/TarotWheel";
import { allTarotCards } from "@/components/tarot/tarot-wheel/tarotCards.data";

export const TarotPage: FC = () => {
  const handleCardSelect = useCallback((card: TarotWheelCard) => {
    console.log("Selected card:", card);
  }, []);

  return (
    <Page>
      <TarotStage className="tarot-page__stage">
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "2rem", lineHeight: 1.2 }}>
            Таро
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0 }}>
          Крутите колесо и вытяните карту
          </p>
        </header>

        <TarotWheel
          cards={allTarotCards}
          onCardSelect={handleCardSelect}
          spacing={100}          // шаг между картами (управляет "скоростью" скролла)
          rayAngle={90}          // угол луча для геометрии дуги (используется в карточке)
          flipDurationMs={1500}  // длительность flip-анимации
          inertiaFriction={0.95} // затухание инерции (0..1)
          inertiaStopV={5}       // порог остановки инерции
        />
      </TarotStage>
    </Page>
  );
};
