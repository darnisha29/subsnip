// Formats an ISO date (YYYY-MM-DD) as e.g. "5 Jul 2026".
export const formatDateShort = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
