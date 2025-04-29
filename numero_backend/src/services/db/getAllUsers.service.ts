import { db } from '../../config/dbConfig';
import { UserFromDB } from '../../types/user';

export async function getAllUsers(): Promise<UserFromDB[]> {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    throw new Error('Не удалось получить пользователей');
  }
}
