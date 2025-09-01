import { extract } from "$std/front_matter/yaml.ts";

import { IPost, TMarkdownMetadata } from "../types.ts";

export async function loadPost(id: string): Promise<IPost | null> {
  let text: string;

  try {
    text = await Deno.readTextFile(`./data/posts/${id}.md`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }

  const { body, attrs }: {
    body: IPost["content"];
    attrs: TMarkdownMetadata;
  } = extract<TMarkdownMetadata>(text);

  return {
    id,
    title: attrs.title,
    publishedAt: attrs.published_at,
    snippet: attrs.snippet,
    tags: attrs.tags,
    content: body,
    image: attrs.image,
  };
}
