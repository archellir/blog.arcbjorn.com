import { IPost, IPostsResponse } from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";

export async function pullPosts(
  url: string,
  posts: IPost[],
  tags = "",
): Promise<IPostsResponse> {
  const offset = posts.length.toString();
  const limit = (posts.length + POSTS_SET_NUMBER).toString();

  let requestUrl = url + "/posts?" +
    new URLSearchParams({ offset, limit });

  if (tags) {
    requestUrl += `&tags=${tags}`;
  }

  const response = await fetch(requestUrl);
  const postsData = await response.json() as IPostsResponse;

  posts.push(...postsData.posts);

  return { posts, all: postsData.all };
}
