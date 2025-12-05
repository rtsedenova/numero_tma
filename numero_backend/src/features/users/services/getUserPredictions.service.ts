import { QueryResult } from 'pg';
import { db } from '../../../config/dbConfig';

export const getUserPredictions = async (
  telegramId: string,
): Promise<QueryResult> => {
  const query = `
    SELECT 
      numerology_free_predictions_left,
      tarot_free_predictions_left,
      credits
    FROM users
    WHERE telegram_id = $1;
  `;

  const result = await db.query(query, [telegramId]);

  if (result.rows.length > 0) {
    const row = result.rows[0];
    let needsUpdate = false;
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (row.numerology_free_predictions_left == null) {
      updates.push(`numerology_free_predictions_left = $${paramIndex}`);
      values.push(8);
      paramIndex += 1;
      needsUpdate = true;

      console.log(
        '[UserPredictions] Defensive init: setting numerology_free_predictions_left to 8',
        { telegramId },
      );
    }

    if (row.tarot_free_predictions_left == null) {
      updates.push(`tarot_free_predictions_left = $${paramIndex}`);
      values.push(8);
      paramIndex += 1;
      needsUpdate = true;

      console.log(
        '[UserPredictions] Defensive init: setting tarot_free_predictions_left to 8',
        { telegramId },
      );
    }

    if (needsUpdate) {
      values.push(telegramId);

      const updateQuery = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE telegram_id = $${paramIndex}
        RETURNING 
          numerology_free_predictions_left,
          tarot_free_predictions_left,
          credits;
      `;

      const updateResult = await db.query(updateQuery, values);

      console.log(
        '[UserPredictions] Defensive initialization completed',
        { telegramId },
      );

      return updateResult;
    }
  }

  return result;
};
