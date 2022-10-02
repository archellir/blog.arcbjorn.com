import { loadPost } from "./loadPost.ts";

import { IPost } from "../types.ts";

export async function listPosts(): Promise<IPost[]> {
  const promises: Promise<IPost | null>[] = [];
  for await (const entry of Deno.readDir("./data/posts")) {
    const id = entry.name.slice(0, -3);
    promises.push(loadPost(id));
  }

  const posts = await Promise.all(promises) as IPost[];
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return posts as IPost[];
}
