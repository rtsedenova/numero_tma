import React from "react";
import crystallIcon from "../assets/crystall_currency.svg";

export interface CurrencyChipProps {
  value: string;
  className?: string;
}

export const CurrencyChip: React.FC<CurrencyChipProps> = ({
  value,
  className = "",
}) => (
  <div
    className={`
      inline-flex items-center gap-1 px-3 py-0.5 rounded-full
      border border-violet-300/70
      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]
      bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-indigo-500/10
      transition-colors
      hover:from-fuchsia-500/30 hover:via-violet-500/20 hover:to-indigo-500/20
      text-violet-200 font-semibold whitespace-nowrap
      ${className}
    `}
  >
    <img src={crystallIcon} alt="" className="w-4 h-4" />
    <span className="text-sm tabular-nums">{value}</span>
  </div>
);
