import { getFileFromS3 } from '../s3/services/s3Service';

type YesNoCategory = 'love' | 'finance' | 'health' | 'future';
type Suit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';

export interface TarotSideMeaning {
  general: string;
  by_category: Partial<Record<YesNoCategory, string>>;
  yesno_score: number; // -3..+3
}

export interface TarotCard {
  id: string;            
  arcana: 'major' | 'minor';
  number: number;
  name: string;
  image?: string;         
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

const DEFAULT_REVERSAL_CHANCE = 0.1;
const TAROT_FILE_NAME = 'tarot_cards.json';
const CACHE_TTL_MS = Number(process.env.TAROT_CACHE_TTL_MS || 5 * 60 * 1000);

const now = () => Date.now();
const isFresh = (ts: number) => now() - ts < CACHE_TTL_MS;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

let cache: { data: TarotDataJson | null; at: number } = { data: null, at: 0 };

export async function loadTarotData(force = false): Promise<TarotDataJson> {
  if (!force && cache.data && isFresh(cache.at)) {
    console.log('[tarot] cache hit');
    return cache.data;
  }

  console.log('[tarot] fetching from S3');
  const fileData = await getFileFromS3(TAROT_FILE_NAME).catch((e) => {
    console.error('[tarot] s3 error');
    throw e;
  });

  if (!fileData?.Body) {
    console.error('[tarot] file missing');
    throw new Error('Tarot file not found in S3');
  }

  let data: TarotDataJson;
  try {
    data = JSON.parse(fileData.Body.toString('utf-8')) as TarotDataJson;
  } catch {
    console.error('[tarot] json parse error');
    throw new Error('Tarot JSON parse error');
  }

  if (!Array.isArray(data.cards)) {
    console.error('[tarot] invalid structure');
    throw new Error('Tarot JSON: invalid structure (no cards)');
  }

  console.log('[tarot] loaded cards=', data.cards.length);
  cache = { data, at: now() };
  return data;
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
  category?: YesNoCategory | 'yesno';
}

export interface DrawResult {
  card: TarotCard;
  orientation: 'upright' | 'reversed';
  text: { general: string; by_category?: string };
  yesno_score: number;
}

function getReversalSettings(
  data: TarotDataJson,
  opts: DrawOptions
): { enabled: boolean; chance: number } {
  const metaChance = data.meta?.reversals?.chance_default ?? DEFAULT_REVERSAL_CHANCE;
  const metaEnabled = data.meta?.reversals?.enabled_default ?? true;
  const enabled = opts.reversalsEnabled ?? metaEnabled;
  const chance = clamp01(
    isNaN(Number(opts.reversalChance)) ? metaChance : Number(opts.reversalChance)
  );
  return { enabled, chance };
}

function pickReversed(enabled: boolean, chance: number) {
  return enabled ? Math.random() < clamp01(chance) : false;
}

function randIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export async function drawRandomCard(opts: DrawOptions = {}): Promise<DrawResult> {
  const data = await loadTarotData(false);
  const { cards } = data;
  if (!cards.length) throw new Error('Tarot: empty deck');

  const card = cards[randIndex(cards.length)];
  const { enabled, chance } = getReversalSettings(data, opts);
  const reversed = pickReversed(enabled, chance);
  const orientation: 'upright' | 'reversed' = reversed ? 'reversed' : 'upright';

  console.log('[tarot] draw', { id: card.id, orient: orientation, category: opts.category ?? 'none' });

  const side = reversed ? card.meanings.reversed : card.meanings.upright;

  const byCategory =
    opts.category && opts.category !== 'yesno' && side.by_category
      ? side.by_category[opts.category as YesNoCategory]
      : undefined;

  return {
    card,
    orientation,
    text: { general: side.general, by_category: byCategory },
    yesno_score: side.yesno_score,
  };
}
