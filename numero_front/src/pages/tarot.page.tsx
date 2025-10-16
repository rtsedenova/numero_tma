import { Page } from "@/components/Page";
import { TarotStage } from "@/components/tarot/tarot-wheel/TarotStage";
import { TarotWheel } from "@/components/tarot/tarot-wheel/TarotWheel";
import { WheelConfig } from "@/components/tarot/tarot-wheel/TarotWheel";
import { FC } from "react";

export const TarotPage: FC = () => {
  const wheelConfig: WheelConfig = {
    radiusDesktop: 2500,
    radiusMobile: 1800,
    arcAngle: 40,
    cardCount: 78
  };

  return (
    <Page>
      <TarotStage>
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2">
    <TarotWheel config={wheelConfig} />
  </div>
    </TarotStage>
    </Page>
  );
}
