import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "$gfm";
import { IPost, IState } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";

interface IData extends IState {
  post: IPost | null;
}

export const handler: Handlers<IData, IState> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const post = await loadPost(id);
    if (!post) {
      return ctx.render({ ...ctx.state, post: null });
    }
    return ctx.render({ ...ctx.state, post });
  },
};

export default function BlogPostPage(props: PageProps) {
  const { post, locales } = props.data;

  const dateFmt = new Intl.DateTimeFormat(locales, { dateStyle: "full" });

  const html = render(post.content);

  if (!props.data) {
    return "No post";
  }

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <p class="text-grey-600 mt-12">
        {dateFmt.format(post.publishedAt)}
      </p>
      <h1 class="text-5xl mt-2 font-bold">{post.title}</h1>
      <style class="mt-12" dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        class="mt-12 markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
