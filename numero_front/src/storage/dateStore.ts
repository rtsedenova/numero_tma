import { create } from 'zustand';

interface DateState {
  /** ISO YYYY-MM-DD | null */
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  clearDate: () => void;
  hasCompleteDate: () => boolean;
}

export const useDateStore = create<DateState>((set, get) => ({
  selectedDate: null,
  
  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },
  
  clearDate: () => {
    set({ selectedDate: null });
  },
  
  hasCompleteDate: () => {
    const selectedDate = get().selectedDate;
    return selectedDate !== null && selectedDate !== "";
  },
}));
