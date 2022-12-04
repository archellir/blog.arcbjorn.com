import { IPost } from "../types.ts";

export async function pullPosts(url: string, posts: IPost[]): Promise<IPost[]> {
  const offset = posts.length.toString();
  const limit = (posts.length + 5).toString();

  const requestUrl = url + "/posts?" + new URLSearchParams({ offset, limit });

  const response = await fetch(requestUrl);
  const postsData = await response.json() as IPost[];

  posts.push(...postsData);

  return posts;
}
