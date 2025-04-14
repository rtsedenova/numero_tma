import { FC } from "react";
import "@/styles/components/result-block.scss";

interface ResultBlockProps {
  steps: string[];
  result: string;
}

export const ResultBlock: FC<ResultBlockProps> = ({ steps, result }) => {
  return (
    <div className="result-block">
      {steps.map((step, index) => (
        <p key={index}>{step}</p>
      ))}
      {result && (
        <p>
          <strong>Результат:</strong> {result}
        </p>
      )}
    </div>
  );
};
