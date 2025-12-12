import { Router } from "express"; 
import { PaymentController } from "./payment.controller";

const router = Router(); 

router.post("/create-invoice", PaymentController.createInvoiceLink);

export default router;

