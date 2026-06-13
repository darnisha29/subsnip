// Formats an ISO date (YYYY-MM-DD) as e.g. "5 Jul 2026".
export const formatDateShort = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Formats an ISO date as a weekday + day + month, e.g. "Sat, 14 Jun".
export const formatDateWithWeekday = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

// Whole days from today (local) to the given ISO date. Negative = past.
export const daysUntil = (iso: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

// Short uppercase countdown chip, e.g. "TOMORROW", "IN 3 DAYS". Returns null
// when the renewal is further out than the chip window or already past.
export const renewalChip = (iso: string, withinDays = 7): string | null => {
  const days = daysUntil(iso);
  if (days < 0 || days > withinDays) {
    return null;
  }
  if (days === 0) {
    return "TODAY";
  }
  if (days === 1) {
    return "TOMORROW";
  }
  return `IN ${days} DAYS`;
};

// Human renewal phrase for the body of a card/row, e.g. "Renews tomorrow",
// "In 5 days", "Renews 24 Jun".
export const renewalPhrase = (iso: string): string => {
  const days = daysUntil(iso);
  if (days === 0) {
    return "Renews today";
  }
  if (days === 1) {
    return "Renews tomorrow";
  }
  if (days > 1 && days <= 14) {
    return `In ${days} days`;
  }
  return `Renews ${formatDateShort(iso)}`;
};
