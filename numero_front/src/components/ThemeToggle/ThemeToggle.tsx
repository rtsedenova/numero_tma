import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <label>
        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
        Темная тема
      </label>
    </div>
  );
};


