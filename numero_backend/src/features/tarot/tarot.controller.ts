import type { RequestHandler } from 'express';
import { getAllCards, getCardById, drawRandomCard, loadTarotData } from './tarot.service';

/** Допустимые категории запроса */
const ALLOWED_CATEGORIES = ['love', 'finance', 'health', 'future', 'yesno'] as const;
type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

// -- Утилита: безопасный разбор опций вытягивания карты
function parseDrawBody(body: any): {
  reversalsEnabled?: boolean;
  reversalChance?: number;
  category?: AllowedCategory;
} {
  if (!body || typeof body !== 'object') return {};

  const out: {
    reversalsEnabled?: boolean;
    reversalChance?: number;
    category?: AllowedCategory;
  } = {};

  if (typeof body.reversalsEnabled === 'boolean') out.reversalsEnabled = body.reversalsEnabled;

  if (body.reversalChance !== undefined) {
    const n = Number(body.reversalChance);
    if (!Number.isNaN(n) && n >= 0 && n <= 1) out.reversalChance = n;
  }

  if (typeof body.category === 'string') {
    const cat = body.category.trim().toLowerCase();
    if (ALLOWED_CATEGORIES.includes(cat as AllowedCategory)) {
      out.category = cat as AllowedCategory;
    }
  }

  return out;
}

export const TarotController = {
  // Список всех карт
  list: (async (_req, res) => {
    try {
      const cards = await getAllCards();
      res.json({ ok: true, count: cards.length, cards });
    } catch (e) {
      console.error('[tarot.ctrl] list error');
      res.status(500).json({ ok: false, error: 'Failed to load cards' });
    }
  }) as RequestHandler,

  // Получение карты по id
  getById: (async (req, res) => {
    try {
      const id = String(req.params.id || '');
      if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });

      const card = await getCardById(id);
      if (!card) return res.status(404).json({ ok: false, error: 'Card not found' });

      res.json({ ok: true, card });
    } catch (e) {
      console.error('[tarot.ctrl] getById error');
      res.status(500).json({ ok: false, error: 'Failed to get card' });
    }
  }) as RequestHandler,

  // Вытягивание случайной карты
  draw: (async (req, res) => {
    const opts = parseDrawBody(req.body);
    console.log('[tarot.ctrl] draw', opts);

    try {
      const result = await drawRandomCard(opts);
      res.json({ ok: true, result });
    } catch (e) {
      console.error('[tarot.ctrl] draw error');
      res.status(500).json({
        ok: false,
        error: 'Draw failed',
      });
    }
  }) as RequestHandler,

  // Принудительное обновление кэша
  refreshCache: (async (_req, res) => {
    try {
      await loadTarotData(true);
      console.log('[tarot.ctrl] cache refresh');
      res.json({ ok: true, refreshed: true });
    } catch (e) {
      console.error('[tarot.ctrl] refresh error');
      res.status(500).json({ ok: false, error: 'Cache refresh failed' });
    }
  }) as RequestHandler,
};
