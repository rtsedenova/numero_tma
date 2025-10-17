import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://7a61efcf5af9.ngrok-free.app';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const API_ENDPOINTS = {
  s3: {
    numData: '/api/s3/file/num_data.json',
    tarotData: '/api/s3/file/tarot_cards.json'
  },
  db: {
    users: {
      create: '/api/db/users/create-user'
    },
    predictions: {
      update: '/api/db/predictions/update-predictions',
      get: '/api/db/predictions/user/:telegramId'
    }
  },
  payment: {
    createInvoice: '/api/payment/create-invoice'
  },
  tarot: {
    draw: '/api/tarot/draw', // сервер выбирает карту + ориентацию и возвращает текст
  }
} as const;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        default:
          // Handle other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) => apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: unknown) => apiClient.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
}; 

/** ====== TAROT TYPES & API ====== */
export type TarotCategory = 'love' | 'finance' | 'health' | 'future' | 'yesno';

export interface TarotDrawResponse {
  ok: boolean;
  result: {
    card: {
      id: string;
      name: string;
      image?: string;
      image_key?: string;
    };
    orientation: 'upright' | 'reversed';
    text: {
      general: string;
      by_category?: string;
    };
    yesno_score: number;
  };
  remainingFree?: number; // если сервер считает лимиты
}

export const tarotApi = {
  /**
   * Выполнить реальную "вытяжку" карты на сервере.
   * Сервер фиксирует результат, применяет шанс реверса и возвращает текст.
   * По умолчанию используем POST (стейтфул операция).
   */
  draw: async (params?: {
    category?: TarotCategory;
    reversalsEnabled?: boolean;
    reversalChance?: number; // 0..1
  }) => {
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

/** ====== (опционально) Резолвер картинок из ключа ====== */
export const ASSETS_BASE =
  import.meta.env.VITE_ASSETS_BASE || ''; // например, 'https://numero-tma.com/' или CDN

export const imageUrl = (keyOrUrl?: string) => {
  if (!keyOrUrl) return '';
  // если пришёл абсолютный URL — возвращаем как есть
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl;
  // иначе считаем, что это ключ (например, tarot/major_arcana/00-fool.jpg)
  const base = ASSETS_BASE.endsWith('/') ? ASSETS_BASE : `${ASSETS_BASE}/`;
  return `${base}${keyOrUrl}`;
};