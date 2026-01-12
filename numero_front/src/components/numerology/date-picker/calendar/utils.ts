import { MonthIndex } from "../helpers";
import type { ParsedIsoDate } from "./types";

export const formatDate = (iso: string | null): string => {
if (!iso) return "";
const [year, month, day] = iso.split("-");
return `${day}.${month}.${year}`;
};

export const parseIsoDateParts = (iso: string | null): ParsedIsoDate => {
if (!iso) {
    return { year: null, month: null, day: null };
}
const parts = iso.split("-");
return {
    year: parts[0] ? parseInt(parts[0], 10) : null,
    month: parts[1] ? parseInt(parts[1], 10) : null,
    day: parts[2] ? parseInt(parts[2], 10) : null,
};
};

export const isDateSelected = (
day: number,
month: MonthIndex,
year: number,
selectedDate: string | null
): boolean => {
if (!selectedDate) return false;
const parsed = parseIsoDateParts(selectedDate);
return (
    parsed.day === day &&
    parsed.month === month &&
    parsed.year === year
);
};

export const isDateToday = (
day: number,
month: MonthIndex,
year: number
): boolean => {
const today = new Date();
return (
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear()
);
};

export function clamp(value: number, min: number, max: number): number {
return Math.max(min, Math.min(value, max));
}

export function getViewport() {
const vv = window.visualViewport;
if (!vv) {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    return { width: w, height: h, offsetLeft: 0, offsetTop: 0 };
}
return {
    width: vv.width,
    height: vv.height,
    offsetLeft: vv.offsetLeft,
    offsetTop: vv.offsetTop,
};
}

