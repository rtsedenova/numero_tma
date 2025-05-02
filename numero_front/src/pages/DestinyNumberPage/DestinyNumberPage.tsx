import { FC, useState } from "react";
import { Page } from "@/components/Page";
import { DateInput } from "@/components/DateInput/DateInput";
import { CheckButton } from "@/components/CheckButton/CheckButton";
import { calculateDestinyNumber } from "@/helpers/calculateDestinyNumber";
import { usePredictionAttempts } from "@/storage/usePredictionAttempts";
import { updatePredictionsOnServer } from "@/api/updatePredictions";
import { useTelegramUser } from "@/hooks/useTelegramUser"; 
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

export const DestinyNumberPage: FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<DestinyNumberData | null>(null);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { freePredictionsLeft, decrement } = usePredictionAttempts();
  const { user } = useTelegramUser();
  const telegramId = user?.id;

  const handleCheckClick = async () => {
    if (!birthDate) {
      alert("Введите дату рождения");
      return;
    }

    if (freePredictionsLeft <= 0) {
      alert("Бесплатные предсказания закончились! Предлагаем оплатить через Telegram Stars 🚀");
      return;
    }

    if (!telegramId) {
      alert("Ошибка: не удалось определить Telegram ID пользователя");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCalculationSteps([]);

    try {
      const { destinyNumber, steps } = calculateDestinyNumber(birthDate);
      setCalculationSteps(steps);

      const response = await fetch("https://numero-tma-server.com/api/file/num_data.json");
      if (!response.ok) throw new Error("Ошибка загрузки данных");

      const data = await response.json();

      const numberData =
        data[destinyNumber] || data[parseInt(destinyNumber.toString().slice(0, 1))];

      setResult(numberData || null);

      decrement(); 
      console.log('Перед вызовом updateUserPredictions');
      await updatePredictionsOnServer(`${telegramId}`, freePredictionsLeft - 1);
      console.log('После вызова updateUserPredictions');

    } catch (error) {
      console.error(error);
      setResult(null);
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
