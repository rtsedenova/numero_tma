import type { RequestHandler } from 'express';
import { db } from '../../config/dbConfig';
import {
  consumePrediction,
  NoPredictionsLeftError,
} from '../users/services/updateUserCounters.service';
import {
  getAllCards,
  getCardById,
  drawRandomCard,
  loadTarotData,
} from './tarot.service';

const ALLOWED_CATEGORIES = ['love', 'finance', 'health', 'future', 'yesno'] as const;
type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

const CREDITS_PER_PREDICTION = 100;

function parseDrawBody(body: unknown): {
  reversalsEnabled?: boolean;
  reversalChance?: number;
  category?: AllowedCategory;
} {
  if (!body || typeof body !== 'object') {
    return {};
  }

  const input = body as Record<string, unknown>;

  const out: {
    reversalsEnabled?: boolean;
    reversalChance?: number;
    category?: AllowedCategory;
  } = {};

  if (typeof input.reversalsEnabled === 'boolean') {
    out.reversalsEnabled = input.reversalsEnabled;
  }

  if (input.reversalChance !== undefined) {
    const n = Number(input.reversalChance);

    if (!Number.isNaN(n) && n >= 0 && n <= 1) {
      out.reversalChance = n;
    }
  }

  if (typeof input.category === 'string') {
    const cat = input.category.trim().toLowerCase();

    if (ALLOWED_CATEGORIES.includes(cat as AllowedCategory)) {
      out.category = cat as AllowedCategory;
    }
  }

  return out;
}

export const TarotController = {
  list: (async (_req, res) => {
    try {
      const cards = await getAllCards();

      res.json({ ok: true, count: cards.length, cards });
    } catch (error) {
      console.error('[Tarot] list error', {
        error,
      });

      res.status(500).json({ ok: false, error: 'Failed to load cards' });
    }
  }) as RequestHandler,

  getById: (async (req, res) => {
    try {
      const id = String(req.params.id || '');

      if (!id) {
        res.status(400).json({ ok: false, error: 'Missing id' });
        return;
      }

      const card = await getCardById(id);

      if (!card) {
        res.status(404).json({ ok: false, error: 'Card not found' });
        return;
      }

      res.json({ ok: true, card });
    } catch (error) {
      console.error('[Tarot] getById error', {
        error,
      });

      res.status(500).json({ ok: false, error: 'Failed to get card' });
    }
  }) as RequestHandler,

  draw: (async (req, res) => {
    const opts = parseDrawBody(req.body);
    const telegramId = req.body?.telegramId;

    console.log('[Tarot] draw request', {
      opts,
      telegramId,
    });

    if (!telegramId) {
      res.status(400).json({
        ok: false,
        error: 'telegramId is required',
      });
      return;
    }

    const telegramIdString = String(telegramId);

    try {
      const checkQuery = `
        SELECT tarot_free_predictions_left, credits
        FROM users
        WHERE telegram_id = $1;
      `;
      const checkResult = await db.query(checkQuery, [telegramIdString]);

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          ok: false,
          error: 'User not found',
        });
        return;
      }

      const freePredictionsLeft = checkResult.rows[0].tarot_free_predictions_left;
      const credits = checkResult.rows[0].credits;

      if (freePredictionsLeft === 0) {
        if (credits < CREDITS_PER_PREDICTION) {
          console.log(
            '[Tarot] Free predictions exhausted and insufficient credits',
            {
              telegramId,
              credits,
            },
          );

          res.status(403).json({
            ok: false,
            error:
              'Free predictions are over. You need at least 100 credits to make a prediction. Please buy credits to continue.',
            code: 'NO_FREE_PREDICTIONS_LEFT',
            requiredCredits: CREDITS_PER_PREDICTION,
          });
          return;
        }

        console.log('[Tarot] Free predictions exhausted, using credits', {
          telegramId,
          credits,
        });
      }

      const result = await drawRandomCard(opts);

      let predictionCounts;

      try {
        if (freePredictionsLeft > 0) {
          predictionCounts = await consumePrediction(telegramIdString, 'tarot');
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
            console.log(
              '[Tarot] Insufficient credits during consumption (race condition)',
              {
                telegramId,
              },
            );

            res.status(403).json({
              ok: false,
              error:
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

          console.log('[Tarot] Consumed credits, updated counts', {
            telegramId,
            predictionCounts,
          });
        }
      } catch (error) {
        if (error instanceof NoPredictionsLeftError) {
          res.status(403).json({
            ok: false,
            error: 'No predictions available',
            code: 'NO_PREDICTIONS_LEFT',
          });
          return;
        }

        throw error;
      }

      res.json({
        ok: true,
        result,
        tarotFreePredictionsLeft: predictionCounts.tarotFreePredictionsLeft,
        numerologyFreePredictionsLeft:
          predictionCounts.numerologyFreePredictionsLeft,
        credits: predictionCounts.credits,
      });
    } catch (error) {
      console.error('[Tarot] draw error', {
        error,
        telegramId,
      });

      res.status(500).json({
        ok: false,
        error: 'Draw failed',
      });
    }
  }) as RequestHandler,

  refreshCache: (async (_req, res) => {
    try {
      await loadTarotData(true);

      console.log('[Tarot] cache refresh');

      res.json({ ok: true, refreshed: true });
    } catch (error) {
      console.error('[Tarot] refresh error', {
        error,
      });

      res.status(500).json({ ok: false, error: 'Cache refresh failed' });
    }
  }) as RequestHandler,
};
