// tarot.controller.ts
import type { RequestHandler } from "express";
import { getAllCards, getCardById, drawRandomCard, loadTarotData } from "./tarot.service";

export const TarotController = {
  list: (async (_req, res) => {
    const cards = await getAllCards();
    res.json({ ok: true, count: cards.length, cards });
  }) as RequestHandler,

  getById: (async (req, res) => {
    const id = String(req.params.id);
    const card = await getCardById(id);
    if (!card) return res.status(404).json({ ok: false, error: "Card not found" });
    res.json({ ok: true, card });
  }) as RequestHandler,

  draw: (async (req, res) => {
    console.log('[tarot.controller] ==========================================');
    console.log('[tarot.controller] Draw request received');
    console.log('[tarot.controller] Body:', JSON.stringify(req.body, null, 2));
    
    try {
      const { reversalsEnabled, reversalChance, category } = req.body || {};
      
      console.log('[tarot.controller] Extracted category:', category, 'Type:', typeof category);
      
      const result = await drawRandomCard({ 
        reversalsEnabled, 
        reversalChance, 
        category: category as "love" | "finance" | "health" | "future" | "yesno" | undefined
      });
      
      console.log('[tarot.controller] Draw result:', JSON.stringify({
        cardId: result.card.id,
        cardName: result.card.name,
        orientation: result.orientation,
        hasGeneral: !!result.text.general,
        hasByCategory: !!result.text.by_category,
        byCategoryText: result.text.by_category
      }, null, 2));
      console.log('[tarot.controller] ==========================================');
      
      res.json({ ok: true, result });
    } catch (error) {
      console.error('[tarot.controller] Draw error:', error);
      res.status(500).json({ 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }) as RequestHandler,

  refreshCache: (async (_req, res) => {
    await loadTarotData(true);
    res.json({ ok: true, refreshed: true });
  }) as RequestHandler,
};
