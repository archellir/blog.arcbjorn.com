import { loadPost } from "./loadPost.ts";

import {
  IListLoadParams,
  IPost,
  IPostsResponse,
  IPostSummary,
} from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";
import { parseTags } from "../utils/tags.ts";

const POSTS_DIR = "./data/posts";

const defaultProps: IListLoadParams = {
  limit: POSTS_SET_NUMBER,
  offset: 0,
};

export async function listPosts(
  props: IListLoadParams = defaultProps,
): Promise<IPostsResponse> {
  // Only markdown files count as posts; editors and macOS leave other files
  // (.DS_Store, swap files) in the directory.
  const ids = Array.from(Deno.readDirSync(POSTS_DIR))
    .filter((entry) => entry.isFile && entry.name.endsWith(".md"))
    .map((entry) => entry.name.slice(0, -3));

  const loaded = await Promise.all(ids.map((id) => loadPost(id)));
  // Lists carry metadata only; the body stays on the post page.
  const posts: IPostSummary[] = loaded
    .filter((post): post is IPost => post !== null)
    .map(({ content: _content, ...summary }) => summary);

  // Sort by date descending
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Filter by tags if specified: a post matches when any of its tags is in
  // the requested set (case-insensitive, exact match).
  const wanted = parseTags(props.tags);
  const filteredPosts = wanted.length
    ? posts.filter((post) =>
      post.tags?.some((tag) => wanted.includes(tag.toLowerCase()))
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
