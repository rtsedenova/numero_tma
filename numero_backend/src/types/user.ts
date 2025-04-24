export type NewUser = {
    telegram_id: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    language_code?: string | null;
    is_premium: boolean;
    photo_url?: string | null;
    init_data_raw: string;
  };
  
  export type UserFromDB = NewUser & {
    id: number;
    created_at: string;
  };
  