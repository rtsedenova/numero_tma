import { useThemeStore } from '../storage/themeStorage';

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  return { theme, toggleTheme, setTheme };
};
