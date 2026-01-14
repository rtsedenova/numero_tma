import React, { useEffect, useRef, useState } from "react";
import { CaretDown } from 'phosphor-react';
import type { TarotCategoryId, TarotCategoryInfo } from "@/types/tarot";

export const TAROT_CATEGORIES: TarotCategoryInfo[] = [
  { id: "love",    title: "Любовь",   subtitle: "чувства, отношения", emoji: "❤️" },
  { id: "finance", title: "Финансы",  subtitle: "деньги, работа",     emoji: "💸" },
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

const ChevronIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <CaretDown
    className={`size-4 shrink-0 text-[var(--text-subtle)] ${
      open ? "rotate-180 text-[var(--text)]" : "group-hover:text-[var(--text)]"
    } transition-all duration-300 ease-in-out`}
    weight="bold"
    aria-hidden
  />
);

const TarotCategorySelect: React.FC<TarotCategorySelectProps> = ({ className, category, onChange, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TarotCategoryId | null>(category || null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (category !== undefined) {
      setSelected(category);
    }
  }, [category]);

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
      style={{ zIndex: 9999 }} 
    >
      <div className="relative group z-[9999]">

        <button
          type="button"
          className="flex items-center gap-3 justify-between w-full min-w-[200px] rounded-xl border border-[var(--select-border)] px-4 py-3 backdrop-blur-sm transition-colors hover:border-[var(--select-border-hover)] shadow-[0_0_0_1px_rgba(192,146,244,0.1),0_4px_12px_rgba(0,0,0,0.08)]"
          style={{
            background: 'var(--select-bg)',
          }}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="tarot-category-listbox"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-lg leading-none">
              {selectedMeta?.emoji ?? "🔮"}
            </span>
            <div className="leading-tight">
              <div className="text-[var(--text)] text-sm font-medium">
                {selectedMeta?.title ?? "Выбери категорию"}
              </div>
            </div>
          </div>
          <ChevronIcon open={open} />
        </button>

        <div
          id="tarot-category-listbox"
          role="listbox"
          aria-label="Список категорий таро"
          className={`absolute left-0 right-0 top-full mt-2 rounded-xl border border-[var(--select-border)] backdrop-blur-md overflow-hidden origin-top z-[9999] shadow-2xl ${
            open
              ? "pointer-events-auto opacity-100 scale-100"
              : "pointer-events-none opacity-0 scale-95"
          } transition duration-150`}
          style={{
            background: 'var(--select-panel-bg)',
          }}
        >
          {TAROT_CATEGORIES.map((c) => {
            const active = c.id === selected;
            return (
              <div
                key={c.id}
                role="option"
                aria-selected={active}
                tabIndex={0}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer select-none transition outline-none"
                style={{
                  backgroundColor: active 
                    ? 'var(--select-active-bg)' 
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--select-hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onFocus={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--select-hover-bg)';
                  }
                }}
                onBlur={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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
                  <div className="text-[var(--text)] text-sm font-medium tracking-wide">
                    {c.title}
                  </div>
                  {c.subtitle && (
                    <div className="text-[var(--text-subtle)] text-[11px] mt-0.5">{c.subtitle}</div>
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
