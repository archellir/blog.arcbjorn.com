import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "$gfm";
import { IPost, IState } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";
import { HeadElement } from "../components/HeadElement.tsx";

import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";

interface IPostPageData extends IState {
  post: IPost;
}

export const handler: Handlers<IPostPageData, IState> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const post = await loadPost(id);
    if (!post) {
      const headers = new Headers({ Location: "/" });
      return new Response("", {
        status: 303,
        headers,
      });
    }
    return ctx.render({ ...ctx.state, post });
  },
};

export default function BlogPostPage(props: PageProps<IPostPageData>) {
  const { data, url } = props;

  const dateFmt = new Intl.DateTimeFormat(data.locales, { dateStyle: "full" });

  const html = render(data.post.content);

  if (!props.data) {
    return "No post";
  }

  return (
    <>
      <HeadElement
        url={url}
        title={data.post.title}
        description={data.post.snippet}
      />

      <div class="p-8 mx-auto max-w-screen-lg border-t border-dashed border-gray-400">
        <p class="text-grey-600 font-plex-mono">
          {dateFmt.format(data.post.publishedAt)}
        </p>

        <h1 class="text-3xl py-8 font-semibold font-plex-mono">
          {data.post.title}
        </h1>

        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div
          class="!font-plex-sans markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}
