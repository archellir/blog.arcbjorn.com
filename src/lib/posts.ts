import { getCollection } from 'astro:content';

import type { IPost } from './types';

// Every post, newest first. Only pages and endpoints call this; the pure
// helpers in this folder take the result as input so they stay testable.
export async function allPosts(): Promise<IPost[]> {
  const entries = await getCollection('posts');
  return entries
    .map(entry => ({
      id: entry.id,
      title: entry.data.title,
      publishedAt: entry.data.published_at,
      snippet: entry.data.snippet,
      tags: entry.data.tags,
      image: entry.data.image,
      leetcode_number: entry.data.leetcode_number,
      content: entry.body ?? '',
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function summaryOf(post: IPost) {
  const { content: _content, ...summary } = post;
  return summary;
}
