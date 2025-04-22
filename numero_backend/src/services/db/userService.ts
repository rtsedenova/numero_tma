import { db } from '../../config/dbConfig';

export const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

export const addUser = async (
  telegram_id: number,
  coins: number,
  username: string
) => {
  const client = await db.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (telegram_id, coins, username) VALUES ($1, $2, $3) RETURNING id, created_at',
      [telegram_id, coins, username]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding user to DB', error);
    throw error;
  } finally {
    client.release();
  }
};
