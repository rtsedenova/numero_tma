import React, { useEffect } from "react";
import { NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
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
}

export const NumerologyResult: React.FC<NumerologyResultProps> = ({
  date,
  result
}) => {
  const detailedSteps = getDetailedCalculationSteps(result, date);
  const { data: s3Data, isLoading: isS3Loading, error: s3Error, fetchData } = useNumerologyS3Data();

  // Fetch S3 data when component mounts with a result
  useEffect(() => {
    if (result?.number) {
      fetchData(result.number);
    }
  }, [result?.number, fetchData]);

  return (
    <div className="mt-4 p-4 rounded-xl border border-violet-300/30  bg-violet-500/5">
      <DateDisplay date={date} />
      
      <div className="space-y-3">
        <CalculationSteps steps={detailedSteps} />
        <ResultDisplay number={result.number} isMasterNumber={result.isMasterNumber} />

        {/* S3 Data Block */}
        {s3Data && (
          <S3Interpretation s3Data={s3Data} number={result.number} />
        )}

        {/* S3 Loading State */}
        {isS3Loading && <LoadingState />}

        {/* S3 Error State */}
        {s3Error && <ErrorState error={s3Error} />}
      </div>
    </div>
  );
};
