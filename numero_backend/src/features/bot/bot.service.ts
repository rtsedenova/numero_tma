import { getBot } from '../../config/telegramConfig';

export class BotService {
  private static handlersAttached = false;
  private static commandsRegistered = false;

  static async registerCommands() {
    if (this.commandsRegistered) {
      console.log('[BOT] Commands already registered');
      return;
    }

    const bot = getBot();

    try {
      await bot.telegram.setMyCommands([
        {
          command: 'start',
          description: 'Открыть приложение',
        },
      ]);

      this.commandsRegistered = true;
      console.log('[BOT] Commands registered successfully');
    } catch (error: unknown) {
      const err =
        error instanceof Error ? { message: error.message, stack: error.stack } : error;

      console.error('[BOT] Failed to register commands', { error: err });
    }
  }

  static attachCommandHandlers() {
    if (this.handlersAttached) {
      console.log('[BOT] Command handlers already attached');
      return;
    }

    const bot = getBot();
    this.handlersAttached = true;

    console.log('[BOT] Attaching command handlers');

    bot.catch((err, ctx) => {
      console.error('[BOT] Error in command handler', {
        error: err,
        update: ctx.update,
      });
    });

    bot.command('start', async (ctx) => {
      const userId = ctx.from?.id;
      const miniAppUrl = process.env.MINI_APP_URL || 'https://numero-tma.com/prediction_mini_app';

      console.log('[BOT] /start command received', {
        userId,
        miniAppUrl,
      });

      try {
        await ctx.reply(
          '⭐ Привет! Нажми кнопку ниже, чтобы открыть приложение.',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✨ Открыть приложение',
                    web_app: {
                      url: miniAppUrl,
                    },
                  },
                ],
              ],
            },
          },
        );

        console.log('[BOT] /start command handled successfully', { userId });
      } catch (error: unknown) {
        const err =
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                response: (error as any).response,
                description: (error as any).description,
              }
            : error;

        console.error('[BOT] Error handling /start command', {
          userId,
          error: err,
          miniAppUrl,
        });

        try {
          await ctx.reply(
            '🤧 Произошла ошибка. Попробуй ещё раз позже.',
          );
        } catch (replyError) {
          console.error('[BOT] Failed to send error message', { error: replyError });
        }
      }
    });
  }
}
