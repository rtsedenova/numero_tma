import { getFileFromS3 } from '../s3/services/s3Service';

/** Категории для yes/no интерпретаций */
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

// Вероятность реверса по умолчанию
const DEFAULT_REVERSAL_CHANCE = 0.1;
// Имя JSON в S3
const TAROT_FILE_NAME = 'tarot_cards.json';
// TTL кэша (по умолчанию 5 минут)
const CACHE_TTL_MS = Number(process.env.TAROT_CACHE_TTL_MS || 5 * 60 * 1000);

// Время и математика
const now = () => Date.now();
const isFresh = (ts: number) => now() - ts < CACHE_TTL_MS;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* -------------------- In-memory кэш -------------------- */
let cache: { data: TarotDataJson | null; at: number } = { data: null, at: 0 };

  //  Читает JSON из S3, валидирует и кэширует.
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

/* -------------------- Доступ к карточкам -------------------- */
export async function getAllCards(): Promise<TarotCard[]> {
  const data = await loadTarotData(false);
  return data.cards;
}

export async function getCardById(id: string): Promise<TarotCard | undefined> {
  const cards = await getAllCards();
  return cards.find((c) => c.id === id);
}

/* -------------------- API вытягивания карты --------------------
   Рандомный выбор, ориентация, тексты по категории.
---------------------------------------------------------------- */
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

// Эффективные настройки реверса (meta + options)
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

// Генерация ориентации карты
function pickReversed(enabled: boolean, chance: number) {
  return enabled ? Math.random() < clamp01(chance) : false;
}

// Случайный индекс [0, max)
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

  // Короткий лог для трассировки
  console.log('[tarot] draw', { id: card.id, orient: orientation, category: opts.category ?? 'none' });

  const side = reversed ? card.meanings.reversed : card.meanings.upright;

  // Текст по категории (игнорируем "yesno")
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
