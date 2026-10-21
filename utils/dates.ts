// "2026-07-04 12:00" -> "2026-07-04"
export function isoDate(publishedAt: string): string {
  return publishedAt.trim().slice(0, 10);
}

// A long, localized date; falls back to the ISO date when the locale list
// from the request cannot be used or the date is malformed.
export function formatDate(publishedAt: string, locales: string[]): string {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return isoDate(publishedAt);

  for (const locale of [...locales, "en-GB"]) {
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
        date,
      );
    } catch {
      // Unsupported or malformed locale tag; try the next one.
    }
  }
  return isoDate(publishedAt);
}
