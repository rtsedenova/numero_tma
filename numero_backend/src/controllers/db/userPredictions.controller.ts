import { Request, Response, NextFunction } from "express";
import { updateUserPredictions } from "../../services/db/userPredictions.service";

export const updatePredictionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { telegramId, predictionsLeft } = req.body;

    if (!telegramId || predictionsLeft === undefined) {
      res.status(400).json({ message: "Некорректные данные" });
      return;
    }

    const result = await updateUserPredictions(telegramId, predictionsLeft);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.status(200).json({ message: "Успешно обновлено", user: result.rows[0] });
  } catch (error) {
    console.error("Ошибка обновления предсказаний:", error);
    next(error);
  }
};
