import { Router } from 'express';
import { NumerologyControllerImpl } from './numerology.controller';

export function createNumerologyRoutes(): Router {
  const router = Router();
  const numerologyController = new NumerologyControllerImpl();

  // Process numerology calculation result
  router.post('/calculate', (req, res, next) => 
    numerologyController.saveNumerologyResult(req, res, next)
  );

  return router;
}
