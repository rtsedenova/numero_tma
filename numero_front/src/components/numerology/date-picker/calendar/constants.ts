export const VIEWPORT_BREAKPOINTS = {
NARROW: 768,
} as const;

export const CALENDAR = {
MONTHS_PER_YEAR: 12,
DAYS_PER_WEEK: 7,
FIRST_MONTH: 1,
LAST_MONTH: 12,
WEEK_DAYS: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const,
} as const;

export const DATE_PICKER_DEFAULTS = {
MIN_YEAR: 1900,
MAX_YEAR: 2025,
FUTURE_YEARS_SPAN: 50,
} as const;

export const POPOVER = {
PADDING: 12,
GAP: 8,
} as const;

export const CALENDAR_PANEL = {
MOBILE_PADDING: 16,
MOBILE_MAX_WIDTH_OFFSET: 32,
MAX_HEIGHT_VH: 90,
} as const;

export const BUTTON_STYLES = {
BASE: "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
CANCEL: [
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
    "text-[var(--text-secondary)]",
    "hover:bg-[var(--el-bg-hover)]",
].join(" "),
OK_BASE: [
    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
    "bg-[var(--button-bg)]",
    "hover:bg-[var(--button-bg-hover)]",
    "text-[var(--button-text)]",
].join(" "),
DISABLED: [
    "cursor-not-allowed",
    "text-[var(--text-subtle)]",
    "bg-[var(--el-bg-hover)]",
].join(" "),

CLEAR_ENABLED: [
    "text-[var(--button-text)]",
    "bg-[var(--button-bg)]",
    "hover:bg-[var(--button-bg-hover)]",
].join(" "),
NAV_BASE: "py-2 px-3 rounded-md transition-colors",
NAV_ENABLED: "text-[var(--text-subtle)] hover:text-[var(--navcard-desc)]",
NAV_DISABLED: "text-neutral-300 cursor-not-allowed",
HEADER_BUTTON: "px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--el-bg-hover)] rounded-md transition-colors",
} as const;

