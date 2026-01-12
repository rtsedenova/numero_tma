import { useState, useCallback } from "react";
import { MonthIndex } from "../../helpers";
import { CALENDAR, DATE_PICKER_DEFAULTS } from "../constants";
import type { CalendarView, UseCalendarNavigationProps, UseCalendarNavigationReturn } from "../types";

export const useCalendarNavigation = ({
minYear = DATE_PICKER_DEFAULTS.MIN_YEAR,
maxYear,
currentYear,
currentMonth,
setCurrentYear,
setCurrentMonth,
}: UseCalendarNavigationProps): UseCalendarNavigationReturn => {
const [view, setView] = useState<CalendarView>("day");

const handlePreviousMonth = useCallback(() => {
    if (currentMonth === CALENDAR.FIRST_MONTH) {
    if (currentYear > minYear) {
        setCurrentMonth(CALENDAR.LAST_MONTH);
        setCurrentYear(currentYear - 1);
    }
    } else {
    setCurrentMonth((currentMonth - 1) as MonthIndex);
    }
}, [currentMonth, currentYear, minYear, setCurrentMonth, setCurrentYear]);

const handleNextMonth = useCallback(() => {
    if (currentMonth === CALENDAR.LAST_MONTH) {
    if (currentYear < maxYear) {
        setCurrentMonth(CALENDAR.FIRST_MONTH);
        setCurrentYear(currentYear + 1);
    }
    } else {
    setCurrentMonth((currentMonth + 1) as MonthIndex);
    }
}, [currentMonth, currentYear, maxYear, setCurrentMonth, setCurrentYear]);

return {
    view,
    setView,
    handlePreviousMonth,
    handleNextMonth,
};
};

