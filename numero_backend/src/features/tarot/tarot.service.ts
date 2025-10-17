// numero_backend/src/features/tarot/tarot.service.ts
import { getFileFromS3 } from '../../services/s3/s3Service';

type YesNoCategory = "love" | "finance" | "health" | "future";
type Suit = "wands" | "cups" | "swords" | "pentacles" | "major";

export interface TarotSideMeaning {
  general: string;
  by_category: Partial<Record<YesNoCategory, string>>;
  yesno_score: number; // -3..+3
}

export interface TarotCard {
  id: string;                    // major-00-fool | minor-wands-01-ace ...
  arcana: "major" | "minor";
  number: number;
  name: string;
  image?: string;                // если абсолютный URL
  image_key?: string;            // если ключ в public/CDN
  meanings: {
    upright: TarotSideMeaning;
    reversed: TarotSideMeaning;
  };
}

export interface TarotDataJson {
  version?: string;
  deck?: { id?: string; title?: string };
  categories?: string[];
  meta?: {
    reversals?: { enabled_default?: boolean; chance_default?: number };
  };
  cards: TarotCard[];
}

const DEFAULT_REVERSAL_CHANCE = 0.5;
const TAROT_FILE_NAME = 'tarot_cards.json';

// ---- Простой in-memory кэш ----
let cache: { data: TarotDataJson | null; at: number } = { data: null, at: 0 };
const CACHE_TTL_MS = Number(process.env.TAROT_CACHE_TTL_MS || 5 * 60 * 1000); // 5 минут

function now() { return Date.now(); }
function isFresh(ts: number) { return now() - ts < CACHE_TTL_MS; }

export async function loadTarotData(force = false): Promise<TarotDataJson> {
  if (!force && cache.data && isFresh(cache.at)) {
    console.log('[tarot.service] Using cached data');
    return cache.data;
  }
  
  console.log('[tarot.service] Loading tarot data from S3:', TAROT_FILE_NAME);
  
  try {
    // Получаем файл из S3 используя существующий сервис
    const fileData = await getFileFromS3(TAROT_FILE_NAME);
    
    if (!fileData || !fileData.Body) {
      throw new Error('Tarot file not found in S3');
    }
    
    // Преобразуем Buffer в строку и парсим JSON
    const jsonString = fileData.Body.toString('utf-8');
    const data = JSON.parse(jsonString) as TarotDataJson;
    
    if (!data || !Array.isArray(data.cards)) {
      throw new Error("Tarot JSON: invalid structure (no cards)");
    }
    
    console.log('[tarot.service] Successfully loaded', data.cards.length, 'cards');
    cache = { data, at: now() };
    return data;
  } catch (error) {
    console.error('[tarot.service] Error loading tarot data:', error);
    throw error;
  }
}

export async function getAllCards(): Promise<TarotCard[]> {
  const data = await loadTarotData(false);
  return data.cards;
}

export async function getCardById(id: string): Promise<TarotCard | undefined> {
  const cards = await getAllCards();
  return cards.find((c) => c.id === id);
}

export interface DrawOptions {
  reversalsEnabled?: boolean;
  reversalChance?: number; // 0..1
  category?: YesNoCategory | "yesno";
}

export interface DrawResult {
  card: TarotCard;
  orientation: "upright" | "reversed";
  text: { general: string; by_category?: string };
  yesno_score: number;
}

function pickReversed(enabled: boolean, chance: number) {
  if (!enabled) return false;
  const p = Math.max(0, Math.min(1, isNaN(chance) ? DEFAULT_REVERSAL_CHANCE : chance));
  return Math.random() < p;
}

export async function drawRandomCard(opts: DrawOptions = {}): Promise<DrawResult> {
  const data = await loadTarotData(false);
  const cards = data.cards;
  if (!cards.length) throw new Error("Tarot: empty deck");

  const i = Math.floor(Math.random() * cards.length);
  const card = cards[i];

  console.log('[tarot.service] Selected card:', {
    id: card.id,
    name: card.name,
    arcana: card.arcana
  });

  const metaChance = data.meta?.reversals?.chance_default ?? DEFAULT_REVERSAL_CHANCE;
  const reversalsDefault = data.meta?.reversals?.enabled_default ?? true;

  const reversed = pickReversed(
    opts.reversalsEnabled ?? reversalsDefault,
    opts.reversalChance ?? metaChance
  );

  console.log('[tarot.service] Orientation:', reversed ? 'reversed' : 'upright');
  console.log('[tarot.service] Requested category:', opts.category || 'none');

  const side = reversed ? card.meanings.reversed : card.meanings.upright;
  
  console.log('[tarot.service] Card side meanings structure:', {
    hasGeneral: !!side.general,
    hasByCategory: !!side.by_category,
    byCategoryKeys: side.by_category ? Object.keys(side.by_category) : [],
  });
  
  // Извлекаем текст для выбранной категории
  let cat: string | undefined = undefined;
  
  if (opts.category && opts.category !== "yesno" && side.by_category) {
    cat = side.by_category[opts.category];
    console.log('[tarot.service] Extracting category text for:', opts.category);
    console.log('[tarot.service] Found text:', cat);
  } else {
    console.log('[tarot.service] No category text extraction because:');
    console.log('  - category:', opts.category);
    console.log('  - is yesno:', opts.category === "yesno");
    console.log('  - has by_category object:', !!side.by_category);
  }

  console.log('[tarot.service] Final extracted text:', {
    general: side.general.substring(0, 50) + '...',
    by_category: cat ? cat.substring(0, 50) + '...' : 'NONE',
    yesno_score: side.yesno_score
  });

  return {
    card,
    orientation: reversed ? "reversed" : "upright",
    text: { general: side.general, by_category: cat },
    yesno_score: side.yesno_score,
  };
}
