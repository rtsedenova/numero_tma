import express from "express";
import { updatePredictionsController } from "../controllers/db/userPredictions.controller"; 

const router = express.Router();

router.post("/update-predictions", updatePredictionsController);

export default router;
