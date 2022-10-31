import { FunctionalComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "$gfm";

import { IPost, IState } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";

import { HeadElement } from "../components/HeadElement.tsx";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { CommentSection } from "../components/CommentSection.tsx";

import "https://esm.sh/prismjs@1.27.0/components/prism-c?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-cpp?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-go?no-check";

interface IPostPageData extends IState {
  post: IPost;
}

type TPostPageProps = PageProps<IPostPageData>;

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

const BlogPostPage: FunctionalComponent<TPostPageProps> = (props) => {
  const { data, url } = props;

  const dateFmt = new Intl.DateTimeFormat(data.locales, { dateStyle: "full" });

  const html = render(data.post.content);

  return (
    <>
      <HeadElement
        url={url}
        title={data.post.title}
        description={data.post.snippet}
      />

      <Header />

      <div class="px-4 sm:px-8 py-8 mx-auto max-w-screen-lg border-t border-dashed border-gray-400">
        <p class="text-gray-400 font-plex-mono">
          {dateFmt.format(data.post.publishedAt)}
        </p>

        <h1 class="text-3xl py-8 font-semibold font-plex-mono">
          {data.post.title}
        </h1>

        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div
          style={{ backgroundColor: "#212425" }}
          class="!font-plex-sans markdown-body"
          data-color-mode="dark"
          data-dark-theme="dark"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <CommentSection />

      <Footer />
    </>
  );
};

export default BlogPostPage;
