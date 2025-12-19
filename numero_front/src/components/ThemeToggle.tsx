import { useTheme } from '../hooks/useTheme';
import { Moon, SunDim } from 'phosphor-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const vars = {
    ['--tt-w']: '58px',
    ['--tt-h']: '30px',
    ['--tt-pad']: '4px',
    ['--tt-icon']: '18px',
  } as React.CSSProperties;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Переключить тему"
      style={{ WebkitTapHighlightColor: 'transparent', ...vars }}
      className="inline-flex items-center bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="relative overflow-hidden rounded-full transition-[background] duration-150 ease-out"
        style={{
          width: 'var(--tt-w)',
          height: 'var(--tt-h)',
          background: isDark
            ? 'linear-gradient(90deg,rgba(52, 43, 87, 1) 0%, rgba(68, 45, 97, 1) 100%)'
            : 'linear-gradient(90deg,rgba(255, 226, 176, 1) 0%, rgba(250, 204, 255, 1) 100%)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute grid place-items-center rounded-full bg-white/95 transition-transform duration-200 ease-out will-change-transform"
          style={{
            top: 'var(--tt-pad)',
            left: 'var(--tt-pad)',
            width: 'calc(var(--tt-h) - (var(--tt-pad) * 2))',
            height: 'calc(var(--tt-h) - (var(--tt-pad) * 2))',
            transform: isDark ? 'translateX(calc(var(--tt-w) - var(--tt-h)))' : 'translateX(0)',
          }}
        >
          {isDark ? (
            <Moon
              weight="bold"
              className="block"
              style={{
                width: 'var(--tt-icon)',
                height: 'var(--tt-icon)',
                color: '#2a0f4a',
              }}
            />
          ) : (
            <SunDim
              weight="bold"
              className="block"
              style={{
                width: 'var(--tt-icon)',
                height: 'var(--tt-icon)',
                color: '#ffc44d',
                filter: 'drop-shadow(0 0 2px rgba(255, 122, 183, 0.35))',
              }}
            />
          )}
        </span>
      </span>
    </button>
  );
};
