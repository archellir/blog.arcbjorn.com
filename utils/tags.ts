// "leetcode, Go" -> ["leetcode", "go"]
export function parseTags(tags?: string | null): string[] {
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

export function tagHref(tag: string): string {
  return `/?tags=${encodeURIComponent(tag.trim().toLowerCase())}`;
}
