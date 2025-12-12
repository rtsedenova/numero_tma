import type { NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
import type { DestinyNumberData } from "@/types/destiny";
import { getDetailedCalculationSteps } from "@/helpers/getDetailedCalculationSteps";
import { DateDisplay } from "./DateDisplay";
import { CalculationSteps } from "./CalculationSteps";
import { ResultDisplay } from "./ResultDisplay";
import { S3Interpretation } from "./S3Interpretation";
import { LoadingState } from "./LoadingState";

export interface NumerologyResultProps {
  date: string;
  result: NumerologyResultData;
  interpretation?: DestinyNumberData | null;
  isLoadingInterpretation?: boolean;
}

export const NumerologyResult = ({
  date,
  result,
  interpretation,
  isLoadingInterpretation = false,
}: NumerologyResultProps) => {
  const detailedSteps = getDetailedCalculationSteps(result, date);

  const interpretationToShow = interpretation;
  const isLoading = isLoadingInterpretation;

  return (
    <div className="mt-4 p-4 rounded-xl border border-violet-300/30 bg-violet-500/5">
      <DateDisplay date={date} />

      <div className="space-y-3">
        <CalculationSteps steps={detailedSteps} />
        <ResultDisplay number={result.number} isMasterNumber={result.isMasterNumber} />

        {interpretationToShow && (
          <S3Interpretation s3Data={interpretationToShow} number={result.number} />
        )}

        {isLoading && <LoadingState />}

      </div>
    </div>
  );
};
