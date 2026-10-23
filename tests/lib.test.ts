import { describe, expect, it } from 'vitest';

import { isoDate, longDate, shortDate, yearOf } from '../src/lib/dates';
import { describePost } from '../src/lib/describePost';
import { groupByYear } from '../src/lib/groupPosts';
import { readingTime } from '../src/lib/readingTime';
import { relatedPosts } from '../src/lib/related';
import { hasAnyTag, parseTags, tagHref, tagSlug } from '../src/lib/tags';
import {
  activeTopic,
  allTags,
  countTopics,
  taggedPosts,
  topicBySlug,
  topicHref,
  topicPosts,
  topics,
} from '../src/lib/topics';

const posts = [
  { id: 'a', title: 'A', publishedAt: '2026-07-04', tags: ['ai', 'go'] },
  { id: 'b', title: 'B', publishedAt: '2025-11-25', tags: ['Leetcode', 'go'] },
  { id: 'c', title: 'C', publishedAt: '2025-03-05', tags: ['linux', 'C++'] },
  { id: 'd', title: 'D', publishedAt: '2023-02-24' },
  { id: 'e', title: 'E', publishedAt: '2022-01-01', tags: ['AI'] },
];

describe('dates', () => {
  it('formats the forms the pages use', () => {
    expect(isoDate('2026-07-04 12:00')).toBe('2026-07-04');
    expect(yearOf('2026-07-04')).toBe('2026');
    expect(shortDate('2025-09-28 10:00')).toBe('28 Sep');
    expect(shortDate('not a date')).toBe('not a date');
    expect(longDate('2026-07-04')).toBe('4 July 2026');
    expect(longDate('nope')).toBe('nope');
  });
});

describe('tags', () => {
  it('parses, slugs and links tags', () => {
    expect(parseTags(' Leetcode, Go ,,')).toEqual(['leetcode', 'go']);
    expect(parseTags(['C++', 'AI'])).toEqual(['c++', 'ai']);
    expect(parseTags(undefined)).toEqual([]);
    expect(tagSlug('C++')).toBe('cpp');
    expect(tagSlug('machine-learning')).toBe('machine-learning');
    expect(tagHref('Go')).toBe('/tags/go');
    expect(hasAnyTag(['Go', 'ai'], ['go'])).toBe(true);
    expect(hasAnyTag(undefined, ['go'])).toBe(false);
  });
});

describe('topics', () => {
  it('links, resolves and filters topics', () => {
    expect(topicHref(topics[0])).toBe('/');
    expect(topicHref(topicBySlug('leetcode')!)).toBe('/topics/leetcode');
    expect(activeTopic('/')?.label).toBe('All posts');
    expect(activeTopic('/topics/infra')?.label).toBe('Infra');
    expect(activeTopic('/two-sum')).toBeUndefined();
    expect(topicPosts(topicBySlug('ai')!, posts).map(post => post.id)).toEqual(['a', 'e']);
    expect(taggedPosts('go', posts).map(post => post.id)).toEqual(['a', 'b']);
    expect(taggedPosts('C++', posts).map(post => post.id)).toEqual(['c']);
    // All, Leetcode, Infra, AI, Security, Blockchain
    expect(countTopics(posts)).toEqual([5, 1, 1, 2, 0, 0]);
    expect(allTags(posts)).toEqual(['ai', 'go', 'c++', 'leetcode', 'linux']);
  });
});

describe('posts', () => {
  it('groups by year, finds related posts and estimates reading time', () => {
    expect(groupByYear(posts).map(group => [group.year, group.posts.length])).toEqual([
      ['2026', 1],
      ['2025', 2],
      ['2023', 1],
      ['2022', 1],
    ]);
    expect(relatedPosts(posts[0], posts).map(post => post.id)).toEqual(['b', 'e']);
    expect(relatedPosts(posts[3], posts)).toEqual([]);
    expect(readingTime('one two three')).toBe(1);
    expect(readingTime(Array(660).fill('word').join(' '))).toBe(3);
  });

  it('describes posts without a snippet', () => {
    const base = { id: 'x', title: 'Two sum', publishedAt: '2023-02-24' };
    expect(
      describePost({ ...base, leetcode_number: 1, tags: ['leetcode', 'go', 'typescript'] })
    ).toBe('Leetcode 1: Two sum. Solutions in Go and TypeScript.');
    expect(describePost({ ...base, snippet: 'Given' })).toBe('Given');
    expect(describePost({ ...base, title: 'Notes' })).toBe('Notes. Notes by Oleg Luganskiy.');
  });
});
