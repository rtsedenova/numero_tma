import { useEffect } from "react";
import type { NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
import type { DestinyNumberData } from "@/types/destiny";
import { getDetailedCalculationSteps } from "@/helpers/getDetailedCalculationSteps";
import { useNumerologyS3Data } from "@/hooks/useNumerologyS3Data";
import { DateDisplay } from "./DateDisplay";
import { CalculationSteps } from "./CalculationSteps";
import { ResultDisplay } from "./ResultDisplay";
import { S3Interpretation } from "./S3Interpretation";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

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

  const {
    data: fallbackInterpretation,
    isLoading: isFallbackLoading,
    error: s3Error,
    fetchData,
  } = useNumerologyS3Data();

  useEffect(() => {
    if (!interpretation && !isLoadingInterpretation && result.number) {
      fetchData(result.number);
    }
  }, [interpretation, isLoadingInterpretation, result.number, fetchData]);

  const interpretationToShow = interpretation || fallbackInterpretation;
  const isLoading = isLoadingInterpretation || isFallbackLoading;

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

        {s3Error && <ErrorState error={s3Error} />}
      </div>
    </div>
  );
};
