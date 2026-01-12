import { useState, useEffect, useMemo } from "react";
import { parseIso, MonthIndex } from "../../helpers";
import type { UseCalendarStateProps, UseCalendarStateReturn } from "../types";

export const useCalendarState = ({ value }: UseCalendarStateProps): UseCalendarStateReturn => {
  const initialDate = useMemo(() => {
    if (value) {
      const parsed = parseIso(value);
      if (parsed.year && parsed.month) {
        return { year: parsed.year, month: parsed.month as MonthIndex };
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: (now.getMonth() + 1) as MonthIndex };
  }, []);

  const [currentYear, setCurrentYear] = useState(initialDate.year);
  const [currentMonth, setCurrentMonth] = useState(initialDate.month);
  const [tempDate, setTempDate] = useState(() => parseIso(value));
  const [originalDate, setOriginalDate] = useState(() => parseIso(value));

  useEffect(() => {
    const parsed = parseIso(value);
    setTempDate(parsed);
    setOriginalDate(parsed);
    if (parsed.year && parsed.month) {
      setCurrentYear(parsed.year);
      setCurrentMonth(parsed.month);
    }
  }, [value]);

  return {
    tempDate,
    originalDate,
    currentYear,
    currentMonth,
    setTempDate,
    setCurrentYear,
    setCurrentMonth,
    setOriginalDate,
  };
};

