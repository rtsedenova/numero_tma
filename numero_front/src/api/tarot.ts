import { api, API_ENDPOINTS } from '@/config/api';
import type { TarotDrawResponse, TarotDrawParams } from '@/types/tarot';

export const tarotApi = {
  /**
   * Выполнить реальную "вытяжку" карты на сервере.
   * Сервер фиксирует результат, применяет шанс реверса и возвращает текст.
   * По умолчанию используем POST (стейтфул операция).
   */
  draw: async (params?: TarotDrawParams): Promise<TarotDrawResponse> => {
    console.log('[tarotApi] ==========================================');
    console.log('[tarotApi] Making request to:', API_ENDPOINTS.tarot.draw);
    console.log('[tarotApi] Request params:', JSON.stringify(params, null, 2));
    
    try {
      const { data } = await api.post<TarotDrawResponse>(API_ENDPOINTS.tarot.draw, params ?? {});
      console.log('[tarotApi] Response received:', JSON.stringify({
        ok: data.ok,
        cardName: data.result?.card?.name,
        orientation: data.result?.orientation,
        hasGeneral: !!data.result?.text?.general,
        hasByCategory: !!data.result?.text?.by_category,
        byCategoryPreview: data.result?.text?.by_category?.substring(0, 50)
      }, null, 2));
      console.log('[tarotApi] Full result.text:', data.result?.text);
      console.log('[tarotApi] ==========================================');
      return data;
    } catch (error) {
      console.error('[tarotApi] Request failed:', error);
      throw error;
    }
  },
};
