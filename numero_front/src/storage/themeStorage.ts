import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import WebApp from '@twa-dev/sdk';

export type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const getInitialTheme = (): ThemeType => {
  const stored = localStorage.getItem('user_theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return WebApp.themeParams.bg_color !== undefined ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      toggleTheme: () => {
        set((state: ThemeState) => {
          const newTheme: ThemeType = state.theme === 'light' ? 'dark' : 'light';
          localStorage.setItem('user_theme', newTheme);
          return { theme: newTheme };
        });
      },
      setTheme: (theme: ThemeType) => {
        localStorage.setItem('user_theme', theme);
        set({ theme });
      },
    }),
    {
      name: 'user_theme',
      partialize: (state: ThemeState) => ({ theme: state.theme }),
    }
  )
);