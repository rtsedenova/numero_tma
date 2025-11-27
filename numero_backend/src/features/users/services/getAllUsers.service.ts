import { db } from '../../../config/dbConfig';
import { UserFromDB } from '../types';

export async function getAllUsers(): Promise<UserFromDB[]> {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error: unable to get users:', error);
    throw new Error('Unable to get users');
  }
}

