import { z } from 'zod';

const Env = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().optional(),
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

const parsed = Env.safeParse(import.meta.env);
if (!parsed.success) {
  console.error(parsed.error.format());
  throw new Error('Invalid env. Define VITE_API_BASE_URL in .env.*');
}

const env = parsed.data;

export const config = {
  api: {
    baseUrl: env.VITE_API_BASE_URL.replace(/\/+$/, ''),
    timeout: env.VITE_API_TIMEOUT ?? 30000,
  },
  dev: { mode: env.MODE, isDev: env.DEV, isProd: env.PROD },
  external: {
    telegramGif: 'https://xelene.me/telegram.gif',
    googleFonts: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
  },
} as const;
