// "2026-07-04 12:00" -> "2026-07-04"
export function isoDate(publishedAt: string): string {
  return publishedAt.trim().slice(0, 10);
}

// "2026-07-04" -> "2026"
export function yearOf(publishedAt: string): string {
  return isoDate(publishedAt).slice(0, 4);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Day and month for a row under a year heading: "2026-07-04" -> "04 Jul".
// Always six characters, so the column stays aligned in the mono face.
export function shortDate(publishedAt: string): string {
  const iso = isoDate(publishedAt);
  const month = MONTHS[Number(iso.slice(5, 7)) - 1];
  const day = iso.slice(8, 10);
  if (!month || day.length !== 2) return iso;
  return `${day} ${month}`;
}

// The long English form: "2026-07-04" -> "4 July 2026".
export function longDate(publishedAt: string): string {
  const date = new Date(`${isoDate(publishedAt)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate(publishedAt);
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
