import { Router } from "express";
import { TarotController } from "./tarot.controller";

const router = Router();

router.get("/cards", TarotController.list);
router.get("/cards/:id", TarotController.getById);
router.post("/draw", TarotController.draw);
router.post("/refresh-cache", TarotController.refreshCache);

export default router;
