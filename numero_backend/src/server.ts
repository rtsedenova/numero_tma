import { buildApp } from './app/server';
import fs from 'fs';
import https from 'https';
import http from 'http';
import dotenv from 'dotenv';
import { TelegramStarsService } from './services/payment/payByStars.service';

dotenv.config();

const app = buildApp();
const isProduction = process.env.NODE_ENV === 'production';
const HTTPS_PORT = 443;
const HTTP_PORT = 3000;

TelegramStarsService.attachHandlers();
TelegramStarsService.getBotInstance().launch().then(() => {
  console.log("Telegram bot запущен и слушает события!");
}).catch((err) => {
  console.error("Ошибка запуска Telegram бота:", err);
});

if (isProduction) {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/numero-tma-server.com/fullchain.pem'),
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS сервер запущен на https://numero-tma-server.com`);
  });
} else {
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP сервер запущен на http://localhost:${HTTP_PORT}`);
  });
}
