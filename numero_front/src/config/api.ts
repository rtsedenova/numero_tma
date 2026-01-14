import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';
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
    createInvoice: '/api/payment/create-invoice',
    checkStatus: '/api/payment/check-status'
  },
  tarot: {
    draw: '/api/tarot/draw', 
  },
  numerology: {
    calculate: '/api/numerology/calculate'
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
