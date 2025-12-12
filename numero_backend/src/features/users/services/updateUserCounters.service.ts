import { QueryResult } from 'pg';
import { db } from '../../../config/dbConfig';
import { UserFromDB } from '../types';

export class NoPredictionsLeftError extends Error {
  code = 'NO_PREDICTIONS_LEFT';
  type: 'numerology' | 'tarot';

  constructor(type: 'numerology' | 'tarot') {
    super(`No predictions available for ${type}`);
    this.type = type;
    this.name = 'NoPredictionsLeftError';
  }
}

export const updateUserPredictions = async (
  telegramId: string,
  predictionsLeft: number,
): Promise<QueryResult> => {
  const query = `
    UPDATE users
    SET predictions_left = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [predictionsLeft, telegramId]);

  console.log('[UserPredictions] predictions_left updated', {
    telegramId,
    predictionsLeft,
  });

  return result;
};

export const setNumerologyFreePredictionsLeft = async (
  telegramId: string,
  value: number,
): Promise<QueryResult> => {
  const query = `
    UPDATE users
    SET numerology_free_predictions_left = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [value, telegramId]);

  console.log('[UserPredictions] numerology_free_predictions_left updated', {
    telegramId,
    value,
  });

  return result;
};

export const setTarotFreePredictionsLeft = async (
  telegramId: string,
  value: number,
): Promise<QueryResult> => {
  const query = `
    UPDATE users
    SET tarot_free_predictions_left = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [value, telegramId]);

  console.log('[UserPredictions] tarot_free_predictions_left updated', {
    telegramId,
    value,
  });

  return result;
};

export const setCredits = async (
  telegramId: string,
  value: number,
): Promise<QueryResult> => {
  const query = `
    UPDATE users
    SET credits = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [value, telegramId]);

  console.log('[UserPredictions] credits set', {
    telegramId,
    value,
  });

  return result;
};

export const addCredits = async (
  telegramId: string,
  delta: number,
): Promise<UserFromDB> => {
  if (delta <= 0) {
    throw new Error('Delta must be positive');
  }

  const query = `
    UPDATE users
    SET credits = credits + $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [delta, telegramId]);

  if (result.rowCount === 0) {
    throw new Error(`User not found: ${telegramId}`);
  }

  const updatedUser = result.rows[0] as UserFromDB;

  console.log('[UserPredictions] credits added', {
    telegramId,
    delta,
    credits: updatedUser.credits,
  });

  return updatedUser;
};

export const hasAvailablePrediction = async (
  telegramId: string,
  type: 'numerology' | 'tarot',
): Promise<boolean> => {
  const query = `
    SELECT 
      numerology_free_predictions_left,
      tarot_free_predictions_left,
      credits
    FROM users
    WHERE telegram_id = $1;
  `;

  const result = await db.query(query, [telegramId]);

  if (result.rows.length === 0) {
    console.log('[UserPredictions] user not found', { telegramId });
    return false;
  }

  const row = result.rows[0];

  if (type === 'numerology') {
    const hasAvailable =
      row.numerology_free_predictions_left > 0 || row.credits > 0;

    console.log('[UserPredictions] availability check', {
      telegramId,
      type,
      hasAvailable,
      free: row.numerology_free_predictions_left,
      credits: row.credits,
    });

    return hasAvailable;
  }

  const hasAvailable =
    row.tarot_free_predictions_left > 0 || row.credits > 0;

  console.log('[UserPredictions] availability check', {
    telegramId,
    type,
    hasAvailable,
    free: row.tarot_free_predictions_left,
    credits: row.credits,
  });

  return hasAvailable;
};

export const consumePrediction = async (
  telegramId: string,
  type: 'numerology' | 'tarot',
): Promise<{
  numerologyFreePredictionsLeft: number;
  tarotFreePredictionsLeft: number;
  credits: number;
}> => {
  console.log('[UserPredictions] consume prediction request', {
    telegramId,
    type,
  });

  let query: string;

  if (type === 'numerology') {
    query = `
      UPDATE users
      SET 
        numerology_free_predictions_left = CASE
          WHEN numerology_free_predictions_left > 0 
          THEN numerology_free_predictions_left - 1
          ELSE numerology_free_predictions_left
        END,
        credits = CASE
          WHEN numerology_free_predictions_left > 0 
          THEN credits
          WHEN credits > 0 
          THEN credits - 1
          ELSE credits
        END
      WHERE telegram_id = $1
        AND (numerology_free_predictions_left > 0 OR credits > 0)
      RETURNING 
        numerology_free_predictions_left,
        tarot_free_predictions_left,
        credits;
    `;
  } else {
    query = `
      UPDATE users
      SET 
        tarot_free_predictions_left = CASE
          WHEN tarot_free_predictions_left > 0 
          THEN tarot_free_predictions_left - 1
          ELSE tarot_free_predictions_left
        END,
        credits = CASE
          WHEN tarot_free_predictions_left > 0 
          THEN credits
          WHEN credits > 0 
          THEN credits - 1
          ELSE credits
        END
      WHERE telegram_id = $1
        AND (tarot_free_predictions_left > 0 OR credits > 0)
      RETURNING 
        numerology_free_predictions_left,
        tarot_free_predictions_left,
        credits;
    `;
  }

  const result = await db.query(query, [telegramId]);

  if (result.rowCount === 0) {
    const userCheck = await db.query(
      'SELECT telegram_id FROM users WHERE telegram_id = $1',
      [telegramId],
    );

    if (userCheck.rowCount === 0) {
      throw new Error(`User not found: ${telegramId}`);
    }

    throw new NoPredictionsLeftError(type);
  }

  const row = result.rows[0];

  const response = {
    numerologyFreePredictionsLeft: row.numerology_free_predictions_left,
    tarotFreePredictionsLeft: row.tarot_free_predictions_left,
    credits: row.credits,
  };

  console.log('[UserPredictions] prediction consumed', {
    telegramId,
    type,
    ...response,
  });

  return response;
};
