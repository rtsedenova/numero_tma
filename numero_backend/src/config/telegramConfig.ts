import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined in environment variables');
}

export const bot = new Telegraf(process.env.BOT_TOKEN); 