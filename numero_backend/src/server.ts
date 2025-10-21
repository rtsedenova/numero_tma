import { buildApp } from './app/server';
import http from 'http';
import dotenv from 'dotenv';
import { TelegramStarsService } from './services/payment/payByStars.service';

dotenv.config();

const mask = (s?: string) =>
  s ? `${s.slice(0, 8)}…${s.slice(-4)}` : 'undefined';

const app = buildApp();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT ?? 3000);
const ENABLE_TELEGRAM = process.env.ENABLE_TELEGRAM === 'true';

console.log('[ENV] NODE_ENV=', NODE_ENV);
console.log('[ENV] PORT=', PORT);
console.log('[ENV] ENABLE_TELEGRAM=', ENABLE_TELEGRAM);
console.log('[ENV] BOT_TOKEN fingerprint=', mask(process.env.BOT_TOKEN));

TelegramStarsService.attachHandlers();

(async () => {
  try {
    if (ENABLE_TELEGRAM) {
      await TelegramStarsService.launchBotOnce();
      console.log('Telegram bot запущен и слушает события!');
    } else {
      console.log('Telegram bot отключён (ENABLE_TELEGRAM!=true)');
    }
  } catch (err) {
    console.error('Ошибка запуска Telegram бота:', err);
  }
})();

http.createServer(app).listen(PORT, () => {
  console.log(`HTTP сервер запущен на http://localhost:${PORT}`);
});