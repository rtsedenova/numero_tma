export interface NumerologyResult {
  date: string; // ISO date string (YYYY-MM-DD)
  number: number;
  isMasterNumber: boolean;
  formula: string;
  steps: number[];
}

export interface NumerologyRequest {
  telegramId: string;
  numerologyResult: NumerologyResult;
}

export interface NumerologyResponse {
  success: boolean;
  message: string;
  predictionsLeft?: number;
}

export interface NumerologyError {
  code: string;
  message: string;
  details?: unknown;
}
