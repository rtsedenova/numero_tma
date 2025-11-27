import { Request, Response } from 'express';
import { createUser } from '../services/createUser.service';
import { NewUser } from '../types';

export async function createUserController(req: Request, res: Response) {
  try {
    const userData: NewUser = req.body;

    if (!userData || !userData.telegram_id) {
      return res.status(400).json({ error: 'Not enough fields to create user' });
    }

    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error: unable to create user:', error);
    return res.status(500).json({ error: 'Unable to create user' });
  }
}

