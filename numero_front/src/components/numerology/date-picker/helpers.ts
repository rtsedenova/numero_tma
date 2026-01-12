export type MonthIndex = 1|2|3|4|5|6|7|8|9|10|11|12;

export interface DateParts {
  day: number | null;
  month: MonthIndex | null;
  year: number | null;
}

export const RU_MONTHS: Record<MonthIndex, string> = {
  1:"Январь",2:"Февраль",3:"Март",4:"Апрель",5:"Май",6:"Июнь",
  7:"Июль",8:"Август",9:"Сентябрь",10:"Октябрь",11:"Ноябрь",12:"Декабрь"
};

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const getDaysInMonth = (month: MonthIndex, year: number | null) => {
  if (month === 2) return year === null ? 29 : (isLeapYear(year) ? 29 : 28);
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

export const toIsoOrNull = ({ day, month, year }: DateParts): string | null => {
  if (day == null || month == null || year == null) return null;
  const maxDay = getDaysInMonth(month, year);
  if (day < 1 || day > maxDay) return null;
  return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
};

export const parseIso = (value?: string | null): DateParts => {
  if (!value) return { day: null, month: null, year: null };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { day: null, month: null, year: null };
  const [, y, m, d] = match;
  const year = Number(y);
  const monthNum = Number(m);
  const day = Number(d);
  const month = (monthNum >= 1 && monthNum <= 12 ? monthNum : null) as MonthIndex | null;
  return { day: Number.isFinite(day) ? day : null, month, year: Number.isFinite(year) ? year : null };
};

export const buildYearsDesc = (
  minYear: number,
  maxYear: number,
  futureYearsSpan = 50,
  now = new Date()
) => {
  const currentYear = now.getFullYear();
  const dynamicUpper = currentYear + Math.max(0, futureYearsSpan);
  const upperBound = Math.max(maxYear, dynamicUpper);
  const years: number[] = [];
  for (let y = upperBound; y >= minYear; y--) years.push(y);
  return years;
};
