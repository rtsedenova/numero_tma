import { api, API_ENDPOINTS } from '@/config/api';
import type { TarotDrawResponse, TarotDrawParams } from '@/types/tarot';

export const tarotApi = {
  draw: async (
    params?: TarotDrawParams & { telegramId?: number },
  ): Promise<TarotDrawResponse> => {
    console.log('[TarotApi] draw request', {
      url: API_ENDPOINTS.tarot.draw,
      params,
    });

    try {
      const { data } = await api.post<TarotDrawResponse>(
        API_ENDPOINTS.tarot.draw,
        params ?? {},
      );

      console.log('[TarotApi] draw success', {
        ok: data.ok,
        cardName: data.result?.card?.name,
        orientation: data.result?.orientation,
        tarotFreePredictionsLeft: data.tarotFreePredictionsLeft,
        credits: data.credits,
      });

      return data;
    } catch (error) {
      console.error('[TarotApi] draw error', { error });
      throw error;
    }
  },
};
