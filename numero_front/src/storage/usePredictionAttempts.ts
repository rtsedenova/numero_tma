import { create } from 'zustand';
import { getPredictionsFromServer } from '@/api/getPredictions';

interface PredictionAttempts {
  freePredictionsLeft: number | null;
  isLoading: boolean;
  decrement: () => void;
  reset: (value: number) => void;
  fetchPredictions: (telegramId: number) => Promise<void>;
}

export const usePredictionAttempts = create<PredictionAttempts>((set) => ({
  freePredictionsLeft: null, // Start with null to indicate we need to fetch from server
  isLoading: true,

  decrement: () =>
    set((state) => ({
      freePredictionsLeft: state.freePredictionsLeft !== null ? Math.max(0, state.freePredictionsLeft - 1) : null,
    })),

  reset: (value) => set({ freePredictionsLeft: value }),

  fetchPredictions: async (telegramId: number) => {
    set({ isLoading: true });
    try {
      await getPredictionsFromServer(telegramId);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
