export type TarotCategory = 'love' | 'finance' | 'health' | 'future' | 'yesno';

export type TarotOrientation = 'upright' | 'reversed';

export interface TarotCard {
    id: string;
    name: string;
    image?: string;
    image_key?: string;
}

export interface TarotCardText {
    general: string;
    by_category?: string;
}

export interface TarotDrawResult {
    card: TarotCard;
    orientation: TarotOrientation;
    text: TarotCardText;
    yesno_score: number;
}

export interface TarotDrawResponse {
    ok: boolean;
    result: TarotDrawResult;
    remainingFree?: number; 
    tarotFreePredictionsLeft?: number;
    numerologyFreePredictionsLeft?: number;
    credits?: number;
    code?: string; 
}

export interface TarotDrawParams {
    category?: TarotCategory;
    reversalsEnabled?: boolean;
    reversalChance?: number; 
}

export type TarotCategoryId = TarotCategory;

export interface TarotCategoryInfo {
    id: TarotCategoryId;
    title: string;
    subtitle?: string;
    emoji: string;
}

export interface WheelConfig {
    radiusDesktop: number;
    radiusMobile: number;
    arcAngle: number;
    cardCount: number;
    cardW?: number;
    cardH?: number;
}
