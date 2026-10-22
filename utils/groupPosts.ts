import type { IPostSummary } from "../types.ts";
import { yearOf } from "./dates.ts";

export interface IYearGroup {
  year: string;
  posts: IPostSummary[];
}

// Splits a date-ordered list into runs of the same year, keeping the order.
export function groupByYear(posts: IPostSummary[]): IYearGroup[] {
  const groups: IYearGroup[] = [];
  for (const post of posts) {
    const year = yearOf(post.publishedAt);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}
