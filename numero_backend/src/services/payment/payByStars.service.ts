import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN as string;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not defined");
}

const bot = new Telegraf<Context<Update>>(TELEGRAM_BOT_TOKEN);

export class TelegramStarsService {
  private static paidUsers: Map<number, string> = new Map();

  static attachHandlers() {
    bot.on("pre_checkout_query", async (ctx) => {
      console.log("pre_checkout_query received:", ctx.update.pre_checkout_query);
      try {
        await ctx.answerPreCheckoutQuery(true);
      } catch (err) {
        console.error("Failed to answer pre-checkout query:", err);
      }
    });
    bot.on("message", (ctx) => {
      const msg = ctx.message as any;

      if (msg.successful_payment) {
        const userId = msg.from.id;
        const chargeId = msg.successful_payment.telegram_payment_charge_id;
        this.paidUsers.set(userId, chargeId);
      }
    });
  }

  static hasPaid(userId: number): boolean {
    return this.paidUsers.has(userId);
  }

  static async createInvoiceLink({
    payload,
    currency,
    prices,
  }: {
    payload: string;
    currency: string;
    prices: { amount: number }[];
  }): Promise<string> {
    if (!payload || !currency || !prices || !prices[0]?.amount) {
      throw new Error("Missing required parameters");
    }

    const amount = prices[0].amount;

    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Invalid price amount");
    }

    const label = `Restoring for ${amount} ${currency}`;
    const title = `Item for ${amount}`;
    const description = `Buying an item for ${amount} stars.`;

    try {
      const invoiceLink = await bot.telegram.createInvoiceLink({
        title,
        description,
        payload,
        provider_token: "",
        currency,
        prices: [{ label, amount }],
      });

      return invoiceLink;
    } catch (error: any) {
      console.error("Error creating invoice link:", error);
      throw new Error(error.message || "Failed to create invoice link");
    }
  }

  static async refund(userId: number): Promise<boolean> {
    const chargeId = this.paidUsers.get(userId);
    if (!chargeId) throw new Error("User has not paid");

    try {
      const response = await (bot.telegram as any).callApi("refundStarPayment", {
        user_id: userId,
        telegram_payment_charge_id: chargeId,
      });

      if (response) {
        this.paidUsers.delete(userId);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Refund failed:", error);
      throw new Error("Refund failed. Please try again later.");
    }
  }

  static getBotInstance() {
    return bot;
  }
}
