import { db } from '../../../config/dbConfig';
import { NewUser, UserFromDB } from '../types';

export async function createUser(user: NewUser): Promise<UserFromDB> {
  const {
    telegram_id,
    username,
    first_name,
    last_name,
    language_code,
    is_premium,
  } = user;

  const insertQuery = `
    INSERT INTO users (
      telegram_id, username, first_name, last_name, language_code, is_premium
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (telegram_id) DO NOTHING
    RETURNING *;
  `;

  const values = [
    telegram_id,
    username ?? null,
    first_name ?? null,
    last_name ?? null,
    language_code ?? null,
    is_premium,
  ];

  try {
    const insertResult = await db.query(insertQuery, values);

    if (insertResult.rows.length > 0) {
      return insertResult.rows[0];
    }

    const selectQuery = `
      SELECT * FROM users WHERE telegram_id = $1;
    `;
    const selectResult = await db.query(selectQuery, [telegram_id]);

    return selectResult.rows[0];
  } catch (error) {
    console.error('Error: unable to create or get user:', error);
    throw new Error('Unable to create or get user');
  }
}

