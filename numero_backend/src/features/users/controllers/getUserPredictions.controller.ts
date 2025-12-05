import { Request, Response } from 'express';
import { getUserPredictions } from '../services/getUserPredictions.service';

export const getUserPredictionsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { telegramId } = req.params;

    if (!telegramId) {
      res.status(400).json({ error: 'Missing telegramId' });
      return;
    }

    const result = await getUserPredictions(telegramId);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const row = result.rows[0];

    res.status(200).json({
      predictionsLeft: row.numerology_free_predictions_left,
      predictions_left: row.numerology_free_predictions_left,
      numerologyFreePredictionsLeft: row.numerology_free_predictions_left,
      tarotFreePredictionsLeft: row.tarot_free_predictions_left,
      credits: row.credits,
    });
  } catch (error) {
    console.error('[UserPredictions] Error getting user predictions', {
      error,
    });

    res.status(500).json({ error: 'Internal server error' });
  }
};
