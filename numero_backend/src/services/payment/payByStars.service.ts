import type { Telegraf } from 'telegraf';
import { getBot } from '../../config/telegramConfig';

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

    console.log('[BOT] attachHandlers() attaching listeners…');

    bot.on('pre_checkout_query', async (ctx) => {
      console.log('pre_checkout_query received:', ctx.update.pre_checkout_query);
      try {
        await ctx.answerPreCheckoutQuery(true);
      } catch (err) {
        console.error('Failed to answer pre-checkout query:', err);
      }
    });

    bot.on('message', (ctx) => {
      const msg = ctx.message as any;
      if (msg?.successful_payment) {
        const userId = msg.from.id;
        const chargeId = msg.successful_payment.telegram_payment_charge_id;
        this.paidUsers.set(userId, chargeId);
        console.log(`[BOT] marked user ${userId} as paid; charge=${chargeId}`);
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
      const invoiceLink = await getBot().telegram.createInvoiceLink({
        title,
        description,
        payload,
        provider_token: '',
        currency,
        prices: [{ label, amount }],
      });
      return invoiceLink;
    } catch (error: any) {
      console.error('Error creating invoice link:', error);
      throw new Error(error?.message || 'Failed to create invoice link');
    }
  }

  static async refund(userId: number): Promise<boolean> {
    const chargeId = this.paidUsers.get(userId);
    if (!chargeId) throw new Error('User has not paid');

    try {
      const response = await (getBot().telegram as any).callApi(
        'refundStarPayment',
        { user_id: userId, telegram_payment_charge_id: chargeId },
      );
      if (response) {
        this.paidUsers.delete(userId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refund failed:', error);
      throw new Error('Refund failed. Please try again later.');
    }
  }

  static getBotInstance(): Telegraf {
    return getBot();
  }

  // ——— запуск поллинга строго один раз, с логом стека ———
  static async launchBotOnce() {
    this.launchCount += 1;
    console.log(`[BOT] launch() requested, count=${this.launchCount}`);

    if (this.launched) {
      console.error(
        '[BOT] SECOND launch prevented. Call stack:\n',
        new Error().stack,
      );
      return;
    }

    this.launched = true;
    console.log('[BOT] FIRST launch. Call stack:\n', new Error().stack);
    await getBot().launch();
    console.log('[BOT] launch() resolved');
  }
}