import { type FC } from 'react';

interface CalculationStepsProps {
  steps: string[];
}

export const CalculationSteps: FC<CalculationStepsProps> = ({ steps }) => {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="calculation-steps">
      <h2>Шаги расчета:</h2>
      <ul>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
}; 