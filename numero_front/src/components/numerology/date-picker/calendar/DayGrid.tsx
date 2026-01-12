import React, { useMemo } from "react";
import { getDaysInMonth } from "../helpers";
import { isDateSelected, isDateToday } from "./utils";
import { CALENDAR } from "./constants";
import type { DayGridProps } from "./types";

const DayGridComponent: React.FC<DayGridProps> = ({
  year,
  month,
  selectedDate,
  onDaySelect,
  className = "",
}) => {
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const result: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      result.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      result.push(day);
    }
    const totalCells = 42;
    while (result.length < totalCells) {
      result.push(null);
    }
    return result;
  }, [month, year]);

  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-1 mb-2 px-2">
        {CALENDAR.WEEK_DAYS.map((day) => (
          <div
            key={day}
            className={[
              "text-center text-xs font-medium py-1",
              "text-[var(--text-subtle)]",
            ].join(" ")}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-2 pb-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const selected = isDateSelected(day, month, year, selectedDate);
          const today = isDateToday(day, month, year);

          const base = [
            "aspect-square rounded-lg text-sm font-medium",
            "transition-colors duration-200",
            "flex items-center justify-center",
            !selected ? "hover:bg-[color-mix(in_srgb,var(--button-bg)_14%,transparent)]" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const state = selected
            ? [
                "bg-[var(--button-bg)]",
                "hover:bg-[var(--button-bg-hover)]",
                "text-[var(--button-text)]",
                "shadow-md",
              ].join(" ")
            : today
            ? [
                "text-[var(--text)] font-semibold",
                "border-2 border-[color-mix(in_srgb,var(--button-bg)_45%,transparent)]",
                "bg-[color-mix(in_srgb,var(--button-bg)_10%,transparent)]",
              ].join(" ")
            : "text-[var(--text-secondary)]";

          return (
            <button
              key={day}
              type="button"
              onClick={() => onDaySelect(day)}
              className={[base, state].join(" ")}
              aria-label={`Выбрать ${day} число`}
              aria-selected={selected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DayGrid = React.memo(DayGridComponent, (prevProps, nextProps) => {
  return (
    prevProps.year === nextProps.year &&
    prevProps.month === nextProps.month &&
    prevProps.selectedDate === nextProps.selectedDate &&
    prevProps.className === nextProps.className
  );
});

DayGrid.displayName = "DayGrid";

export default DayGrid;
