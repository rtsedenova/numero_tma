import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateInput } from '@/components/DateInput/DateInput';

describe('DateInput', () => {
  it('renders with correct value', () => {
    render(<DateInput value="2023-12-25" onChange={() => {}} />);
    const input = screen.getByDisplayValue('2023-12-25') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('date');
  });

  it('calls onChange when date changes', () => {
    const handleChange = vi.fn();
    render(<DateInput value="2023-12-25" onChange={handleChange} />);
    const input = screen.getByDisplayValue('2023-12-25') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '2024-01-01' } });

    expect(handleChange).toHaveBeenCalledWith('2024-01-01');
  });
});
