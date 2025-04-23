import { useEffect, useRef } from 'react';
import { useTelegramUser } from './useTelegramUser';

export const useSendInitData = () => {
  const { user, initDataRaw } = useTelegramUser();
  const hasSent = useRef(false); 

  useEffect(() => {
    if (hasSent.current || !user || !initDataRaw) return;

    const sendData = async () => {
      try {
        await fetch("https://numero-tma-server.com/api/users", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegram_id: user.id,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            language_code: user.languageCode,
            is_bot: user.isBot,
            is_premium: user.isPremium,
            photo_url: user.photoUrl,
            init_data_raw: initDataRaw,
          }),
        });

        hasSent.current = true;
      } catch (error) {
        console.error('Ошибка при отправке initData:', error);
      }
    };

    sendData();
  }, [user, initDataRaw]);
};
