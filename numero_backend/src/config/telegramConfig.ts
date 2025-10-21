import { Telegraf } from 'telegraf';

const mask = (s?: string) =>
  s ? `${s.slice(0, 8)}…${s.slice(-4)}` : 'undefined';

let bot: Telegraf | null = null;
let createCount = 0;

export function getBot(): Telegraf {
  if (!bot) {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      throw new Error('[BOT] BOT_TOKEN is not set');
    }
    createCount += 1;
    console.log(
      `[BOT] Creating Telegraf instance #${createCount}; BOT_TOKEN fingerprint=${mask(
        token,
      )}`,
    );
    bot = new Telegraf(token);
  }
  return bot;
}

export function getBotCreateCount() {
  return createCount;
}
