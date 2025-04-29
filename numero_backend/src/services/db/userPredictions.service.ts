import { db } from "../../config/dbConfig"; 
import { QueryResult } from "pg";

export const updateUserPredictions = async (telegramId: string, predictionsLeft: number): Promise<QueryResult> => {
  const query = `
    UPDATE users
    SET predictions_left = $1
    WHERE telegram_id = $2
    RETURNING *;
  `;

  return db.query(query, [predictionsLeft, telegramId]);
};
