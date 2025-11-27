import { useState } from "react";
import { Page } from "@/components/Page";

import { DatePicker } from "@/components/numerology/date-picker/DatePicker";
import { CheckButton } from "@/components/numerology/CheckButton";
import { NumerologyResult } from "@/components/numerology/numerology-result";
import { calculateNumerologyNumber } from "@/helpers/calculateNumerologyNumber";
import { useSendNumerologyResult } from "@/hooks/useSendNumerologyResult";

export const NewNumerologyPage = () => {
  const [displayedDate, setDisplayedDate] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  const { sendResult, isLoading: isSending, interpretation } = useSendNumerologyResult();

  const handleDateCheck = (date: string | null) => {
    if (!date) {
      setShowValidationError(true);
      setDisplayedDate(null); // убираем дату, чтобы результат пропал
      return;
    }

    setShowValidationError(false);
    setDisplayedDate(date);

    const result = calculateNumerologyNumber(date);
    sendResult(date, result);
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

        {displayedDate && (
          <NumerologyResult
            date={displayedDate}
            result={calculateNumerologyNumber(displayedDate)}
            interpretation={interpretation}
            isLoadingInterpretation={isSending}
          />
        )}
      </div>
    </Page>
  );
};
