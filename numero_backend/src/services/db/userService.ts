import { db } from '../../config/dbConfig';

export const getAllUsers = async () => {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
};

export const addUser = async (telegram_id: number, coins: number) => {
    const client = await db.connect(); 
    try {
        const result = await client.query(
        'INSERT INTO users (telegram_id, coins) VALUES ($1, $2) RETURNING id, created_at',
        [telegram_id, coins]
    );
        return result.rows[0]; 
    } catch (error) {
        console.error('Error adding user to DB', error);
        throw error;
    } finally {
        client.release(); 
    }
};