import React, { useMemo } from "react";
import { RU_MONTHS, MonthIndex } from "../helpers";
import type { MonthGridProps } from "./types";

const MonthGridComponent: React.FC<MonthGridProps> = ({
  selectedMonth,
  onMonthSelect,
  className = "",
}) => {
  const months = useMemo(
    () =>
      (Object.keys(RU_MONTHS) as unknown as MonthIndex[]).map((key) => ({
        index: key,
        name: RU_MONTHS[key],
      })),
    []
  );

  return (
    <div className={className}>
      <div className="p-2">
        <div className="grid grid-cols-3 gap-2 w-full">
          {months.map(({ index, name }) => {
            const isSelected = selectedMonth === index;

            const base = [
              "w-full px-4 py-3 rounded-lg text-sm font-medium text-center",
              "transition-colors duration-200",
              "flex items-center justify-center",
            ].join(" ");

            const state = isSelected
              ? [
                  "bg-[color:var(--button-bg)]",
                  "hover:bg-[color:var(--button-bg-hover)]",
                  "text-[color:var(--button-text)]",
                  "shadow-md",
                ].join(" ")
              : [
                  "text-[color:var(--text-secondary)]",
                  "hover:bg-[color:color-mix(in_srgb,var(--button-bg)_14%,transparent)]",
                  "hover:text-[color:var(--text)]",
                ].join(" ");

            return (
              <button
                key={index}
                type="button"
                onClick={() => onMonthSelect(index)}
                className={[base, state].join(" ")}
                aria-label={`Выбрать ${name}`}
                aria-selected={isSelected}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const MonthGrid = React.memo(MonthGridComponent, (prevProps, nextProps) => {
  return prevProps.selectedMonth === nextProps.selectedMonth && prevProps.className === nextProps.className;
});

MonthGrid.displayName = "MonthGrid";

export default MonthGrid;
