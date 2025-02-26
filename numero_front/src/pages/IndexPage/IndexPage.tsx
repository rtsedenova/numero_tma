import { FC, useState } from "react";

export const IndexPage: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Выберите файл для загрузки!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке файла");
      }

      const result = await response.json();
      alert(`Файл загружен: ${result.data.Location}`);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Ошибка при загрузке файла!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
      <input type="file" onChange={handleFileChange} />
      <button 
        onClick={handleUpload} 
        disabled={isUploading || !file}
        style={{ 
          padding: "5px 10px", 
          borderRadius: "4px", 
          backgroundColor: isUploading ? "#ccc" : "#007AFF", 
          color: "#fff", 
          border: "none", 
          cursor: isUploading ? "not-allowed" : "pointer"
        }}
      >
        {isUploading ? "Загрузка..." : "Загрузить файл"}
      </button>
    </div>
  );
};
