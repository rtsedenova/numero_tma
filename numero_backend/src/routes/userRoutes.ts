import { Router } from 'express';
import { getUsersHandler, createUser } from '../controllers/db/users';

const router = Router();

router.get('/users', getUsersHandler);
router.post('/users', createUser); 

export default router;
