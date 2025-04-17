import { useEffect } from 'react';
import { initData } from '@telegram-apps/sdk-react';
import { addUserToDB } from '@/api/user';

export const useInitUser = () => {
  useEffect(() => {
    const state = initData.state();

    if (!state?.user) return;

    const telegram_id = state.user.id;

    addUserToDB(telegram_id)
      .then((res) => {
        console.log('[useInitUser] Пользователь добавлен:', res);
      })
      .catch((err) => {
        console.error('[useInitUser] Ошибка при добавлении пользователя:', err);
      });
  }, []);
};
