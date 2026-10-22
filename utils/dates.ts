// "2026-07-04 12:00" -> "2026-07-04"
export function isoDate(publishedAt: string): string {
  return publishedAt.trim().slice(0, 10);
}

// "2026-07-04" -> "2026"
export function yearOf(publishedAt: string): string {
  return isoDate(publishedAt).slice(0, 4);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Day and month for a row under a year heading: "2026-07-04" -> "04 Jul".
// Always six characters, so the column stays aligned in the mono face.
export function shortDate(publishedAt: string): string {
  const iso = isoDate(publishedAt);
  const month = MONTHS[Number(iso.slice(5, 7)) - 1];
  const day = iso.slice(8, 10);
  if (!month || day.length !== 2) return iso;
  return `${day} ${month}`;
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
