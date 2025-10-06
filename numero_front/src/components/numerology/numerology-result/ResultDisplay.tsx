import React from "react";

export interface ResultDisplayProps {
  number: number;
  isMasterNumber: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ number, isMasterNumber }) => {
  return (
    <div>
      <h4 className="text-violet-300 font-medium mb-2">Результат:</h4>
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold px-3 py-1 rounded-full border-2 ${
          isMasterNumber 
            ? 'text-yellow-300 border-yellow-300/50 bg-yellow-500/10' 
            : 'text-violet-200 border-violet-300/50 bg-violet-500/10'
        }`}>
          {number}
        </span>
        {isMasterNumber && (
          <span className="text-yellow-300 text-sm font-medium">
            Мастер-число
          </span>
        )}
      </div>
    </div>
  );
};
