import { useCallback, useState } from 'react';
import { api, API_ENDPOINTS } from '@/config/api';
import type { NumerologyResultData } from '@/helpers/calculateNumerologyNumber';
import type { DestinyNumberData } from '@/types/destiny';
import { useTelegramUser } from './useTelegramUser';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

type SendNumerologyResultResponse = {
  success: boolean;
  message: string;
  interpretation?: DestinyNumberData;
  predictionsLeft?: number;
  numerologyFreePredictionsLeft?: number;
  tarotFreePredictionsLeft?: number;
  credits?: number;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UseSendNumerologyResultReturn {
  status: Status;
  isLoading: boolean;
  error: string | null;
  interpretation: DestinyNumberData | null;
  sendResult: (date: string, result: NumerologyResultData) => Promise<boolean>;
  reset: () => void;
}

function toErrorMessage(err: unknown): string {
  const anyErr = err as {
    message?: string;
    response?: {
      data?: { message?: string } | string;
      status?: number;
    };
  };

  if (anyErr?.response?.data) {
    const data = anyErr.response.data;
    if (typeof data === 'string') return data;

    const maybeWithMessage = data as { message?: string };
    if (typeof maybeWithMessage.message === 'string') {
      return maybeWithMessage.message;
    }
  }

  return anyErr?.message || 'Failed to send numerology result to server';
}

export const useSendNumerologyResult = (): UseSendNumerologyResultReturn => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [interpretation, setInterpretation] =
    useState<DestinyNumberData | null>(null);

  const { user } = useTelegramUser();
  const { updatePredictions } = usePredictionAttempts();

  const isLoading = status === 'loading';
  const userId = user?.id;

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setInterpretation(null);
  }, []);

  const sendResult = useCallback(
    async (date: string, result: NumerologyResultData): Promise<boolean> => {
      if (!userId) {
        setStatus('error');
        setError('User not authenticated');
        return false;
      }

      setStatus('loading');
      setError(null);

      try {
        const payload = {
          telegramId: userId,
          numerologyResult: {
            date,
            number: result.number,
            isMasterNumber: result.isMasterNumber,
            formula: result.formula,
            steps: result.steps,
          },
        };

        const { data } = await api.post<SendNumerologyResultResponse>(
          API_ENDPOINTS.numerology.calculate,
          payload,
        );

        if (data?.success) {
          setStatus('success');
          setInterpretation(data.interpretation || null);

          if (
            data.numerologyFreePredictionsLeft !== undefined &&
            data.tarotFreePredictionsLeft !== undefined &&
            data.credits !== undefined
          ) {
            updatePredictions({
              numerologyFreePredictionsLeft:
                data.numerologyFreePredictionsLeft,
              tarotFreePredictionsLeft: data.tarotFreePredictionsLeft,
              credits: data.credits,
            });
          }

          return true;
        }

        const message = data?.message || 'Failed to save numerology result';
        setError(message);
        setStatus('error');
        return false;
      } catch (err) {
        console.error('[Numerology] send result error', { error: err });
        setError(toErrorMessage(err));
        setStatus('error');
        return false;
      }
    },
    [userId, updatePredictions],
  );

  return {
    status,
    isLoading,
    error,
    interpretation,
    sendResult,
    reset,
  };
};
