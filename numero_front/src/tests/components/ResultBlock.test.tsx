import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultBlock } from '@/components/ResultBlock/ResultBlock';

describe('ResultBlock', () => {
  it('renders steps correctly', () => {
    const steps = ['Шаг 1', 'Шаг 2', 'Шаг 3'];
    const result = '11';
    
    render(<ResultBlock steps={steps} result={result} />);
    
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('renders the result if provided', () => {
    const steps = ['Шаг 1', 'Шаг 2'];
    const result = '11';

    render(<ResultBlock steps={steps} result={result} />);
    
    expect(screen.getByText('Результат:')).toBeInTheDocument();
    expect(screen.getByText(result)).toBeInTheDocument();
  });

  it('does not render the result if not provided', () => {
    const steps = ['Шаг 1', 'Шаг 2'];

    render(<ResultBlock steps={steps} result="" />);
    
    expect(screen.queryByText('Результат:')).toBeNull();
  });
});
