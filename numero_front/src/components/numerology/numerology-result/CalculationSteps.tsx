export interface CalculationStep {
  formula: string;
  result: number;
  isMasterNumber: boolean;
}

export interface CalculationStepsProps {
  steps: CalculationStep[];
}

export const CalculationSteps = ({ steps }: CalculationStepsProps) => {
  return (
    <div>
      <h4 className="text-violet-300 font-medium mb-2">
        Полный расчёт нумерологического числа:
      </h4>
      <div className="bg-violet-500/10 p-3 rounded border border-violet-300/30">
        {steps.map((step, index) => (
          <div
            key={index}
            className="text-violet-100 mb-1 font-medium text-sm"
          >
            <span className="tracking-[0.2em]">
              {step.formula} ={" "}
              <span className="text-violet-200 font-bold">{step.result}</span>
              {step.isMasterNumber && (
                <span className="text-yellow-300 ml-2">(мастер-число)</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
