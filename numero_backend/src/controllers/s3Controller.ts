import { Request, Response } from "express";
import { uploadToS3, getFromS3 } from "../services/s3Service";

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

export const getFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const fileData = await getFromS3(fileName);
    res.send(fileData.Body);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'File not found' });
  }
};
