import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DatePicker } from '@/components/numerology/date-picker/DatePicker';
import { CheckButton } from '@/components/numerology/CheckButton';
import { NumerologyResult } from '@/components/numerology/numerology-result';
import { calculateNumerologyNumber } from '@/helpers/calculateNumerologyNumber';
import { useSendNumerologyResult } from '@/hooks/useSendNumerologyResult';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

const CREDITS_PER_PREDICTION = 100;

export function NewNumerologyPage(): JSX.Element {
  const [displayedDate, setDisplayedDate] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  const navigate = useNavigate();

  const { sendResult, isLoading: isSending, interpretation } =
    useSendNumerologyResult();
  const {
    numerologyFreePredictionsLeft,
    credits,
    isLoading: isPredictionsLoading,
  } = usePredictionAttempts();

  const handleDateCheck = (date: string | null) => {
    if (!date) {
      setShowValidationError(true);
      setDisplayedDate(null);
      return;
    }

    if (
      isPredictionsLoading ||
      numerologyFreePredictionsLeft === null ||
      credits === null
    ) {
      return;
    }

    if (numerologyFreePredictionsLeft === 0) {
      if (credits < CREDITS_PER_PREDICTION) {
        setShowValidationError(false);
        setDisplayedDate(null);
        return;
      }
    }

    setShowValidationError(false);
    setDisplayedDate(date);

    const result = calculateNumerologyNumber(date);
    void sendResult(date, result);
  };

  const hasNoFreePredictions =
    !isPredictionsLoading &&
    numerologyFreePredictionsLeft !== null &&
    credits !== null &&
    numerologyFreePredictionsLeft === 0 &&
    credits < CREDITS_PER_PREDICTION;

  return (
    <Page>
      <div className="numerology-page page">
        <div className="flex items-center justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="mb-4">
          <DatePicker />
        </div>

        {hasNoFreePredictions && (
          <div className="mb-4 rounded-xl border border-orange-300/30 bg-orange-500/10 p-4 text-center">
            <span className="mb-3 block text-orange-200">
              Бесплатные предсказания закончились. Для получения предсказания
              необходимо минимум 100 кредитов. Пожалуйста, купите кредиты для
              продолжения.
            </span>
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="mt-3 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-2 font-medium text-white transition hover:brightness-110 active:brightness-95"
            >
              Купить кредиты
            </button>
          </div>
        )}

        <div className="mb-4 md:mb-8 flex justify-center">
          <CheckButton
            onDateCheck={handleDateCheck}
            showValidationError={showValidationError}
            loading={isSending || isPredictionsLoading}
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
}
