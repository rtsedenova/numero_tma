import http from 'http';
import dotenv from 'dotenv';
import { createServer } from './app/server';
import { TelegramStarsService } from './features/payment';

dotenv.config();

const mask = (value?: string) =>
  value ? `${value.slice(0, 8)}…${value.slice(-4)}` : 'undefined';

const app = createServer();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST || '0.0.0.0';

console.log('[ENV] NODE_ENV', NODE_ENV);
console.log('[ENV] PORT', PORT);
console.log('[ENV] HOST', HOST);
console.log('[ENV] BOT_TOKEN fingerprint', mask(process.env.BOT_TOKEN));

TelegramStarsService.attachHandlers();

(async () => {
  try {
    await TelegramStarsService.launchBotOnce();
    console.log('[BOT] launched and listening for updates');
  } catch (error) {
    console.error('[BOT] launch failed', { error });
    console.error(
      '[BOT] payments will not work without a running bot. Check BOT_TOKEN and bot permissions.',
    );
  }
})();

http.createServer(app).listen(PORT, HOST, () => {
  console.log('[HTTP] server listening', { host: HOST, port: PORT });
});

process.on('unhandledRejection', (reason) => {
  console.error('[App] unhandledRejection', { reason });
});

process.on('uncaughtException', (error) => {
  console.error('[App] uncaughtException', { error });
});
