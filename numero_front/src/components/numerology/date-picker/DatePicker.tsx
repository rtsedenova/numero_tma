import React from "react";
import BaseSelect from "./BaseSelect";
import OptionButton from "./OptionButton";
import {
  MonthIndex,
  DateParts,
  OpenPanel,
  RU_MONTHS,
  getDaysInMonth,
  toIsoOrNull,
  parseIso,
  buildYearsDesc,
} from "./helpers";

import { useDateStore } from "../../../storage/dateStore";

export interface DatePickerProps {
  /** ISO YYYY-MM-DD | null */
  value?: string | null;
  onChange?: (iso: string | null) => void;
  /** min year */
  minYear?: number;
  /** max year */
  maxYear?: number;
  /** add years in the future beyond the current year (default 50 years). */
  futureYearsSpan?: number;

  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minYear = 1900,
  maxYear = 2025,
  futureYearsSpan = 50,
  className = "",
}) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [dateParts, setDateParts] = React.useState<DateParts>(() => parseIso(value || selectedDate));
  const [openPanel, setOpenPanel] = React.useState<OpenPanel>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // sync internal state with external value or store value
  React.useEffect(() => setDateParts(parseIso(value || selectedDate)), [value, selectedDate]);

  // close on outside click
  React.useEffect(() => {
    const closeOnOutside = (e: MouseEvent) => {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  // Years list (desc)
  const availableYears = React.useMemo(
    () => buildYearsDesc(minYear, maxYear, futureYearsSpan),
    [minYear, maxYear, futureYearsSpan]
  );

  const maxDayForCurrentMonth = React.useMemo(
    () => (dateParts.month ? getDaysInMonth(dateParts.month, dateParts.year) : 31),
    [dateParts.month, dateParts.year]
  );

  const updateDateParts = React.useCallback((patch: Partial<DateParts>) => {
    const next: DateParts = { ...dateParts, ...patch };
    if (next.day !== null && next.month !== null) {
      const correctedMax = getDaysInMonth(next.month, next.year);
      if (next.day > correctedMax) next.day = correctedMax;
    }
    setDateParts(next);
    const isoDate = toIsoOrNull(next);
    onChange?.(isoDate);
    setSelectedDate(isoDate);
  }, [dateParts, onChange, setSelectedDate]);

  return (
    <div ref={rootRef} className={`w-full ${className}`}>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Day */}
        <BaseSelect
          label="День"
          isOpen={openPanel === "day"}
          onToggle={() => setOpenPanel(openPanel === "day" ? null : "day")}
          displayValue={dateParts.day ? String(dateParts.day) : ""}
        >
          {Array.from({ length: maxDayForCurrentMonth }, (_, i) => i + 1).map((d) => (
            <OptionButton
              key={d}
              selected={dateParts.day === d}
              onClick={() => {
                updateDateParts({ day: d });
                setOpenPanel(null);
              }}
            >
              {d}
            </OptionButton>
          ))}
        </BaseSelect>

        {/* Month */}
        <BaseSelect
          label="Месяц"
          isOpen={openPanel === "month"}
          onToggle={() => setOpenPanel(openPanel === "month" ? null : "month")}
          displayValue={dateParts.month ? RU_MONTHS[dateParts.month] : ""}
        >
          {(Object.keys(RU_MONTHS) as unknown as MonthIndex[]).map((m) => (
            <OptionButton
              key={m}
              title={RU_MONTHS[m]}
              selected={dateParts.month === m}
              onClick={() => {
                updateDateParts({ month: m });
                setOpenPanel(null);
              }}
            >
              {RU_MONTHS[m]}
            </OptionButton>
          ))}
        </BaseSelect>

        {/* Year */}
        <BaseSelect
          label="Год"
          isOpen={openPanel === "year"}
          onToggle={() => setOpenPanel(openPanel === "year" ? null : "year")}
          displayValue={dateParts.year ? String(dateParts.year) : ""}
        >
          {availableYears.map((y) => (
            <OptionButton
              key={y}
              selected={dateParts.year === y}
              onClick={() => {
                updateDateParts({ year: y });
                setOpenPanel(null);
              }}
            >
              {y}
            </OptionButton>
          ))}
        </BaseSelect>
      </div>
    </div>
  );
};

export default DatePicker;
