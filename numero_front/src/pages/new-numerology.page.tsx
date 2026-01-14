import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'phosphor-react';

import { Page } from '@/components/Page';
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
        
        <div className="mb-4">
          <DatePicker />
        </div>

        {/* {true && ( */}
        {hasNoFreePredictions && (
          <div
            className="mb-4 rounded-xl p-4 text-center"
            style={{
              border: '1px solid var(--error-border)',
              background: 'var(--error-bg)',
            }}
          >
            <span
              className="mb-3 block"
              style={{ color: 'var(--error-text)' }}
            >
              Бесплатные предсказания закончились 🤧. Для получения предсказания
              необходимо минимум 100 алмазиков. Пожалуйста, купите алмазики для
              продолжения 💎.
            </span>
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="group mt-3 inline-flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition hover:brightness-110 active:brightness-95"
              style={{
                background: 'var(--gradient-bg)',
                color: 'var(--button-text)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--gradient-bg-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--gradient-bg)';
              }}
            >
              Купить кредиты
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                weight="regular"
              />
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
