import { Request, Response } from "express";
import { getUserPredictions } from "../../services/db/getUserPredictions.service";

export const getUserPredictionsController = async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.params;

    if (!telegramId) {
      return res.status(400).json({ error: "Missing telegramId" });
    }

    const result = await getUserPredictions(telegramId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ predictions_left: result.rows[0].predictions_left });
  } catch (error) {
    console.error("Error: unable to get user predictions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
