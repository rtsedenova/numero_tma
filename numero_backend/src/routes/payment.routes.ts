import { Router } from "express"; 
import { StarsController } from "../controllers/payment/payByStars.controller";

const router = Router(); 

router.post("/create-invoice", StarsController.createInvoiceLink);

export default router;
