import { Router } from 'express';
import { createUserController, getAllUsersController } from '../controllers/db/userController';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    await getAllUsersController(req, res);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/users', async (req, res) => {
  try {
    await createUserController(req, res);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;
