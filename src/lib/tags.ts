// "leetcode, Go" -> ["leetcode", "go"]
export function parseTags(tags?: string[] | string | null): string[] {
  const list = Array.isArray(tags) ? tags : (tags ?? '').split(',');
  return list.map(tag => tag.trim().toLowerCase()).filter(Boolean);
}

// Tags that are not safe in a path get a spelled-out slug.
const TAG_SLUGS: Record<string, string> = {
  'c++': 'cpp',
};

export function tagSlug(tag: string): string {
  const lower = tag.trim().toLowerCase();
  return TAG_SLUGS[lower] ?? lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function tagHref(tag: string): string {
  return `/tags/${tagSlug(tag)}`;
}

// Whether a post carries any of the wanted tags (exact, case-insensitive).
export function hasAnyTag(postTags: string[] | undefined, wanted: string[]): boolean {
  if (!postTags) return false;
  const set = new Set(parseTags(postTags));
  return wanted.some(tag => set.has(tag));
}
