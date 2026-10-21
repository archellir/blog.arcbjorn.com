import { IPostsResponse } from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";

// Fetches the next page of posts from the JSON endpoint (browser side).
export async function pullPosts(
  offset: number,
  tags = "",
): Promise<IPostsResponse> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(POSTS_SET_NUMBER),
  });
  if (tags) params.set("tags", tags);

  const response = await fetch(`/posts?${params}`);
  if (!response.ok) {
    throw new Error(`Loading posts failed with ${response.status}`);
  }
  return await response.json() as IPostsResponse;
}
