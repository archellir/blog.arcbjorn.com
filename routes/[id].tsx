import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "$gfm";
import { IPost, IState } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";
import { HeadElement } from "../components/HeadElement.tsx";
import { Header } from "../components/Header.tsx";

import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";

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
  const { data, url } = props;

  const dateFmt = new Intl.DateTimeFormat(data.locales, { dateStyle: "full" });

  const html = render(data.post.content);

  if (!props.data) {
    return "No post";
  }

  return (
    <div class="animate-appear">
      <HeadElement
        title={data.post.title}
        description={data.post.snippet}
        url={url}
      />

      <Header />
      <div class="p-8 mx-auto max-w-screen-md">
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
    </div>
  );
}
