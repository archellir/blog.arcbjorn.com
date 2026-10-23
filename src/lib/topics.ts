import type { IPostSummary } from './types';
import { hasAnyTag, parseTags } from './tags';

export interface ITopic {
  label: string;
  // The path segment under /topics; empty for the whole index.
  slug: string;
  // Tags the topic gathers; empty means every post.
  tags: string[];
}

// The index's filters. Each gathers several tags under one name.
export const topics: ITopic[] = [
  { label: 'All posts', slug: '', tags: [] },
  { label: 'Leetcode', slug: 'leetcode', tags: ['leetcode'] },
  { label: 'Infra', slug: 'infra', tags: ['linux', 'k8s', 'devops', 'automation'] },
  { label: 'AI', slug: 'ai', tags: ['ai', 'llm', 'machine-learning', 'agents'] },
  { label: 'Security', slug: 'security', tags: ['security', 'crypto'] },
  { label: 'Blockchain', slug: 'blockchain', tags: ['blockchain', 'ethereum', 'solidity', 'evm'] },
];

export function topicHref(topic: ITopic): string {
  return topic.slug ? `/topics/${topic.slug}` : '/';
}

export function topicBySlug(slug: string): ITopic | undefined {
  return topics.find(topic => topic.slug === slug);
}

// The topic a path belongs to: "/" or "/topics/<slug>"; nothing elsewhere.
export function activeTopic(pathname: string): ITopic | undefined {
  if (pathname === '/') return topics[0];
  const match = pathname.match(/^\/topics\/([^/]+)\/?$/);
  return match ? topicBySlug(match[1]) : undefined;
}

// The posts a topic covers, in the order given.
export function topicPosts<T extends IPostSummary>(topic: ITopic, posts: T[]): T[] {
  if (topic.tags.length === 0) return posts;
  return posts.filter(post => hasAnyTag(post.tags, topic.tags));
}

// Posts that carry one tag (exact, case-insensitive).
export function taggedPosts<T extends IPostSummary>(tag: string, posts: T[]): T[] {
  const wanted = parseTags([tag]);
  return posts.filter(post => hasAnyTag(post.tags, wanted));
}

// How many posts each topic holds, in nav order.
export function countTopics(posts: IPostSummary[]): number[] {
  return topics.map(topic => topicPosts(topic, posts).length);
}

// Every distinct tag across the posts, lower-cased, most used first.
export function allTags(posts: IPostSummary[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of parseTags(post.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
