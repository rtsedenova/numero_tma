import React, { useMemo, useCallback } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { DayGrid } from "./DayGrid";
import { MonthGrid } from "./MonthGrid";
import { YearGrid } from "./YearGrid";
import { CalendarFooter } from "./CalendarFooter";
import { toIsoOrNull } from "../helpers";
import { useCalendarState } from "./hooks/useCalendarState";
import { useCalculatedMaxYear } from "./hooks/useCalculatedMaxYear";
import { useCalendarNavigation } from "./hooks/useCalendarNavigation";
import { useCalendarActions } from "./hooks/useCalendarActions";
import { DATE_PICKER_DEFAULTS, CALENDAR_PANEL } from "./constants";
import type { CalendarPanelProps } from "./types";

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  value,
  onSelect,
  onCancel,
  minYear = DATE_PICKER_DEFAULTS.MIN_YEAR,
  maxYear = DATE_PICKER_DEFAULTS.MAX_YEAR,
  futureYearsSpan = DATE_PICKER_DEFAULTS.FUTURE_YEARS_SPAN,
  className = "",
}) => {
  const calculatedMaxYear = useCalculatedMaxYear({ maxYear, futureYearsSpan });

  const {
    tempDate,
    originalDate,
    currentYear,
    currentMonth,
    setTempDate,
    setCurrentYear,
    setCurrentMonth,
    setOriginalDate,
  } = useCalendarState({ value });

  const { view, setView, handlePreviousMonth, handleNextMonth } =
    useCalendarNavigation({
      minYear,
      maxYear: calculatedMaxYear,
      currentYear,
      currentMonth,
      setCurrentYear,
      setCurrentMonth,
    });

  const {
    handleDaySelect,
    handleMonthSelect,
    handleYearSelect,
    handleClear,
    handleOk,
    handleCancel,
  } = useCalendarActions({
    tempDate,
    originalDate,
    currentYear,
    currentMonth,
    view,
    setTempDate,
    setCurrentYear,
    setCurrentMonth,
    setView,
    onSelect,
    onCancel,
  });

  const selectedIsoDate = useMemo(() => toIsoOrNull(tempDate), [
    tempDate.day,
    tempDate.month,
    tempDate.year,
  ]);

  const hasValue = useMemo(
    () => tempDate.day !== null && tempDate.month !== null && tempDate.year !== null,
    [tempDate.day, tempDate.month, tempDate.year]
  );

  const handleMonthClick = useCallback(() => {
    setOriginalDate({ ...tempDate });
    setView("month");
  }, [tempDate, setOriginalDate, setView]);

  const handleYearClick = useCallback(() => {
    setOriginalDate({ ...tempDate });
    setView("year");
  }, [tempDate, setOriginalDate, setView]);

  const panelStyle = useMemo(
    () => ({
      maxWidth: `calc(100vw - ${CALENDAR_PANEL.MOBILE_MAX_WIDTH_OFFSET}px)`,
    }),
    []
  );

  const panelClassName = useMemo(
    () =>
      [
        "w-full max-w-sm rounded-xl overflow-hidden",
        "bg-[var(--el-bg)]",
        "max-h-[90vh] overflow-y-auto",
        "mx-auto",
        className,
      ].join(" "),
    [className]
  );

  return (
    <div className={panelClassName} style={panelStyle}>
      <div style={{ minHeight: "320px" }}>
        {view === "day" && (
          <div key="day" className="transition-opacity duration-200">
            <CalendarHeader
              year={currentYear}
              month={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onMonthClick={handleMonthClick}
              onYearClick={handleYearClick}
              minYear={minYear}
              maxYear={calculatedMaxYear}
            />
            <div className="p-3">
              <DayGrid
                year={currentYear}
                month={currentMonth}
                selectedDate={selectedIsoDate}
                onDaySelect={handleDaySelect}
              />
            </div>
          </div>
        )}

        {view === "month" && (
          <div key="month" className="transition-opacity duration-200">
            <div className="px-4 py-3">
              <button
                type="button"
                onClick={() => setView("year")}
                className={[
                  "text-lg font-semibold transition-colors text-[var(--text)]",
                ].join(" ")}
              >
                {currentYear}
              </button>
            </div>
            <div className="p-3">
              <MonthGrid selectedMonth={tempDate.month} onMonthSelect={handleMonthSelect} />
            </div>
          </div>
        )}

        {view === "year" && (
          <div key="year" className="transition-opacity duration-200">
            <div className="px-4 py-3">
              <h3
                className={[
                  "text-lg font-semibold text-[var(--text)]",
                ].join(" ")}
              >
                Выберите год
              </h3>
            </div>
            <div className="p-3">
              <YearGrid
                selectedYear={tempDate.year}
                currentYear={currentYear}
                onYearSelect={handleYearSelect}
                minYear={minYear}
                maxYear={calculatedMaxYear}
                futureYearsSpan={futureYearsSpan}
              />
            </div>
          </div>
        )}
      </div>

      <CalendarFooter hasValue={hasValue} onClear={handleClear} onCancel={handleCancel} onOk={handleOk} />
    </div>
  );
};

export default CalendarPanel;
