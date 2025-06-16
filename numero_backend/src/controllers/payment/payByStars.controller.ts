import { Request, Response } from "express";
import { TelegramStarsService } from "../../services/payment/payByStars.service";

export class StarsController {
  static async createInvoiceLink(req: Request, res: Response): Promise<void> {
    try {
      const { payload, currency, prices } = req.body;

      if (!payload || !currency || !prices || !prices[0]?.amount) {
        res.status(400).json({
          success: false,
          error: "Missing required parameters.",
        });
        return;
      }

      const invoiceLink = await TelegramStarsService.createInvoiceLink({
        payload,
        currency,
        prices,
      });

      res.json({ success: true, invoiceLink });
    } catch (error: any) {
      console.error("💥 Error in createInvoiceLink:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }
}
