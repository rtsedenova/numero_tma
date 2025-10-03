import { useCallback, useMemo, useState } from 'react';
import { api, API_ENDPOINTS } from '@/config/api';
import type { NumerologyResultData } from '@/helpers/calculateNumerologyNumber';
import { useTelegramUser } from './useTelegramUser';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

type SendNumerologyResultResponse = {
  success: boolean;
  message: string;
  predictionsLeft?: number;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UseSendNumerologyResultReturn {
  status: Status;
  isLoading: boolean;        
  error: string | null;
  sendResult: (date: string, result: NumerologyResultData) => Promise<boolean>;
  reset: () => void;
}


function toErrorMessage(err: unknown): string {
  const anyErr = err as { 
    message?: string; 
    response?: { 
      data?: { message?: string } | string; 
      status?: number 
    } 
  };
  if (anyErr?.response?.data) {
    const data = anyErr.response.data;
    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string') return data.message;
  }
  return anyErr?.message || 'Failed to send numerology result to server';
}

export const useSendNumerologyResult = (): UseSendNumerologyResultReturn => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const { user } = useTelegramUser();
  const { decrement } = usePredictionAttempts();

  const isLoading = status === 'loading';

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  const sendResult = useCallback(
    async (date: string, result: NumerologyResultData): Promise<boolean> => {
      if (!user?.id) {
        setStatus('error');
        setError('User not authenticated');
        return false;
      }

      setStatus('loading');
      setError(null);

      try {
        const payload = {
          telegramId: user.id,
          numerologyResult: {
            date,
            number: result.number,
            isMasterNumber: result.isMasterNumber,
            formula: result.formula,
            steps: result.steps,
          },
        };

        const { data } = await api.post<SendNumerologyResultResponse>(
          API_ENDPOINTS.s3.numData,
          payload
        );

        if (data?.success) {
          setStatus('success');
          decrement();
          return true;
        }

        const message = data?.message || 'Failed to save numerology result';
        setError(message);
        setStatus('error');
        return false;
      } catch (err) {
        setError(toErrorMessage(err));
        setStatus('error');
        return false;
      }
    },
    [user?.id, decrement]
  );

  return useMemo(
    () => ({
      status,
      isLoading,
      error,
      sendResult,
      reset,
    }),
    [status, isLoading, error, sendResult, reset]
  );
};
