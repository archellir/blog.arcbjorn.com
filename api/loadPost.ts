import { extract } from "$std/encoding/front_matter.ts";

import { Post } from "../types.ts";

export async function loadPost(id: string): Promise<Post | null> {
  let text: string;

  try {
    text = await Deno.readTextFile(`./data/posts/${id}.md`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }

  const { attrs, body: content }: {
    attrs: Record<string, string>;
    body: Post["content"];
  } = extract(text);

  return {
    id,
    title: attrs.title,
    publishedAt: new Date(attrs.published_at),
    snippet: attrs.snippet,
    content,
  };
}
