import { Request, Response, NextFunction } from "express";
import { getFileFromS3 } from "../services/s3Service";

export const getFileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fileName = req.params.fileName;
    const fileData = await getFileFromS3(fileName);

    if (!fileData) {
      res.status(404).json({ error: 'Файл не найден' });
      return;
    }

    res.send(fileData.Body);
  } catch (error) {
    console.error('Ошибка:', error);
    next(error);
  }
};

