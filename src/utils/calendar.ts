// Local YYYY-MM-DD (matches how next_renewal_date is stored), avoiding the UTC
// shift that toISOString() would introduce.
export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

// First day of the month `amount` months from `date`.
export const addMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const startOfWeek = (date: Date): Date => addDays(date, -date.getDay());

export type CalendarMode = "week" | "month";

export interface CalendarCell {
  date: Date;
  iso: string;
  inMonth: boolean;
  isToday: boolean;
}

const buildCell = (date: Date, anchorMonth: number, todayIso: string): CalendarCell => {
  const iso = toISODate(date);
  return {
    date: new Date(date),
    iso,
    inMonth: date.getMonth() === anchorMonth,
    isToday: iso === todayIso,
  };
};

// Weeks (rows of 7) spanning `anchor`'s month, padded with the leading/trailing
// days needed to fill whole weeks (Sunday-first).
export const buildMonthMatrix = (anchor: Date, today: Date): CalendarCell[][] => {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((startOffset + daysInMonth) / 7);
  const todayIso = toISODate(today);
  const cursor = new Date(year, month, 1 - startOffset);
  const matrix: CalendarCell[][] = [];
  for (let week = 0; week < weekCount; week += 1) {
    const row: CalendarCell[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(buildCell(cursor, month, todayIso));
      cursor.setDate(cursor.getDate() + 1);
    }
    matrix.push(row);
  }
  return matrix;
};

// Single Sunday-first week containing `anchor`.
export const buildWeekMatrix = (anchor: Date, today: Date): CalendarCell[][] => {
  const todayIso = toISODate(today);
  const cursor = startOfWeek(anchor);
  const row: CalendarCell[] = [];
  for (let day = 0; day < 7; day += 1) {
    row.push(buildCell(cursor, anchor.getMonth(), todayIso));
    cursor.setDate(cursor.getDate() + 1);
  }
  return [row];
};

// Whether an ISO date falls in the same year + month as `anchor`.
export const isInMonth = (iso: string, anchor: Date): boolean => {
  const [year, month] = iso.split("-").map(Number);
  return year === anchor.getFullYear() && month - 1 === anchor.getMonth();
};

export const monthLabel = (anchor: Date): string =>
  anchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export const monthName = (anchor: Date): string =>
  anchor.toLocaleDateString("en-IN", { month: "long" });
