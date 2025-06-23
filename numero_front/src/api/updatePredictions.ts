import { api, API_ENDPOINTS } from '@/config/api';

interface UpdatePredictionsResponse {
  message: string;
  predictionsLeft: number;
}

export async function updatePredictionsOnServer(telegramId: string, predictionsLeft: number) {
  console.log('Sending update request with:', { telegramId, predictionsLeft });
  
  try {
    const { data } = await api.put<UpdatePredictionsResponse>(
      API_ENDPOINTS.db.predictions.update,
      { telegramId, predictionsLeft }
    );
    console.log('Update response:', data);
    return data;
  } catch (error) {
    console.error('Error updating predictions:', error);
    throw error;
  }
}

// https://numero-tma-server.com/api/db/predictions/update-predictions