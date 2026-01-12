export interface CalculationStep {
  formula: string;
  result: number;
}

export interface CalculationStepsProps {
  steps: CalculationStep[];
  className?: string;
}

export const CalculationSteps = ({ steps, className = "" }: CalculationStepsProps) => {
  return (
    <div className={className}>
      <h4 className="text-[var(--text)] font-semibold mb-2">
        Полный расчёт нумерологического числа:
      </h4>

      <div
        className={[
          "rounded-lg p-3 md:mb-4",
          "bg-[color-mix(in_srgb,var(--el-bg)_85%,transparent)]",
          "ring-1 ring-[var(--border)]",
        ].join(" ")}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={[
              "text-sm font-medium text-[var(--text-secondary)]",
              index !== steps.length - 1
                ? "pb-2 mb-2 border-b border-[var(--border)]"
                : "",
            ].join(" ")}
          >
            <span className="tracking-[0.18em]">
              {step.formula} ={" "}
              <span className="text-[var(--text)] font-bold tabular-nums tracking-normal">
                {step.result}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
