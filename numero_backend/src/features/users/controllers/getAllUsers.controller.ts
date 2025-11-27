import { Request, Response } from 'express';
import { getAllUsers } from '../services/getAllUsers.service';

export async function getAllUsersController(_req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error: unable to get users:', error);
    return res.status(500).json({ error: 'Unable to get users' });
  }
}

