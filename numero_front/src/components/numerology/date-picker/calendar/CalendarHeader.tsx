import React, { useMemo } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import { RU_MONTHS } from "../helpers";
import { BUTTON_STYLES, DATE_PICKER_DEFAULTS } from "./constants";
import type { CalendarHeaderProps } from "./types";

const CalendarHeaderComponent: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
  onMonthClick,
  onYearClick,
  minYear = DATE_PICKER_DEFAULTS.MIN_YEAR,
  maxYear = DATE_PICKER_DEFAULTS.MAX_YEAR,
}) => {
  const canGoPrevious = useMemo(
    () => year > minYear || (year === minYear && month > 1),
    [year, month, minYear]
  );

  const canGoNext = useMemo(
    () => year < maxYear || (year === maxYear && month < 12),
    [year, month, maxYear]
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--text-subtle)]">
      <button
        type="button"
        onClick={onPreviousMonth}
        disabled={!canGoPrevious}
        className={[
          BUTTON_STYLES.NAV_BASE,
          canGoPrevious ? BUTTON_STYLES.NAV_ENABLED : BUTTON_STYLES.NAV_DISABLED,
        ].join(" ")}
        aria-label="Предыдущий месяц"
      >
        <CaretLeft className="w-5 h-5" weight="bold" />
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMonthClick}
          className={BUTTON_STYLES.HEADER_BUTTON}
        >
          {RU_MONTHS[month]}
        </button>
        <button
          type="button"
          onClick={onYearClick}
          className={BUTTON_STYLES.HEADER_BUTTON}
        >
          {year}
        </button>
      </div>

      <button
        type="button"
        onClick={onNextMonth}
        disabled={!canGoNext}
        className={[
          BUTTON_STYLES.NAV_BASE,
          canGoNext ? BUTTON_STYLES.NAV_ENABLED : BUTTON_STYLES.NAV_DISABLED,
        ].join(" ")}
        aria-label="Следующий месяц"
      >
        <CaretRight className="w-5 h-5" weight="bold" />
      </button>
    </div>
  );
};

export const CalendarHeader = React.memo(CalendarHeaderComponent, (prevProps, nextProps) => {
  return (
    prevProps.year === nextProps.year &&
    prevProps.month === nextProps.month &&
    prevProps.minYear === nextProps.minYear &&
    prevProps.maxYear === nextProps.maxYear
  );
});

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;

