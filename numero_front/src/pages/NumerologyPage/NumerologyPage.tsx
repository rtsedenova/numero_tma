import { FC, useState, useEffect } from "react";
import { Page } from "@/components/Page";
import { CheckButton } from "@/components/CheckButton/CheckButton";
import BuyPredictionsButton from "@/components/BuyPredictionsButton/BuyPredictionsButton";
import { calculateDestinyNumber } from "@/helpers/calculateDestinyNumber";
import { usePredictionAttempts } from "@/storage/predictionAttempts";
import { updatePredictionsOnServer } from "@/api/updatePredictions";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { api, API_ENDPOINTS } from "@/config/api";
import { CalculationSteps } from "@/components/CalculationSteps/CalculationSteps";
import { DestinyResult } from "@/components/DestinyResult/DestinyResult";
import { type DestinyNumberData, type DestinyNumberResponse } from "@/types/destiny";
import DatePicker from "react-datepicker";

export const NumerologyPage: FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
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
      alert("Пожалуйста, выбери дату рождения");
      return;
    }

    if (isPredictionsLoading || freePredictionsLeft === null) {
      alert("Загружаем данные, подожди немного...");
      return;
    }

    if (freePredictionsLeft <= 0) {
      alert("Бесплатные предсказания закончились! Можно купить через Telegram Stars.");
      return;
    }

    if (!telegramId) {
      alert("Ошибка: не удалось определить Telegram ID");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCalculationSteps([]);

    try {
      const dateStr = birthDate.toISOString().split("T")[0];
      const { destinyNumber, steps } = calculateDestinyNumber(dateStr);
      setCalculationSteps(steps);

      const { data } = await api.get<DestinyNumberResponse>(API_ENDPOINTS.s3.numData);
      const numberData = data[destinyNumber] || data[parseInt(destinyNumber.toString().slice(0, 1))];

      await updatePredictionsOnServer(`${telegramId}`, Math.max(0, freePredictionsLeft - 1));
      decrement();
      setResult(numberData || null);
    } catch (error) {
      console.error("Error in handleCheckClick:", error);
      alert("Ошибка при получении данных. Попробуй снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="numerology-page">
        <div className="date-picker-container">
          <label htmlFor="birthdate">Дата рождения</label>
          <DatePicker
            selected={birthDate}
            onChange={(date: Date | null) => setBirthDate(date)}
            dateFormat="dd.MM.yyyy"
            placeholderText="Выбери дату"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="styled-datepicker"
            id="birthdate"
          />
        </div>

        <div className="buttons-container">
          <CheckButton
            onClick={handleCheckClick}
            disabled={!birthDate || isLoading}
            isLoading={isLoading}
          />
          <BuyPredictionsButton price={3} />
        </div>

        {calculationSteps.length > 0 && <CalculationSteps steps={calculationSteps} />}
        {result && <DestinyResult result={result} />}
      </div>
    </Page>
  );
};
