import http from 'http';
import dotenv from 'dotenv';
import { buildApp } from './app/server';
import { TelegramStarsService } from './services/payment/payByStars.service';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

const mask = (s?: string) => (s ? `${s.slice(0, 8)}…${s.slice(-4)}` : 'undefined');

const app = buildApp();

const corsForTMA = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin ?? '';
  const allowed = /^(https:\/\/(numero-tma\.com|www\.numero-tma\.com|web\.telegram\.org|t\.me))$/i.test(origin);
  if (allowed) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,Origin,X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204); 
    return;              
  }
  next();
};

app.use(corsForTMA);

app.get('/api/health', (_req, res) => {
  console.log('HEALTH', new Date().toISOString());
  res.json({ ok: true, t: Date.now() });
});

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ENABLE_TELEGRAM = process.env.ENABLE_TELEGRAM === 'true';

console.log('[ENV] NODE_ENV =', NODE_ENV);
console.log('[ENV] PORT =', PORT);
console.log('[ENV] HOST =', HOST);
console.log('[ENV] ENABLE_TELEGRAM =', ENABLE_TELEGRAM);
console.log('[ENV] BOT_TOKEN fingerprint =', mask(process.env.BOT_TOKEN));

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

http.createServer(app).listen(PORT, HOST, () => {
  console.log(`HTTP сервер запущен на http://${HOST}:${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('UnhandledRejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UncaughtException:', err);
});
