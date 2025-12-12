import type { Telegraf } from 'telegraf';
import { getBot } from '../../config/telegramConfig';
import { addCredits } from '../users/services/updateUserCounters.service';

export const PACK_CREDITS = {
  SMALL: 1000,
  LARGE: 5000,
} as const;

export type PackCode = keyof typeof PACK_CREDITS;

export class TelegramStarsService {
  private static paidUsers: Map<number, string> = new Map();
  private static handlersAttached = false;
  private static launched = false;
  private static launchCount = 0;

  static attachHandlers() {
    if (this.handlersAttached) {
      console.log('[BOT] attachHandlers() skipped (already attached)');
      return;
    }

    const bot = getBot();
    this.handlersAttached = true;

    console.log('[BOT] attachHandlers() attaching listeners');

    bot.catch((err, ctx) => {
      console.error('[BOT] Error in bot handler', {
        error: err,
        update: ctx.update,
      });
    });

    bot.on('pre_checkout_query', async (ctx) => {
      const query = ctx.update.pre_checkout_query;

      console.log('[PAYMENT] pre_checkout_query received', {
        id: query.id,
        from: query.from.id,
        currency: query.currency,
        totalAmount: query.total_amount,
        invoicePayload: query.invoice_payload,
      });

      try {
        await ctx.answerPreCheckoutQuery(true);
        console.log('[PAYMENT] pre_checkout_query answered successfully');
      } catch (err: unknown) {
        console.error('[PAYMENT] Failed to answer pre-checkout query', {
          error: err,
        });

        try {
          await ctx.answerPreCheckoutQuery(
            false,
            'Payment processing error. Please try again.',
          );
        } catch (answerErr) {
          console.error('[PAYMENT] Failed to send error response', {
            error: answerErr,
          });
        }
      }
    });

    bot.on('message', async (ctx) => {
      const msg = ctx.message as any;

      if (!msg?.successful_payment) {
        return;
      }

      const userId = msg.from.id;
      const payment = msg.successful_payment;
      const chargeId = payment.telegram_payment_charge_id;
      const payload = payment.invoice_payload;
      const currency = payment.currency;
      const totalAmount = payment.total_amount;

      console.log('[PAYMENT] Payment successful received', {
        userId,
        chargeId,
        payload,
        currency,
        totalAmount,
      });

      this.paidUsers.set(userId, chargeId);

      try {
        if (!payload || typeof payload !== 'string') {
          console.error('[PAYMENT] Invalid payload', { payload });
          return;
        }

        const packMatch = payload.match(/^(SMALL|LARGE)_Pack_/);

        if (!packMatch) {
          console.error('[PAYMENT] Invalid payload format', { payload });
          return;
        }

        const packCode = packMatch[1] as PackCode;
        const creditsToAdd = PACK_CREDITS[packCode];

        if (!creditsToAdd) {
          console.error('[PAYMENT] Unknown pack code', { packCode });
          return;
        }

        console.log('[PAYMENT] Granting credits', {
          userId,
          packCode,
          creditsToAdd,
        });

        const telegramIdString = String(userId);
        const updatedUser = await addCredits(telegramIdString, creditsToAdd);

        console.log('[PAYMENT] Credits granted successfully', {
          userId,
          creditsAdded: creditsToAdd,
          newBalance: updatedUser.credits,
        });
      } catch (error: unknown) {
        const err =
          error instanceof Error ? { message: error.message, stack: error.stack } : error;

        console.error('[PAYMENT] Error processing payment', {
          userId,
          error: err,
        });
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
    if (!payload || !currency || !prices?.[0]?.amount) {
      throw new Error('Missing required parameters');
    }

    const amount = prices[0].amount;

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid price amount');
    }

    const label = `Restoring for ${amount} ${currency}`;
    const title = `Item for ${amount}`;
    const description = `Buying an item for ${amount} stars.`;

    try {
      console.log('[PAYMENT] Creating invoice', {
        title,
        description,
        payload,
        currency,
        amount,
      });

      const botInfo = await getBot().telegram.getMe();

      console.log('[PAYMENT] Bot is authorized', {
        username: botInfo.username,
      });

      const invoiceLink = await getBot().telegram.createInvoiceLink({
        title,
        description,
        payload,
        provider_token: '',
        currency,
        prices: [{ label, amount }],
      });

      console.log('[PAYMENT] Invoice created successfully');

      return invoiceLink;
    } catch (error: unknown) {
      const err =
        error instanceof Error
          ? {
              message: error.message,
              response: (error as any).response,
              description: (error as any).description,
            }
          : error;

      console.error('[PAYMENT] Error creating invoice link', { error: err });

      const message =
        error instanceof Error ? error.message : 'Failed to create invoice link';

      throw new Error(message);
    }
  }

  static async refund(userId: number): Promise<boolean> {
    const chargeId = this.paidUsers.get(userId);

    if (!chargeId) {
      throw new Error('User has not paid');
    }

    try {
      const response = await (getBot().telegram as any).callApi(
        'refundStarPayment',
        {
          user_id: userId,
          telegram_payment_charge_id: chargeId,
        },
      );

      if (response) {
        this.paidUsers.delete(userId);
        return true;
      }

      return false;
    } catch (error: unknown) {
      const err =
        error instanceof Error ? { message: error.message, stack: error.stack } : error;

      console.error('[PAYMENT] Refund failed', { userId, error: err });

      throw new Error('Refund failed. Please try again later.');
    }
  }

  static getBotInstance(): Telegraf {
    return getBot();
  }

  static async launchBotOnce() {
    this.launchCount += 1;

    console.log('[BOT] launch() requested', { count: this.launchCount });

    if (this.launched) {
      console.error('[BOT] SECOND launch prevented', {
        stack: new Error().stack,
      });
      return;
    }

    this.launched = true;

    console.log('[BOT] FIRST launch', { stack: new Error().stack });

    await getBot().launch();

    console.log('[BOT] launch() resolved');
  }
}
