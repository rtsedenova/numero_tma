import { create } from 'zustand';
import { getPredictionsFromServer } from '@/api/getPredictions';

interface UpdatePredictionsPayload {
  numerologyFreePredictionsLeft: number;
  tarotFreePredictionsLeft: number;
  credits: number;
}

interface PredictionAttempts {
  freePredictionsLeft: number | null;
  numerologyFreePredictionsLeft: number | null;
  tarotFreePredictionsLeft: number | null;
  credits: number | null;
  isLoading: boolean;
  decrement: () => void;
  reset: (value: number) => void;
  updatePredictions: (data: UpdatePredictionsPayload) => void;
  fetchPredictions: (telegramId: number) => Promise<void>;
}

export const usePredictionAttempts = create<PredictionAttempts>((set) => ({
  freePredictionsLeft: null,
  numerologyFreePredictionsLeft: null,
  tarotFreePredictionsLeft: null,
  credits: null,
  isLoading: true,

  decrement: () =>
    set((state) => ({
      freePredictionsLeft:
        state.freePredictionsLeft !== null
          ? Math.max(0, state.freePredictionsLeft - 1)
          : null,
      numerologyFreePredictionsLeft:
        state.numerologyFreePredictionsLeft !== null
          ? Math.max(0, state.numerologyFreePredictionsLeft - 1)
          : null,
    })),

  reset: (value) =>
    set({
      freePredictionsLeft: value,
      numerologyFreePredictionsLeft: value,
    }),

  updatePredictions: (data) =>
    set({
      numerologyFreePredictionsLeft: data.numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft: data.tarotFreePredictionsLeft,
      credits: data.credits,
      freePredictionsLeft: data.numerologyFreePredictionsLeft,
    }),

  fetchPredictions: async (telegramId: number) => {
    set({ isLoading: true });
    try {
      await getPredictionsFromServer(telegramId);
    } catch (error) {
      console.error('[Predictions] fetch error', { error });
    } finally {
      set({ isLoading: false });
    }
  },
}));
