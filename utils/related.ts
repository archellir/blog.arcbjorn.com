import type { IPostSummary } from "../types.ts";
import { parseTags } from "./tags.ts";

// Up to `limit` other posts that share tags with `post`: most shared tags
// first, newest first among equals. Posts in date order come in, so the
// stable sort keeps that order inside each tier.
export function relatedPosts(
  post: IPostSummary,
  posts: IPostSummary[],
  limit = 3,
): IPostSummary[] {
  const own = new Set(parseTags(post.tags?.join(",")));
  if (own.size === 0) return [];

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      shared: parseTags(candidate.tags?.join(",")).filter((tag) => own.has(tag))
        .length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
