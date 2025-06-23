import { db } from "../../config/dbConfig";
import { QueryResult } from "pg";

export const getUserPredictions = async (telegramId: string): Promise<QueryResult> => {
  const query = `
    SELECT predictions_left FROM users
    WHERE telegram_id = $1;
  `;

  return db.query(query, [telegramId]);
};
