import type { IPostSummary } from './types';
import { yearOf } from './dates';

export interface IYearGroup<T extends IPostSummary = IPostSummary> {
  year: string;
  posts: T[];
}

// Splits a date-ordered list into runs of the same year, keeping the order.
export function groupByYear<T extends IPostSummary>(posts: T[]): IYearGroup<T>[] {
  const groups: IYearGroup<T>[] = [];
  for (const post of posts) {
    const year = yearOf(post.publishedAt);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}
