import { api, API_ENDPOINTS } from '@/config/api';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

interface GetPredictionsResponse {
  predictionsLeft?: number;
  predictions_left?: number;
  numerologyFreePredictionsLeft: number;
  tarotFreePredictionsLeft: number;
  credits: number;
}

export async function getPredictionsFromServer(
  telegramId: number,
): Promise<void> {
  try {
    const { data } = await api.get<GetPredictionsResponse>(
      API_ENDPOINTS.db.predictions.get.replace(
        ':telegramId',
        telegramId.toString(),
      ),
    );

    usePredictionAttempts.getState().updatePredictions({
      numerologyFreePredictionsLeft: data.numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft: data.tarotFreePredictionsLeft,
      credits: data.credits,
    });
  } catch (error) {
    console.error('[Predictions] fetch error', { error });
    throw error;
  }
}
