import { FC, useState } from "react";
import { Page } from "@/components/Page";
import { DateInput } from "@/components/DateInput/DateInput";
import { CheckButton } from "@/components/CheckButton/CheckButton";
import { ResultBlock } from "@/components/ResultBlock/ResultBlock";
import { calculateDestinyNumber } from "@/helpers/calculateDestinyNumber";
import "@/styles/pages/destiny-number-page.scss";

export const DestinyNumberPage: FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckClick = async () => {
    if (!birthDate) {
      alert("Введите дату рождения");
      return;
    }

    setIsLoading(true);
    setResult("");
    setCalculationSteps([]);

    try {
      const { destinyNumber, steps } = calculateDestinyNumber(birthDate);
      setCalculationSteps(steps);

      const response = await fetch("https://numero-tma-server.com/api/file/num_data.json");
      if (!response.ok) throw new Error("Ошибка загрузки данных");

      const data = await response.json();
      setResult(data[destinyNumber] || "Нет данных для этого числа");
    } catch (error) {
      console.error(error);
      setResult("Произошла ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="destiny-number-page">
        <DateInput value={birthDate} onChange={setBirthDate} />
        <CheckButton onClick={handleCheckClick} disabled={!birthDate || isLoading} isLoading={isLoading} />
        <ResultBlock steps={calculationSteps} result={result} />
      </div>
    </Page>
  );
};
