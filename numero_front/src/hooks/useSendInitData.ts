import { useEffect } from 'react';
import { useTelegramUser } from './useTelegramUser';

export const useSendInitData = () => {
  const { user, initDataRaw } = useTelegramUser();

  useEffect(() => {

    if (!user || !initDataRaw) return;

    console.log("user", user);

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
            is_premium: user.isPremium,
            photo_url: user.photoUrl,
            init_data_raw: initDataRaw,
          }),
        });

        console.log("Данные успешно отправлены");
      } catch (error) {
        console.error('Ошибка при отправке initData:', error);
      }
    };

    sendData();
  }, [user, initDataRaw]);
};
