import { Request, Response } from 'express';
import { db } from '../../config/dbConfig';
import { getInterpretationForNumber } from './numerology.service';
import {
  consumePrediction,
  NoPredictionsLeftError,
} from '../users/services/updateUserCounters.service';

interface CalculateRequestBody {
  telegramId: number;
  numerologyResult: {
    date: string;
    number: number;
    isMasterNumber: boolean;
    formula: string;
    steps: string[];
  };
}

const CREDITS_PER_PREDICTION = 100;

export async function calculate(req: Request, res: Response): Promise<void> {
  try {
    const { telegramId, numerologyResult } = req.body as CalculateRequestBody;

    if (!telegramId || !numerologyResult) {
      console.warn('[Numerology] Missing telegramId or result');
      res.status(400).json({
        success: false,
        message:
          'Missing required parameters: telegramId and numerologyResult are required',
      });
      return;
    }

    if (!numerologyResult.number || !numerologyResult.date) {
      console.warn('[Numerology] Missing number or date');
      res.status(400).json({
        success: false,
        message:
          'Missing required fields in numerologyResult: number and date are required',
      });
      return;
    }

    const telegramIdString = String(telegramId);

    const userQuery = `
      SELECT numerology_free_predictions_left, credits
      FROM users
      WHERE telegram_id = $1;
    `;
    const userResult = await db.query(userQuery, [telegramIdString]);

    if (userResult.rows.length === 0) {
      console.warn('[Numerology] User not found', { telegramId });
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const freePredictionsLeft =
      userResult.rows[0].numerology_free_predictions_left;
    const credits = userResult.rows[0].credits;

    if (freePredictionsLeft === 0 && credits < CREDITS_PER_PREDICTION) {
      console.warn('[Numerology] No free predictions and low credits', {
        telegramId,
      });
      res.status(403).json({
        success: false,
        message:
          'Free predictions are over. You need at least 100 credits to make a prediction. Please buy credits to continue.',
        code: 'NO_FREE_PREDICTIONS_LEFT',
        requiredCredits: CREDITS_PER_PREDICTION,
      });
      return;
    }

    const interpretation = await getInterpretationForNumber(
      numerologyResult.number,
    );

    if (!interpretation) {
      console.warn('[Numerology] No interpretation', {
        number: numerologyResult.number,
      });
      res.status(404).json({
        success: false,
        message: `No interpretation found for number ${numerologyResult.number}`,
      });
      return;
    }

    let predictionCounts;

    try {
      const checkQuery = `
        SELECT numerology_free_predictions_left
        FROM users
        WHERE telegram_id = $1;
      `;
      const checkResult = await db.query(checkQuery, [telegramIdString]);
      const hasFreePredictions =
        checkResult.rows[0]?.numerology_free_predictions_left > 0;

      if (hasFreePredictions) {
        predictionCounts = await consumePrediction(
          telegramIdString,
          'numerology',
        );
      } else {
        const updateQuery = `
          UPDATE users
          SET credits = credits - $1
          WHERE telegram_id = $2
            AND credits >= $1
          RETURNING 
            numerology_free_predictions_left,
            tarot_free_predictions_left,
            credits;
        `;
        const updateResult = await db.query(updateQuery, [
          CREDITS_PER_PREDICTION,
          telegramIdString,
        ]);

        if (updateResult.rowCount === 0) {
          console.warn('[Numerology] Insufficient credits (race)', {
            telegramId,
          });
          res.status(403).json({
            success: false,
            message:
              'Insufficient credits. You need at least 100 credits to make a prediction.',
            code: 'INSUFFICIENT_CREDITS',
          });
          return;
        }

        predictionCounts = {
          numerologyFreePredictionsLeft:
            updateResult.rows[0].numerology_free_predictions_left,
          tarotFreePredictionsLeft:
            updateResult.rows[0].tarot_free_predictions_left,
          credits: updateResult.rows[0].credits,
        };
      }
    } catch (error) {
      if (error instanceof NoPredictionsLeftError) {
        console.warn('[Numerology] No predictions left (race)', {
          telegramId,
        });
        res.status(403).json({
          success: false,
          message: 'No predictions available',
          code: 'NO_PREDICTIONS_LEFT',
        });
        return;
      }

      throw error;
    }

    const response = {
      success: true,
      message: 'Numerology calculation completed successfully',
      interpretation,
      numerologyFreePredictionsLeft:
        predictionCounts.numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft: predictionCounts.tarotFreePredictionsLeft,
      credits: predictionCounts.credits,
    };

    console.log('[Numerology] Success', {
      telegramId,
      numerologyFreePredictionsLeft: response.numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft: response.tarotFreePredictionsLeft,
      credits: response.credits,
    });

    res.json(response);
  } catch (error: unknown) {
    console.error('[Numerology] Error', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}
