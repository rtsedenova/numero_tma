import { FC, useState, useEffect } from "react";
import { Page } from "@/components/Page";

import { DatePicker } from "@/components/numerology/date-picker/DatePicker";
import { CheckButton } from "@/components/numerology/CheckButton";
import { NumerologyResult } from "@/components/numerology/numerology-result";
import { calculateNumerologyNumber, type NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
import { useSendNumerologyResult } from "@/hooks/useSendNumerologyResult";

export const NewNumerologyPage: FC = () => {
  const [displayedDate, setDisplayedDate] = useState<string | null>(null);
  const [numerologyResult, setNumerologyResult] = useState<NumerologyResultData | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  const { sendResult, isLoading: isSending, status: isSuccess } = useSendNumerologyResult();

  useEffect(() => {
    if (displayedDate && numerologyResult && !isSending && !isSuccess) {
      console.log('Auto-sending numerology result to backend:', {
        date: displayedDate,
        result: numerologyResult
      });
      sendResult(displayedDate, numerologyResult);
    }
  }, [displayedDate, numerologyResult, sendResult, isSending, isSuccess]);

  const handleDateCheck = (date: string | null) => {
    if (date) {
      setDisplayedDate(date);
      setShowValidationError(false);
      const result = calculateNumerologyNumber(date);
      setNumerologyResult(result);
    } else {
      setShowValidationError(true);
      setNumerologyResult(null);
    }
  };

  return (
    <Page>
      <div className="page numerology-page">
        <div className="mb-4">
          <DatePicker />  
        </div>
        <div className="flex justify-center mb-4">
          <CheckButton 
            onDateCheck={handleDateCheck}
            showValidationError={showValidationError}
            loading={isSending}
          />
        </div>
        
        {displayedDate && numerologyResult && (
          <NumerologyResult 
            date={displayedDate}
            result={numerologyResult}
          />
        )}

      </div>
    </Page>
  );
};
