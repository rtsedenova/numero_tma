import React from "react";
import { Link } from "react-router-dom";
import currencyIcon from "../assets/currency_star.png";

export interface CurrencyChipProps {
  value: string;
  className?: string;
  isLoading?: boolean;
}

export const CurrencyChip: React.FC<CurrencyChipProps> = ({
  value,
  className = "",
  isLoading = false,
}) => (
  <Link
    to="/payment"
    className={`
      inline-flex items-center gap-2 px-2 py-1 rounded-full
      [background-image:var(--gradient-bg)]
      transition-all duration-300 ease-out
      hover:[background-image:var(--gradient-bg-hover)]
      ${className}
    `}
  >
    <img src={currencyIcon} className="w-4 h-4 shrink-0 [filter:var(--icon-shadow)]" />
    {isLoading ? (
      <div className="w-5 h-5 border-2 border-purple-300/30 border-t-transparent rounded-full animate-spin" />
    ) : (
      <span className="text-sm font-medium tabular-nums text-[var(--button-text)]">{value}</span>
    )}
  </Link>
);
