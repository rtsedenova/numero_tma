import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TarotCategory } from '@/types/tarot';

interface TarotCategoryState {
  category: TarotCategory | null;
  setCategory: (category: TarotCategory | null) => void;
}

export const useTarotCategoryStore = create<TarotCategoryState>()(
  persist(
    (set) => ({
      category: null,
      setCategory: (category: TarotCategory | null) => {
        set({ category });
      },
    }),
    {
      name: 'tarot_category',
      partialize: (state: TarotCategoryState) => ({ category: state.category }),
    }
  )
);
