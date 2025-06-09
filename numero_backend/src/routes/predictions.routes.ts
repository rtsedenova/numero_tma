import { Router, RequestHandler } from 'express';
import { updatePredictionsController } from "../controllers/db/userPredictions.controller"; 
import { getUserPredictionsController } from "../controllers/db/getUserPredictions.controller";

const router = Router();

router.put("/update-predictions", updatePredictionsController);
router.get("/user/:telegramId", getUserPredictionsController as RequestHandler);

export default router;
