import { Request, Response } from 'express';
import { createUser, getAllUsers } from '../../services/db/userService';
import { UserFromDB, NewUser } from '../../types/user';

export async function createUserController(req: Request, res: Response) {
  try {
    const userData: NewUser = req.body;

    if (!userData || !userData.telegram_id || !userData.init_data_raw) {
      return res.status(400).json({ error: 'Missing required user fields' });
    }

    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error in createUserController:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function getAllUsersController(_req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsersController:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}
