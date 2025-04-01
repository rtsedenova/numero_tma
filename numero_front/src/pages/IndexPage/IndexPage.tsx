import { FC, useState } from "react";

export const IndexPage: FC = () => {
  const [number, setNumber] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 9)) {
      setNumber(value);
    }
  };

  const handleOkClick = async () => {
    if (number === "") {
      alert("Введите число от 0 до 9!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://numero-tma-server.com/api/file/num_data.json`);
      if (!response.ok) {
        throw new Error("Ошибка при получении данных");
      }
      const data = await response.json();
      setResult(data[number] || "Нет данных для этого числа");
    } catch (error) {
      console.error("Ошибка получения данных:", error);
      setResult("Ошибка при получении данных");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <input
          type="number"
          min="0"
          max="9"
          value={number}
          onChange={handleNumberChange}
          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          placeholder="Введите число от 0 до 9"
        />
        <button
          onClick={handleOkClick}
          disabled={isLoading || number === ""}
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            backgroundColor: isLoading ? "#ccc" : "#28a745",
            color: "#fff",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Загрузка..." : "OK"}
        </button>
        <div style={{ 
          marginTop: "10px", 
          padding: "10px", 
          border: "1px solid #ccc", 
          borderRadius: "4px",
          minWidth: "200px",
          minHeight: "50px",
          textAlign: "center"
        }}>
          {result}
        </div>
      </div>
    </div>
  );
};


