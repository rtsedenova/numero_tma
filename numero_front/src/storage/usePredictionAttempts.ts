import { create } from 'zustand';

interface PredictionAttempts {
  freePredictionsLeft: number;
  decrement: () => void;
  reset: (value: number) => void;
}

export const usePredictionAttempts = create<PredictionAttempts>((set) => ({
  freePredictionsLeft: 8, 

  decrement: () =>
    set((state) => ({
      freePredictionsLeft: Math.max(0, state.freePredictionsLeft - 1),
    })),

  reset: (value) => set({ freePredictionsLeft: value }),
}));
