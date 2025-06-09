import { useEffect } from 'react';
import { useTelegramUser } from './useTelegramUser';
import { api, API_ENDPOINTS } from '@/config/api';

interface CreateUserResponse {
  message: string;
  user: {
    id: number;
    created_at: string;
  };
}

export const useSendInitData = () => {
  const { user, initDataRaw } = useTelegramUser();

  useEffect(() => {
    if (!user || !initDataRaw) return;

    const sendData = async () => {
      try {
        await api.post<CreateUserResponse>(API_ENDPOINTS.db.users.create, {
          telegram_id: user.id,
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          language_code: user.languageCode,
          is_premium: user.isPremium,
        });

        console.log(user)

      } catch (error) {
        console.error('Error: unable to send initData:', error);
      }
    };

    sendData();
  }, [user, initDataRaw]);
};
