import { Router } from 'express';
import { calculate } from './numerology.controller';

const router = Router();

router.post('/calculate', calculate);

export default router;

