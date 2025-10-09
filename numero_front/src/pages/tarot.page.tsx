import { FC } from "react"
import { Page } from "@/components/Page"
import { TarotStage, TarotWheel, TarotWheelCard } from "@/components/tarot/tarot-wheel"

// Generate all 78 tarot cards (22 Major Arcana + 56 Minor Arcana)
const wheelCards: TarotWheelCard[] = [
  // Major Arcana (22 cards)
  { id: 0, image: '/assets/major_arcana/img45.jpg', alt: 'The Fool' },
  { id: 1, image: '/assets/major_arcana/the_magician.jpg', alt: 'The Magician' },
  { id: 2, image: '/assets/major_arcana/the_popess.jpg', alt: 'The High Priestess' },
  { id: 3, image: '/assets/major_arcana/the_empress.jpg', alt: 'The Empress' },
  { id: 4, image: '/assets/major_arcana/the_emperor.jpg', alt: 'The Emperor' },
  { id: 5, image: '/assets/major_arcana/the_pope.jpg', alt: 'The Hierophant' },
  { id: 6, image: '/assets/major_arcana/the_lovers.jpg', alt: 'The Lovers' },
  { id: 7, image: '/assets/major_arcana/the_chariot.jpg', alt: 'The Chariot' },
  { id: 8, image: '/assets/major_arcana/strength.jpg', alt: 'Strength' },
  { id: 9, image: '/assets/major_arcana/the_hermit.jpg', alt: 'The Hermit' },
  { id: 10, image: '/assets/major_arcana/wheel_of_fortune.jpg', alt: 'Wheel of Fortune' },
  { id: 11, image: '/assets/major_arcana/justice.jpg', alt: 'Justice' },
  { id: 12, image: '/assets/major_arcana/the_hanged_man.jpg', alt: 'The Hanged Man' },
  { id: 13, image: '/assets/major_arcana/death.jpg', alt: 'Death' },
  { id: 14, image: '/assets/major_arcana/temperance.jpg', alt: 'Temperance' },
  { id: 15, image: '/assets/major_arcana/the_devil.jpg', alt: 'The Devil' },
  { id: 16, image: '/assets/major_arcana/the_tower.jpg', alt: 'The Tower' },
  { id: 17, image: '/assets/major_arcana/the_star.jpg', alt: 'The Star' },
  { id: 18, image: '/assets/major_arcana/the_moon.jpg', alt: 'The Moon' },
  { id: 19, image: '/assets/major_arcana/the_sun.jpg', alt: 'The Sun' },
  { id: 20, image: '/assets/major_arcana/judgement.jpg', alt: 'Judgement' },
  { id: 21, image: '/assets/major_arcana/img46.jpg', alt: 'The World' },
  
  // Minor Arcana - Coins (14 cards)
  { id: 22, image: '/assets/minor_arcana/ace_of_coins.jpg', alt: 'Ace of Coins' },
  { id: 23, image: '/assets/minor_arcana/ii_of_coins.jpg', alt: 'Two of Coins' },
  { id: 24, image: '/assets/minor_arcana/iii_of_coins.jpg', alt: 'Three of Coins' },
  { id: 25, image: '/assets/minor_arcana/iv_of_coins.jpg', alt: 'Four of Coins' },
  { id: 26, image: '/assets/minor_arcana/v_of_coins.jpg', alt: 'Five of Coins' },
  { id: 27, image: '/assets/minor_arcana/vi_of_coins.jpg', alt: 'Six of Coins' },
  { id: 28, image: '/assets/minor_arcana/vii_of_coins.jpg', alt: 'Seven of Coins' },
  { id: 29, image: '/assets/minor_arcana/viii_of_coins.jpg', alt: 'Eight of Coins' },
  { id: 30, image: '/assets/minor_arcana/ix_of_coins.jpg', alt: 'Nine of Coins' },
  { id: 31, image: '/assets/minor_arcana/x_of_coins.jpg', alt: 'Ten of Coins' },
  { id: 32, image: '/assets/minor_arcana/page_of_coins.jpg', alt: 'Page of Coins' },
  { id: 33, image: '/assets/minor_arcana/knight_of_coins.jpg', alt: 'Knight of Coins' },
  { id: 34, image: '/assets/minor_arcana/queen_of_coins.jpg', alt: 'Queen of Coins' },
  { id: 35, image: '/assets/minor_arcana/king_of_coins.jpg', alt: 'King of Coins' },
  
  // Minor Arcana - Cups (14 cards)
  { id: 36, image: '/assets/minor_arcana/ace_of_cups.jpg', alt: 'Ace of Cups' },
  { id: 37, image: '/assets/minor_arcana/ii_of_cups.jpg', alt: 'Two of Cups' },
  { id: 38, image: '/assets/minor_arcana/iii_of_cups.jpg', alt: 'Three of Cups' },
  { id: 39, image: '/assets/minor_arcana/iv_of_cups.jpg', alt: 'Four of Cups' },
  { id: 40, image: '/assets/minor_arcana/v_of_cups.jpg', alt: 'Five of Cups' },
  { id: 41, image: '/assets/minor_arcana/vi_of_cups.jpg', alt: 'Six of Cups' },
  { id: 42, image: '/assets/minor_arcana/vii_of_cups.jpg', alt: 'Seven of Cups' },
  { id: 43, image: '/assets/minor_arcana/viii_of_cups.jpg', alt: 'Eight of Cups' },
  { id: 44, image: '/assets/minor_arcana/ix_of_cups.jpg', alt: 'Nine of Cups' },
  { id: 45, image: '/assets/minor_arcana/x_of_cups.jpg', alt: 'Ten of Cups' },
  { id: 46, image: '/assets/minor_arcana/page_of_cups.jpg', alt: 'Page of Cups' },
  { id: 47, image: '/assets/minor_arcana/knight_of_cups.jpg', alt: 'Knight of Cups' },
  { id: 48, image: '/assets/minor_arcana/queen_of_cups.jpg', alt: 'Queen of Cups' },
  { id: 49, image: '/assets/minor_arcana/king_of_cups.jpg', alt: 'King of Cups' },
  
  // Minor Arcana - Swords (14 cards)
  { id: 50, image: '/assets/minor_arcana/ace_of_swords.jpg', alt: 'Ace of Swords' },
  { id: 51, image: '/assets/minor_arcana/ii_of_swords.jpg', alt: 'Two of Swords' },
  { id: 52, image: '/assets/minor_arcana/iii_of_swords.jpg', alt: 'Three of Swords' },
  { id: 53, image: '/assets/minor_arcana/iv_of_swords.jpg', alt: 'Four of Swords' },
  { id: 54, image: '/assets/minor_arcana/v_of_swords.jpg', alt: 'Five of Swords' },
  { id: 55, image: '/assets/minor_arcana/vi_of_swords.jpg', alt: 'Six of Swords' },
  { id: 56, image: '/assets/minor_arcana/vii_of_swords.jpg', alt: 'Seven of Swords' },
  { id: 57, image: '/assets/minor_arcana/viii_of_swords.jpg', alt: 'Eight of Swords' },
  { id: 58, image: '/assets/minor_arcana/ix_of_swords.jpg', alt: 'Nine of Swords' },
  { id: 59, image: '/assets/minor_arcana/x_of_swords.jpg', alt: 'Ten of Swords' },
  { id: 60, image: '/assets/minor_arcana/page_of_swords.jpg', alt: 'Page of Swords' },
  { id: 61, image: '/assets/minor_arcana/knight_of_swords.jpg', alt: 'Knight of Swords' },
  { id: 62, image: '/assets/minor_arcana/queen_of_swords.jpg', alt: 'Queen of Swords' },
  { id: 63, image: '/assets/minor_arcana/king_of_swords.jpg', alt: 'King of Swords' },
  
  // Minor Arcana - Wands (14 cards)
  { id: 64, image: '/assets/minor_arcana/ace_of_wands.jpg', alt: 'Ace of Wands' },
  { id: 65, image: '/assets/minor_arcana/ii_of_wands.jpg', alt: 'Two of Wands' },
  { id: 66, image: '/assets/minor_arcana/iii_of_wands.jpg', alt: 'Three of Wands' },
  { id: 67, image: '/assets/minor_arcana/iv_of_wands.jpg', alt: 'Four of Wands' },
  { id: 68, image: '/assets/minor_arcana/v_of_wands.jpg', alt: 'Five of Wands' },
  { id: 69, image: '/assets/minor_arcana/vi_of_wands.jpg', alt: 'Six of Wands' },
  { id: 70, image: '/assets/minor_arcana/vii_of_wands.jpg', alt: 'Seven of Wands' },
  { id: 71, image: '/assets/minor_arcana/viii_of_wands.jpg', alt: 'Eight of Wands' },
  { id: 72, image: '/assets/minor_arcana/ix_of_wands.jpg', alt: 'Nine of Wands' },
  { id: 73, image: '/assets/minor_arcana/x_of_wands.jpg', alt: 'Ten of Wands' },
  { id: 74, image: '/assets/minor_arcana/page_of_wands.jpg', alt: 'Page of Wands' },
  { id: 75, image: '/assets/minor_arcana/knight_of_wands.jpg', alt: 'Knight of Wands' },
  { id: 76, image: '/assets/minor_arcana/queen_of_wands.jpg', alt: 'Queen of Wands' },
  { id: 77, image: '/assets/minor_arcana/kings_of_wands.jpg', alt: 'King of Wands' },
];

export const TarotPage: FC = () => {
    const handleCardSelect = (card: TarotWheelCard) => {
        console.log('Selected card:', card);
    };

    return (
        <Page>
            <TarotStage>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2rem' }}>
                        Tarot Reading
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                        Spin the wheel and select your destiny card
                    </p>
                </div>
                
                <TarotWheel 
                    cards={wheelCards} 
                    onCardSelect={handleCardSelect}
                    wheelRadius={200}
                />
            </TarotStage>
        </Page>
    )
}
