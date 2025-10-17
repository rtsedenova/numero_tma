import React, { useEffect, useRef, useState } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// TarotCategorySelect — компактный кликабельный дропдаун-селект категорий Таро
// Tech: React + TypeScript + TailwindCSS
// Особенности:
//  - Мягкая, дружелюбная палитра (slate/indigo), меньше «чёрного».
//  - Раскрытие по клику, закрытие по клику вне и по Esc.
//  - Высокий z-index, чтобы перекрывать колесо/сцену.
//  - В кнопке — эмоджи + заголовок. Подзаголовок в кнопке убран.
// ──────────────────────────────────────────────────────────────────────────────

export type TarotCategoryId = "love" | "finance" | "health" | "future" | "yesno";

export interface TarotCategory {
  id: TarotCategoryId;
  title: string;
  subtitle?: string;
  emoji: string;
}

export const TAROT_CATEGORIES: TarotCategory[] = [
  { id: "love",    title: "Любовь",   subtitle: "чувства, отношения", emoji: "❤️" },
  { id: "finance", title: "Финансы",  subtitle: "деньги, работа",     emoji: "💰" },
  { id: "health",  title: "Здоровье", subtitle: "баланс, энергия",    emoji: "🌿" },
  { id: "future",  title: "Будущее",  subtitle: "тенденции, путь",    emoji: "🔮" },
  { id: "yesno",   title: "Да / Нет", subtitle: "краткий ответ",      emoji: "⚖️" },
];

export interface TarotCategorySelectProps {
  className?: string;
  category?: TarotCategoryId | null;
  onChange?: (id: TarotCategoryId) => void;
  onSelect?: (id: TarotCategoryId) => void;
}

const baseTrigger =
  "flex items-center gap-2.5 justify-between rounded-xl border border-slate-300/20 " +
  "bg-gradient-to-br from-slate-800/20 via-slate-800/40 to-slate-900/60 px-4 py-2.5 " +
  "shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm hover:border-slate-300/30 " +
  "transition-colors";

const basePanel =
  "absolute left-0 right-0 top-full mt-1 rounded-xl border border-slate-300/20 " +
  "bg-slate-900/90 backdrop-blur-md shadow-2xl shadow-indigo-500/10 overflow-hidden origin-top";

const itemStyles =
  "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer select-none transition " +
  "hover:bg-indigo-500/10 focus:bg-indigo-500/10 outline-none";

const ChevronIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    className={`size-4 shrink-0 text-slate-400 ${
      open ? "rotate-180 text-slate-100" : "group-hover:text-slate-100"
    } transition-transform`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const TarotCategorySelect: React.FC<TarotCategorySelectProps> = ({ className, category, onChange, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TarotCategoryId | null>(category || null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Sync internal state with external prop
  React.useEffect(() => {
    if (category !== undefined) {
      setSelected(category);
    }
  }, [category]);

  // Закрытие по клику вне
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (id: TarotCategoryId) => {
    setSelected(id);
    setOpen(false);
    onChange?.(id);
    onSelect?.(id);
  };

  const selectedMeta = TAROT_CATEGORIES.find((c) => c.id === selected);

  return (
    <div
      ref={rootRef}
      className={["w-full max-w-sm", className].filter(Boolean).join(" ")}
      style={{ zIndex: 9999 }} // перекрывает сцену/колесо
    >
      <div className="relative group z-[9999]">

        <button
          type="button"
          className={baseTrigger}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="tarot-category-listbox"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex items-center gap-2.5 text-left">
            <span className="text-lg leading-none">
              {selectedMeta?.emoji ?? "🔮"}
            </span>
            <div className="leading-tight">
              <div className="text-slate-100 text-sm font-medium">
                {selectedMeta?.title ?? "Выбери категорию"}
              </div>
              {/* подзаголовок в кнопке убран по твоему желанию */}
            </div>
          </div>
          <ChevronIcon open={open} />
        </button>

        <div
          id="tarot-category-listbox"
          role="listbox"
          aria-label="Список категорий таро"
          className={
            basePanel +
            ` z-[9999] ${
              open
                ? "pointer-events-auto opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-95"
            } transition duration-150`
          }
        >
          {TAROT_CATEGORIES.map((c) => {
            const active = c.id === selected;
            return (
              <div
                key={c.id}
                role="option"
                aria-selected={active}
                tabIndex={0}
                className={itemStyles + (active ? " bg-indigo-500/10" : "")}
                onClick={() => handleSelect(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(c.id);
                  }
                }}
              >
                <div className="text-xl leading-none">{c.emoji}</div>
                <div className="flex-1">
                  <div className="text-slate-100 text-sm font-medium tracking-wide">
                    {c.title}
                  </div>
                  {c.subtitle && (
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.subtitle}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TarotCategorySelect;
