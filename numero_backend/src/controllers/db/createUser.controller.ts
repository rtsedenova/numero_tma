import { Request, Response } from 'express';
import { createUser } from '../../services/db/createUser.service';
import { NewUser } from '../../types/user';

export async function createUserController(req: Request, res: Response) {
  try {
    const userData: NewUser = req.body;

    if (!userData || !userData.telegram_id) {
      return res.status(400).json({ error: 'Не хватает нужных полей для создания пользователя' });
    }

    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Проблема в createUserController:', error);
    return res.status(500).json({ error: 'Не удалось создать пользователя' });
  }
}
