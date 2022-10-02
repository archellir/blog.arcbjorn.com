import { IPost } from "../types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { loadPost } from "../api/loadPost.ts";

const post: IPost = {
  id: "string",
  title: "string",
  publishedAt: new Date(),
  snippet: "string",
  content: "string",
};

export const handler: Handlers<IPost | false> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const post = await loadPost(id);
    if (!post) {
      return ctx.render(false);
    }
    return ctx.render(post);
  },
};

export default function BlogPostPage(props: PageProps) {
  const post = props.data;
  if (!props.data) {
    return "No post";
  }

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <p class="text-grey-600 mt-12">
        {post.publishedAt.toLocaleDateString()}
      </p>
      <h1 class="text-5xl mt-2 font-bold">{post.title}</h1>
      <div class="mt-12">{post.title}</div>
    </div>
  );
}
