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
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
      throw new Error('Не получилось добавить пользователя');
    }
  }