import { db } from '../../config/dbConfig';
import { NewUser, UserFromDB } from '../../types/user';

export async function createUser(user: NewUser): Promise<UserFromDB> {
  const {
    telegram_id,
    username,
    first_name,
    last_name,
    language_code,
    is_premium,
  } = user;

  const query = `
    INSERT INTO users (
      telegram_id, username, first_name, last_name, language_code, is_premium
    )
    VALUES ($1, $2, $3, $4, $5, $6)
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
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting user:', error);
    throw new Error('Failed to insert user');
  }
}

export async function getAllUsers(): Promise<UserFromDB[]> {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
