import { loadPost } from "./loadPost.ts";

import { IListLoadParams, IPost, IPostsResponse } from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";

const defaultProps: IListLoadParams = {
  limit: POSTS_SET_NUMBER,
  offset: 0,
};

export async function listPosts(
  props: IListLoadParams = defaultProps,
): Promise<IPostsResponse> {
  // Read all posts concurrently
  const posts = await Promise.all(
    Array.from(Deno.readDirSync("./data/posts")).map(
      (entry) => loadPost(entry.name.slice(0, -3)),
    ),
  ) as IPost[];

  // Sort by date descending
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Filter by tags if specified
  const filteredPosts = props.tags?.length
    ? posts.filter((post) =>
      post.tags?.some((tag) => props.tags!.includes(tag))
    )
    : posts;

  const allPostsQuantity = filteredPosts.length;

  // Return all posts if no limit specified
  if (props.limit === 0) {
    return { posts: filteredPosts, all: allPostsQuantity };
  }

  // Slice for pagination
  const start = props.offset > 0 ? props.offset : 0;
  const paginatedPosts = filteredPosts.slice(
    start,
    start + props.limit,
  );

  return { posts: paginatedPosts, all: allPostsQuantity };
}
