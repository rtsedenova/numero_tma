import { useCallback, useRef, useEffect } from "react";
import { MonthIndex, toIsoOrNull } from "../../helpers";
import type { UseCalendarActionsProps, UseCalendarActionsReturn } from "../types";

export const useCalendarActions = ({
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
}: UseCalendarActionsProps): UseCalendarActionsReturn => {
  const viewRef = useRef(view);
  const tempDateRef = useRef(tempDate);
  
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  
  useEffect(() => {
    tempDateRef.current = tempDate;
  }, [tempDate]);
const handleDaySelect = useCallback(
    (day: number) => {
    const newDate = { ...tempDateRef.current, day, month: currentMonth, year: currentYear };
    tempDateRef.current = newDate;
    setTempDate(newDate);
    },
    [currentMonth, currentYear, setTempDate]
);

const handleMonthSelect = useCallback(
    (month: MonthIndex) => {
    setCurrentMonth(month);
    const newDate = { ...tempDateRef.current, month };
    tempDateRef.current = newDate;
    setTempDate(newDate);
    },
    [setCurrentMonth, setTempDate]
);

const handleYearSelect = useCallback(
    (year: number) => {
    setCurrentYear(year);
    const newDate = { ...tempDateRef.current, year };
    tempDateRef.current = newDate;
    setTempDate(newDate);
    },
    [setCurrentYear, setTempDate]
);

const handleClear = useCallback(() => {
    const clearedDate = { day: null, month: null, year: null };
    setTempDate(clearedDate);
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth((now.getMonth() + 1) as MonthIndex);
    onSelect(null, false);
    setView("day");
}, [setTempDate, setCurrentYear, setCurrentMonth, onSelect, setView]);

const handleOk = useCallback(() => {
    const currentView = viewRef.current;
    const currentTempDate = tempDateRef.current;
    
    if (currentView === "day") {
    const iso = toIsoOrNull(currentTempDate);
    onSelect(iso, true);
    } else if (currentView === "month") {
    const iso = toIsoOrNull(currentTempDate);
    if (iso) {
        onSelect(iso, false);
    }
    setView("day");
    } else if (currentView === "year") {
    const iso = toIsoOrNull(currentTempDate);
    if (iso) {
        onSelect(iso, false);
    }
    if (currentTempDate.month !== null) {
        setCurrentMonth(currentTempDate.month);
        setView("day");
    } else {
        setView("month");
    }
    }
}, [onSelect, setView, setCurrentMonth]);

const handleCancel = useCallback(() => {
    const currentView = viewRef.current;
    
    setTempDate(originalDate);
    if (originalDate.year && originalDate.month) {
    setCurrentYear(originalDate.year);
    setCurrentMonth(originalDate.month);
    }
    
    if (currentView === "year" || currentView === "month") {
    setView("day");
    return;
    }
    
    onCancel();
}, [originalDate, setTempDate, setCurrentYear, setCurrentMonth, setView, onCancel]);

return {
    handleDaySelect,
    handleMonthSelect,
    handleYearSelect,
    handleClear,
    handleOk,
    handleCancel,
};
};

