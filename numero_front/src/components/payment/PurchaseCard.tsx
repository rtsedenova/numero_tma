import { memo } from 'react';
import { CurrencyChip } from '@/components/CurrencyChip';

type PackCode = 'SMALL' | 'LARGE';

interface PurchaseCardProps {
  code: PackCode;
  title: string;
  predictions: string;
  diamonds: string;
  priceText: string;
  ctaText: string;
  loading: PackCode | null;
  onBuy: (code: PackCode) => void;
  disableAll: boolean;
}

export const PurchaseCard = memo(function PurchaseCard({
  code,
  title,
  predictions,
  diamonds,
  priceText,
  ctaText,
  loading,
  onBuy,
  disableAll,
}: PurchaseCardProps) {
  const isActive = loading === code;

  return (
    <div
      className="rounded-2xl p-5 text-center shadow-lg backdrop-blur-sm"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--navcard-bg)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2
        className="mb-2 text-lg font-semibold"
        style={{ color: 'var(--text)' }}
      >
        {title}
      </h2>

      <p
        className="mb-4 text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {predictions}
      </p>

      <CurrencyChip
        value={diamonds}
        className="mb-4 border border-[var(--border)] bg-[var(--el-bg)] text-[var(--text)]"
      />

      <p
        className="mb-5 text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {priceText}
      </p>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onBuy(code);
        }}
        disabled={disableAll}
        aria-busy={isActive}
        className="w-full rounded-xl py-3 font-medium transition hover:brightness-110 active:brightness-95"
        style={{
          background: 'var(--gradient-bg)',
          color: 'var(--button-text)',
          opacity: isActive ? 0.6 : 1,
          cursor: isActive ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--gradient-bg-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--gradient-bg)';
          }
        }}
      >
        {isActive ? 'Создаём счёт…' : ctaText}
      </button>
    </div>
  );
});
