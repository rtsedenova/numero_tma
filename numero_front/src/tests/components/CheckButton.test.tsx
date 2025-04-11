import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckButton } from '@/components/CheckButton/CheckButton';

describe('CheckButton', () => {
  it('renders with correct text when not loading', () => {
    render(<CheckButton onClick={() => {}} disabled={false} isLoading={false} />);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toHaveTextContent('Рассчитать число судьбы');
    expect(button).not.toBeDisabled();
  });

  it('renders with loading text when isLoading is true', () => {
    render(<CheckButton onClick={() => {}} disabled={false} isLoading={true} />);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toHaveTextContent('Загрузка...');
    expect(button).not.toBeDisabled();
  });

  it('is disabled when disabled is true', () => {
    render(<CheckButton onClick={() => {}} disabled={true} isLoading={false} />);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Рассчитать число судьбы');
  });

  it('calls onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();
    render(<CheckButton onClick={handleClick} disabled={false} isLoading={false} />);
    const button = screen.getByRole('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when button is disabled', () => {
    const handleClick = vi.fn();
    render(<CheckButton onClick={handleClick} disabled={true} isLoading={false} />);
    const button = screen.getByRole('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(0); // не должно быть вызова
  });
});
