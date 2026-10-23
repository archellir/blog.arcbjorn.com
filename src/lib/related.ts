import type { IPostSummary } from './types';
import { parseTags } from './tags';

// Up to `limit` other posts that share tags with `post`: most shared tags
// first, newest first among equals. Posts in date order come in, so the
// stable sort keeps that order inside each tier.
export function relatedPosts<T extends IPostSummary>(
  post: IPostSummary,
  posts: T[],
  limit = 3
): T[] {
  const own = new Set(parseTags(post.tags));
  if (own.size === 0) return [];

  return posts
    .filter(candidate => candidate.id !== post.id)
    .map(candidate => ({
      candidate,
      shared: parseTags(candidate.tags).filter(tag => own.has(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
