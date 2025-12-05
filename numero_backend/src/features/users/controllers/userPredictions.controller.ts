import { Request, Response, NextFunction } from 'express';
import {
  updateUserPredictions,
  setNumerologyFreePredictionsLeft,
  setTarotFreePredictionsLeft,
  setCredits,
} from '../services/userPredictions.service';

export const updatePredictionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      telegramId,
      predictionsLeft,
      numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft,
      credits,
    } = req.body;

    console.log('[UserPredictions] Update request received', {
      telegramId,
      predictionsLeft,
      numerologyFreePredictionsLeft,
      tarotFreePredictionsLeft,
      credits,
    });

    if (!telegramId) {
      console.log('[UserPredictions] Invalid data: missing telegramId');
      res
        .status(400)
        .json({ message: 'Incorrect data: telegramId is required' });
      return;
    }

    const hasLegacyField = predictionsLeft !== undefined;
    const hasNewFields =
      numerologyFreePredictionsLeft !== undefined ||
      tarotFreePredictionsLeft !== undefined ||
      credits !== undefined;

    if (!hasLegacyField && !hasNewFields) {
      console.log('[UserPredictions] Invalid data: no fields to update', {
        telegramId,
      });
      res.status(400).json({
        message: 'Incorrect data: at least one field must be provided',
      });
      return;
    }

    if (hasLegacyField) {
      if (
        typeof predictionsLeft !== 'number' ||
        isNaN(predictionsLeft) ||
        predictionsLeft < 0
      ) {
        console.log('[UserPredictions] Invalid predictions count', {
          predictionsLeft,
          type: typeof predictionsLeft,
        });
        res.status(400).json({ message: 'Incorrect predictions count' });
        return;
      }
    }

    if (numerologyFreePredictionsLeft !== undefined) {
      if (
        typeof numerologyFreePredictionsLeft !== 'number' ||
        isNaN(numerologyFreePredictionsLeft) ||
        numerologyFreePredictionsLeft < 0
      ) {
        res.status(400).json({
          message: 'Incorrect numerologyFreePredictionsLeft value',
        });
        return;
      }
    }

    if (tarotFreePredictionsLeft !== undefined) {
      if (
        typeof tarotFreePredictionsLeft !== 'number' ||
        isNaN(tarotFreePredictionsLeft) ||
        tarotFreePredictionsLeft < 0
      ) {
        res
          .status(400)
          .json({ message: 'Incorrect tarotFreePredictionsLeft value' });
        return;
      }
    }

    if (credits !== undefined) {
      if (typeof credits !== 'number' || isNaN(credits) || credits < 0) {
        res.status(400).json({ message: 'Incorrect credits value' });
        return;
      }
    }

    if (hasLegacyField) {
      const result = await updateUserPredictions(telegramId, predictionsLeft);

      if (result.rowCount === 0) {
        console.log('[UserPredictions] User not found (legacy update)', {
          telegramId,
        });
        res.status(404).json({ message: 'User not found' });
        return;
      }

      console.log('[UserPredictions] Update successful (legacy)', {
        telegramId,
        predictionsLeft,
      });

      res
        .status(200)
        .json({ message: 'Successfully updated', user: result.rows[0] });
      return;
    }

    let lastResult;

    if (numerologyFreePredictionsLeft !== undefined) {
      lastResult = await setNumerologyFreePredictionsLeft(
        telegramId,
        numerologyFreePredictionsLeft,
      );

      if (lastResult.rowCount === 0) {
        console.log(
          '[UserPredictions] User not found (numerologyFreePredictionsLeft)',
          { telegramId },
        );
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    if (tarotFreePredictionsLeft !== undefined) {
      lastResult = await setTarotFreePredictionsLeft(
        telegramId,
        tarotFreePredictionsLeft,
      );

      if (lastResult.rowCount === 0) {
        console.log(
          '[UserPredictions] User not found (tarotFreePredictionsLeft)',
          { telegramId },
        );
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    if (credits !== undefined) {
      lastResult = await setCredits(telegramId, credits);

      if (lastResult.rowCount === 0) {
        console.log('[UserPredictions] User not found (credits)', {
          telegramId,
        });
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    if (lastResult && lastResult.rows.length > 0) {
      console.log('[UserPredictions] Update successful', {
        telegramId,
        numerologyFreePredictionsLeft,
        tarotFreePredictionsLeft,
        credits,
      });

      res
        .status(200)
        .json({ message: 'Successfully updated', user: lastResult.rows[0] });
      return;
    }

    console.error('[UserPredictions] Update failed with no result', {
      telegramId,
    });
    res.status(500).json({ message: 'Update failed' });
  } catch (error) {
    console.error('[UserPredictions] Error updating predictions', { error });
    next(error);
  }
};
