export type NewUser = {
    telegram_id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    language_code?: string | null;
    is_premium: boolean;
  };
  
  export type UserFromDB = NewUser & {
    id: number;
    created_at: string;
    numerology_free_predictions_left: number;
    tarot_free_predictions_left: number;
    credits: number;
  };

