import { NumerologyResultData } from "./calculateNumerologyNumber";

export interface DetailedCalculationStep {
  formula: string;
  result: number;
  isMasterNumber: boolean;
  isFinal: boolean;
}

export function getDetailedCalculationSteps(
  numerologyResult: NumerologyResultData,
  originalDate: string
): DetailedCalculationStep[] {
  const steps: DetailedCalculationStep[] = [];

  const digits = originalDate.replace(/-/g, '').split('').map(Number);
  const firstStepFormula = digits.join('+');

  steps.push({
    formula: firstStepFormula,
    result: numerologyResult.steps[0],
    isMasterNumber: numerologyResult.steps[0] === 11 || numerologyResult.steps[0] === 22,
    isFinal: numerologyResult.steps.length === 1
  });
  
  for (let i = 1; i < numerologyResult.steps.length; i++) {
    const previousResult = numerologyResult.steps[i - 1];
    const currentResult = numerologyResult.steps[i];
    const previousDigits = previousResult.toString().split('').join('+');
    
    steps.push({
      formula: previousDigits,
      result: currentResult,
      isMasterNumber: currentResult === 11 || currentResult === 22,
      isFinal: i === numerologyResult.steps.length - 1
    });
  }
  
  return steps;
}
