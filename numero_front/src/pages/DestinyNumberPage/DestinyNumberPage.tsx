import { FC, useState, useEffect } from "react";
import { Page } from "@/components/Page";
import { DateInput } from "@/components/DateInput/DateInput";
import { CheckButton } from "@/components/CheckButton/CheckButton";
import { calculateDestinyNumber } from "@/helpers/calculateDestinyNumber";
import { usePredictionAttempts } from "@/storage/usePredictionAttempts";
import { updatePredictionsOnServer } from "@/api/updatePredictions";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { api, API_ENDPOINTS } from "@/config/api";
import { CalculationSteps } from "@/components/CalculationSteps/CalculationSteps";
import { DestinyResult } from "@/components/DestinyResult/DestinyResult";
import { type DestinyNumberData, type DestinyNumberResponse } from "@/types/destiny";
import "@/styles/pages/destiny-number-page.scss";

export const DestinyNumberPage: FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<DestinyNumberData | null>(null);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { freePredictionsLeft, decrement, fetchPredictions, isLoading: isPredictionsLoading } = usePredictionAttempts();
  const { user } = useTelegramUser();
  const telegramId = user?.id;

  useEffect(() => {
    if (telegramId) {
      fetchPredictions(telegramId);
    }
  }, [telegramId, fetchPredictions]);

  const handleCheckClick = async () => {
    if (!birthDate) {
      alert("Please insert your birth date");
      return;
    }

    if (isPredictionsLoading) {
      alert("Please, wait while we load the data...");
      return;
    }

    if (freePredictionsLeft === null) {
      alert("Please, wait while we load the data...");
      return;
    }

    if (freePredictionsLeft <= 0) {
      alert("Free predictions are over! We offer to pay through Telegram Stars");
      return;
    }

    if (!telegramId) {
      alert("Error: unable to determine Telegram ID of the user");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCalculationSteps([]);

    try {
      const { destinyNumber, steps } = calculateDestinyNumber(birthDate);
      setCalculationSteps(steps);

      const { data } = await api.get<DestinyNumberResponse>(API_ENDPOINTS.s3.numData);
      const numberData = data[destinyNumber] || data[parseInt(destinyNumber.toString().slice(0, 1))];

      // First update the server
      const newPredictionsLeft = Math.max(0, freePredictionsLeft - 1);
      await updatePredictionsOnServer(`${telegramId}`, newPredictionsLeft);
      
      // Only after successful server update, update local state
      decrement();
      setResult(numberData || null);

    } catch (error) {
      console.error('Error in handleCheckClick:', error);
      setResult(null);
      alert("Error: unable to update predictions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="destiny-number-page">
        <DateInput value={birthDate} onChange={setBirthDate} />
        <CheckButton
          onClick={handleCheckClick}
          disabled={!birthDate || isLoading}
          isLoading={isLoading}
        />

        <CalculationSteps steps={calculationSteps} />
        {result && <DestinyResult result={result} />}
      </div>
    </Page>
  );
};
