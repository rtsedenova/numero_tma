export interface NumerologyResultData {
  number: number;
  steps: number[];
  formula: string;
  isMasterNumber: boolean;
}

export interface NumerologyRequest {
  telegramId: string;
  numerologyResult: {
    date: string;
    number: number;
    isMasterNumber: boolean;
    steps: number[];
    formula: string;
  };
}

export interface NumerologyResponse {
  success: boolean;
  message: string;
}
