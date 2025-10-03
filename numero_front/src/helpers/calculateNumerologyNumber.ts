export interface NumerologyResultData {
  number: number;
  steps: number[];
  formula: string;
  isMasterNumber: boolean;
}

export function calculateNumerologyNumber(isoDate: string): NumerologyResultData {
  const digits = isoDate.replace(/-/g, '').split('').map(Number);
  const formula = `${digits.join('+')} = `;
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  const steps: number[] = [sum];

  if (sum === 11 || sum === 22) {
    return {
      number: sum,
      steps,
      formula: formula + sum,
      isMasterNumber: true
    };
  }

  while (sum >= 10) {
    const newSum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    steps.push(newSum);
    if (newSum === 11 || newSum === 22) {
      return {
        number: newSum,
        steps,
        formula: formula + newSum,
        isMasterNumber: true
      };
    }
    sum = newSum;
  }

  return {
    number: sum,
    steps,
    formula: formula + sum,
    isMasterNumber: false
  };
}
