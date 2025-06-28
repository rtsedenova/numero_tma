import { useEffect } from 'react';
import { useTelegramUser } from './useTelegramUser';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

export const useInitializePredictions = () => {
  const { user } = useTelegramUser();
  const { fetchPredictions } = usePredictionAttempts();

  useEffect(() => {
    if (user?.id) {
      fetchPredictions(user.id);
    }
  }, [user?.id, fetchPredictions]);
};
