import { Router } from 'express';
import { createUserController } from '../controllers/db/createUser.controller';
import { getAllUsersController } from '../controllers/db/getAllUsers.controller';

const router = Router();

router.get('/getusers', async (req, res) => {
  try {
    await getAllUsersController(req, res);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/create-user', async (req, res) => {
  try {
    await createUserController(req, res);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;
