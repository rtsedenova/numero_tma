import { Request, Response } from 'express';
import { getAllUsers } from '../../services/db/userService';
import { addUser } from '../../services/db/userService';

export const getUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
    const { telegram_id, coins } = req.body;
  
    try {
      const user = await addUser(telegram_id, coins);
      res.status(201).json({ message: 'User added successfully', user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to add user', error: error.message });
      } else {
        res.status(500).json({ message: 'Failed to add user', error: 'Unknown error' });
      }
    }
  };
