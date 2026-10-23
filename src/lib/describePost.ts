import type { IPostSummary } from './types';
import { AUTHOR } from './site';

const LANGUAGE_NAMES: Record<string, string> = {
  go: 'Go',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  'c++': 'C++',
  rust: 'Rust',
  zig: 'Zig',
  java: 'Java',
};

// ["Go", "TypeScript", "C++"] -> "Go, TypeScript and C++"
function listify(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// Meta description: the snippet when there is one, otherwise a line built
// from what the post is (most Leetcode posts carry only tags).
export function describePost(post: IPostSummary): string {
  if (post.snippet) return post.snippet;

  const languages = (post.tags ?? [])
    .map(tag => LANGUAGE_NAMES[tag.toLowerCase()])
    .filter((name): name is string => Boolean(name));

  if (post.leetcode_number) {
    const solutions = languages.length ? ` Solutions in ${listify(languages)}.` : '';
    return `Leetcode ${post.leetcode_number}: ${post.title}.${solutions}`;
  }

  return `${post.title}. Notes by ${AUTHOR}.`;
}
