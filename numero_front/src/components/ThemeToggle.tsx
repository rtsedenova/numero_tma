import { Moon, Sun } from 'phosphor-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Переключить тему"
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
    >
      <span
        aria-hidden="true"
        className={[
          'relative inline-flex',
          'h-7 w-14 rounded-full p-1',
          'transition-colors duration-200',
          isDark ? 'bg-black/20 ring-1 ring-purple-300/15' : 'bg-purple-900/10 ring-1 ring-purple-900/20',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'absolute inset-y-1 left-1',
            'aspect-square rounded-full bg-white shadow-sm',
            'grid place-items-center',
            'transition-transform duration-200',
            isDark ? 'translate-x-7' : 'translate-x-0',
          ].join(' ')}
        >
          {isDark ? <Moon weight="bold" color="#39175A" className="h-3 w-3" /> : <Sun weight="bold" color="#AF89D3" className="h-3 w-3" />}
        </span>
      </span>
    </button>
  );
};
