import { loadPost } from "./loadPost.ts";

import { IListLoadParams, IPost, IPostsResponse } from "../types.ts";

const defaultProps: IListLoadParams = {
  limit: 5,
  offset: 0,
};

export async function listPosts(
  props: IListLoadParams = defaultProps,
): Promise<IPostsResponse> {
  const promises: Promise<IPost | null>[] = [];
  for await (const entry of Deno.readDir("./data/posts")) {
    const id = entry.name.slice(0, -3);
    promises.push(loadPost(id));
  }

  let posts = await Promise.all(promises) as IPost[];
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const allPostsQuantity = posts.length;

  // return all posts when no limit
  if (props.limit === 0) {
    return { posts, all: allPostsQuantity };
  }

  const arrayOffset = props.offset > 0 ? props.offset : 0;
  posts = posts.slice(arrayOffset, arrayOffset + props.limit);

  if (props.tags?.length) {
    posts = posts.filter(({ tags }) => {
      let hasTag = false;

      if (tags && tags.length) {
        tags.forEach((tag) => props.tags!.includes(tag));
        for (let i = 0; i < tags.length; i++) {
          if (props.tags!.includes(tags[i])) {
            hasTag = true;
          }
        }
      }

      return hasTag;
    });
  }

  return { posts, all: allPostsQuantity };
}
