const WORDS_PER_MINUTE = 220;

// Minutes to read a post, never less than one.
export function readingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
