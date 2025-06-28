import { api, API_ENDPOINTS } from '@/config/api';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

interface GetPredictionsResponse {
  predictions_left: number;
}

export async function getPredictionsFromServer(telegramId: number): Promise<void> {
  try {
    const { data } = await api.get<GetPredictionsResponse>(
      API_ENDPOINTS.db.predictions.get.replace(':telegramId', telegramId.toString())
    );
    
    // Update the store with the fetched predictions
    usePredictionAttempts.getState().reset(data.predictions_left);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
}
