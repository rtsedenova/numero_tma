import React, { useMemo, useRef, useEffect } from "react";
import { buildYearsDesc } from "../helpers";
import { DATE_PICKER_DEFAULTS } from "./constants";
import type { YearGridProps } from "./types";

const YearGridComponent: React.FC<YearGridProps> = ({
  selectedYear,
  currentYear,
  onYearSelect,
  minYear = DATE_PICKER_DEFAULTS.MIN_YEAR,
  maxYear = DATE_PICKER_DEFAULTS.MAX_YEAR,
  futureYearsSpan = DATE_PICKER_DEFAULTS.FUTURE_YEARS_SPAN,
  className = "",
}) => {
  const availableYears = useMemo(
    () => buildYearsDesc(minYear, maxYear, futureYearsSpan),
    [minYear, maxYear, futureYearsSpan]
  );

  const currentYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentYearRef.current) {
      currentYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div className={className}>
      <div className="max-h-64 overflow-y-auto p-2">
        <div className="grid grid-cols-4 gap-2 w-full">
          {availableYears.map((year) => {
            const isSelected = selectedYear === year;
            const isCurrent = currentYear === year;

            const base = [
              "px-3 py-2 rounded-lg text-sm font-medium",
              "transition-colors duration-200",
              "border-2 border-transparent",
              "flex items-center justify-center",
            ].join(" ");

            const state = isSelected
              ? [
                  "bg-[color:var(--button-bg)]",
                  "hover:bg-[color:var(--button-bg-hover)]",
                  "text-[color:var(--button-text)]",
                  "shadow-md",
                ].join(" ")
              : isCurrent
              ? [
                  "text-[color:var(--text)] font-semibold",
                  "border-[color:color-mix(in_srgb,var(--button-bg)_45%,transparent)]",
                  "bg-[color:color-mix(in_srgb,var(--button-bg)_10%,transparent)]",
                  "hover:bg-[color:color-mix(in_srgb,var(--button-bg)_14%,transparent)]",
                ].join(" ")
              : [
                  "text-[color:var(--text-secondary)]",
                  "hover:bg-[color:color-mix(in_srgb,var(--button-bg)_14%,transparent)]",
                  "hover:text-[color:var(--text)]",
                ].join(" ");

            return (
              <button
                key={year}
                ref={isCurrent ? currentYearRef : null}
                type="button"
                onClick={() => onYearSelect(year)}
                className={[base, state].join(" ")}
                aria-label={`Выбрать ${year} год`}
                aria-selected={isSelected}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const YearGrid = React.memo(YearGridComponent, (prevProps, nextProps) => {
  return (
    prevProps.selectedYear === nextProps.selectedYear &&
    prevProps.currentYear === nextProps.currentYear &&
    prevProps.minYear === nextProps.minYear &&
    prevProps.maxYear === nextProps.maxYear &&
    prevProps.futureYearsSpan === nextProps.futureYearsSpan &&
    prevProps.className === nextProps.className
  );
});

YearGrid.displayName = "YearGrid";

export default YearGrid;
