import { db } from "../../config/dbConfig"; 
import { QueryResult } from "pg";

export const updateUserPredictions = async (telegramId: string, predictionsLeft: number): Promise<QueryResult> => {
  console.log(`Обновляем пользователя с telegram_id: ${telegramId}, predictions_left: ${predictionsLeft}`);

  const query = `
    UPDATE users
    SET predictions_left = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [predictionsLeft, telegramId]);

  console.log('Результат обновления:', result.rows);

  return result;
};
