import { Request, Response, NextFunction } from "express";
import { updateUserPredictions } from "../../services/db/userPredictions.service";

export const updatePredictionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { telegramId, predictionsLeft } = req.body;
    console.log('Received update request:', { telegramId, predictionsLeft, body: req.body });

    if (!telegramId || predictionsLeft === undefined) {
      console.log('Invalid data:', { telegramId, predictionsLeft });
      res.status(400).json({ message: "Incorrect data" });
      return;
    }

    // Ensure predictionsLeft is a valid number
    if (typeof predictionsLeft !== 'number' || isNaN(predictionsLeft) || predictionsLeft < 0) {
      console.log('Invalid predictions count:', { predictionsLeft, type: typeof predictionsLeft });
      res.status(400).json({ message: "Incorrect predictions count" });
      return;
    }

    const result = await updateUserPredictions(telegramId, predictionsLeft);

    if (result.rowCount === 0) {
      console.log('User not found:', { telegramId });
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log('Update successful:', { telegramId, predictionsLeft, result: result.rows[0] });
    res.status(200).json({ message: "Successfully updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error: unable to update predictions:", error);
    next(error);
  }
};
