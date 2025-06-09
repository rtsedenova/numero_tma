import { FC, useState, useEffect } from "react";
import { Page } from "@/components/Page";
import { DateInput } from "@/components/DateInput/DateInput";
import { CheckButton } from "@/components/CheckButton/CheckButton";
import { calculateDestinyNumber } from "@/helpers/calculateDestinyNumber";
import { usePredictionAttempts } from "@/storage/usePredictionAttempts";
import { updatePredictionsOnServer } from "@/api/updatePredictions";
import { useTelegramUser } from "@/hooks/useTelegramUser"; 
import { api, API_ENDPOINTS } from "@/config/api";
import "@/styles/pages/destiny-number-page.scss";

interface DestinyNumberData {
  title: string;
  description: string;
  strong_points: string[];
  weak_points: string[];
  recommendations: string[];
  famous_people: {
    name: string;
    birth_date: string;
    image_url: string;
    description: string;
  }[];
}

type NumDataResponse = Record<string, DestinyNumberData>;

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

      const { data } = await api.get<NumDataResponse>(API_ENDPOINTS.s3.numData);
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

        {calculationSteps.length > 0 && (
          <div className="calculation-steps">
            <h2>Шаги расчета:</h2>
            <ul>
              {calculationSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {result && result.title && (
          <div className="result-content">
            <h1>{result.title}</h1>
            <p>{result.description}</p>

            <div className="strong-weak-points">
              <h2>Сильные стороны:</h2>
              <ul>
                {result.strong_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <h2>Слабые стороны:</h2>
              <ul>
                {result.weak_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="recommendations">
              <h2>Рекомендации:</h2>
              <ul>
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>

            <div className="famous-people">
              <h2>Известные личности:</h2>
              <ul>
                {result.famous_people.map((person, index) => (
                  <li key={index}>
                    <img
                      src={`/prediction_mini_app/${person.image_url}`}
                      alt={person.name}
                    />
                    <div>
                      <h3>{person.name}</h3>
                      <p>{person.birth_date}</p>
                      <p>{person.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};
