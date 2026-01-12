import { MonthIndex, DateParts } from "../helpers";

export type CalendarView = "day" | "month" | "year";

export interface CalendarPanelProps {
  value: string | null;
  onSelect: (iso: string | null, shouldClose?: boolean) => void;
  onCancel: () => void;
  minYear?: number;
  maxYear?: number;
  futureYearsSpan?: number;
  className?: string;
}

export interface DateFieldProps {
  value: string | null;
  onClick: () => void;
  placeholder?: string;
  className?: string;
}

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  className?: string;
}

export interface CalendarHeaderProps {
  year: number;
  month: MonthIndex;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthClick: () => void;
  onYearClick: () => void;
  minYear?: number;
  maxYear?: number;
}

export interface DayGridProps {
  year: number;
  month: MonthIndex;
  selectedDate: string | null;
  onDaySelect: (day: number) => void;
  className?: string;
}

export interface MonthGridProps {
  selectedMonth: MonthIndex | null;
  onMonthSelect: (month: MonthIndex) => void;
  className?: string;
}

export interface YearGridProps {
  selectedYear: number | null;
  currentYear: number;
  onYearSelect: (year: number) => void;
  minYear?: number;
  maxYear?: number;
  futureYearsSpan?: number;
  className?: string;
}

export interface CalendarFooterProps {
  hasValue: boolean;
  onClear: () => void;
  onCancel: () => void;
  onOk: () => void;
  className?: string;
}

export interface ParsedIsoDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface UseCalendarStateProps {
  value: string | null;
}

export interface UseCalendarStateReturn {
  tempDate: DateParts;
  originalDate: DateParts;
  currentYear: number;
  currentMonth: MonthIndex;
  setTempDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<MonthIndex>>;
  setOriginalDate: React.Dispatch<React.SetStateAction<DateParts>>;
}

export interface UseCalendarNavigationProps {
  minYear?: number;
  maxYear: number;
  currentYear: number;
  currentMonth: MonthIndex;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<MonthIndex>>;
}

export interface UseCalendarNavigationReturn {
  view: CalendarView;
  setView: React.Dispatch<React.SetStateAction<CalendarView>>;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
}

export interface UseCalendarActionsProps {
  tempDate: DateParts;
  originalDate: DateParts;
  currentYear: number;
  currentMonth: MonthIndex;
  view: CalendarView;
  setTempDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<MonthIndex>>;
  setView: React.Dispatch<React.SetStateAction<CalendarView>>;
  onSelect: (iso: string | null, shouldClose?: boolean) => void;
  onCancel: () => void;
}

export interface UseCalendarActionsReturn {
  handleDaySelect: (day: number) => void;
  handleMonthSelect: (month: MonthIndex) => void;
  handleYearSelect: (year: number) => void;
  handleClear: () => void;
  handleOk: () => void;
  handleCancel: () => void;
}

export interface UseCalculatedMaxYearProps {
  maxYear: number;
  futureYearsSpan: number;
}

type Position = { top: number; left: number; transform?: string };

export type { Position };

