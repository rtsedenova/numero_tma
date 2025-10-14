import { FC } from "react";
import { Page } from "@/components/Page";
import { NewTarotStage } from "@/components/tarot/tarot-wheel/NewTarotStage";
import { NewTarotWheel } from "@/components/tarot/tarot-wheel/NewTarotWheel";

export const TarotPage: FC = () => {
  // Generate dummy cards for testing
  const cards = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    image: "",
    alt: `Card ${i + 1}`,
  }));

  return (
    <Page>
      <NewTarotStage>
        <NewTarotWheel cards={cards} />
      </NewTarotStage>
    </Page>
  );
};
