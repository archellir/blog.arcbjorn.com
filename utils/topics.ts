import { parseTags } from "./tags.ts";
import type { IPostSummary } from "../types.ts";

export interface ITopic {
  label: string;
  // Comma-separated tags the topic covers; empty means every post.
  tags: string;
}

// The page nav. Each entry filters the list by tags, so a topic can gather
// several tags under one name.
export const topics: ITopic[] = [
  { label: "All posts", tags: "" },
  { label: "Leetcode", tags: "leetcode" },
  { label: "Infra", tags: "linux,k8s,devops,automation" },
  { label: "AI", tags: "ai,llm,machine-learning,agents" },
  { label: "Security", tags: "security,crypto" },
  { label: "Blockchain", tags: "blockchain,ethereum,solidity,evm" },
];

export function topicHref(topic: ITopic): string {
  return topic.tags ? `/?tags=${topic.tags}` : "/";
}

function normalize(tags: string | null | undefined): string {
  return parseTags(tags).join(",");
}

export function activeTopic(url: URL): ITopic | undefined {
  if (url.pathname !== "/") return undefined;
  const tags = normalize(url.searchParams.get("tags"));
  return topics.find((topic) => topic.tags === tags);
}

// Title for the list: the topic's name when the filter is one of the nav
// topics, the raw tags otherwise, "Posts" when unfiltered.
export function postsSectionTitle(tags?: string | null): string {
  const parsed = parseTags(tags);
  if (parsed.length === 0) return "Posts";
  const topic = topics.find((item) => item.tags === parsed.join(","));
  return topic?.label ?? parsed.join(" · ");
}

// How many posts each topic holds, in nav order, by the same rule the list
// filters with: a post counts when any of its tags is in the topic's set.
export function countTopics(posts: IPostSummary[]): number[] {
  return topics.map((topic) => {
    const wanted = parseTags(topic.tags);
    if (wanted.length === 0) return posts.length;
    return posts.filter((post) =>
      post.tags?.some((tag) => wanted.includes(tag.toLowerCase()))
    ).length;
  });
}
