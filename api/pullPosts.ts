import { IPost, IPostsResponse } from "../types.ts";

export async function pullPosts(
  url: string,
  posts: IPost[],
): Promise<IPostsResponse> {
  const offset = posts.length.toString();
  const limit = (posts.length + 5).toString();

  const requestUrl = url + "/posts?" + new URLSearchParams({ offset, limit });

  const response = await fetch(requestUrl);
  const postsData = await response.json() as IPostsResponse;

  posts.push(...postsData.posts);

  return { posts, all: postsData.all };
}
