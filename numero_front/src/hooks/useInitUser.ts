import { useEffect } from 'react';
import { initData } from '@telegram-apps/sdk-react';
import { addUserToDB } from '@/api/user';

export const useInitUser = () => {
  useEffect(() => {
    const state = initData.state();

    if (!state?.user || !state.user.username) return;

    const telegram_id = state.user.id;
    const username = state.user.username;

    addUserToDB(telegram_id, 0, username)
      .then((res) => {
        console.log('[useInitUser] Пользователь добавлен:', res);
      })
      .catch((err) => {
        console.error('[useInitUser] Ошибка при добавлении пользователя:', err);
      });
  }, []);
};
