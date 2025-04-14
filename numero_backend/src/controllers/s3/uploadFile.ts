import { Request, Response } from "express";
import { uploadToS3 } from "../../services/s3/s3Service";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log("Файл получен:", req.file); 

    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    const result = await uploadToS3(req.file.originalname, req.file.buffer);
    res.json({ message: "Файл загружен в S3", data: result });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
