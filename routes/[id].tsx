import { FunctionalComponent } from "preact";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { render } from "$gfm";
import { asset } from "$fresh/runtime.ts";

import { IPost, IState } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";
import { resolveImageUrl } from "../utils/imageUtils.ts";

import HeadElement from "../components/HeadElement.tsx";
import BlogLayout from "../components/BlogLayout.tsx";
import StructuredData from "../components/StructuredData.tsx";

import "https://esm.sh/prismjs@1.27.0/components/prism-c?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-cpp?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-go?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-yaml?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-zig?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-java?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-python?no-check";

interface IPostPageData extends IState {
  post: IPost;
}

type TPostPageProps = PageProps<IPostPageData>;

export const handler: Handlers<IPostPageData, IState> = {
  async GET(_req: Request, ctx: FreshContext<IState>) {
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
  const date = new Date(data.post.publishedAt);
  const localizedDate = dateFmt.format(date);

  const html = render(data.post.content, {
    allowMath: true,
  });

  const blogPostData = {
    "headline": data.post.title,
    "description": data.post.snippet,
    "datePublished": data.post.publishedAt,
    "dateModified": data.post.publishedAt,
    "author": {
      "@type": "Person",
      "name": "arcbjorn",
    },
    "publisher": {
      "@type": "Organization",
      "name": "blog.arcbjorn.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${url.origin}${asset("/images/og-default.png")}`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.href,
    },
    "image": resolveImageUrl(data.post.image, url.origin),
  };

  return (
    <>
      <HeadElement
        url={url}
        title={data.post.title}
        description={data.post.snippet}
        image={resolveImageUrl(data.post.image, url.origin)}
      />

      <StructuredData type="BlogPosting" data={blogPostData} />
      
      <StructuredData type="BreadcrumbList" data={{
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": url.origin
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": data.post.title,
            "item": url.href
          }
        ]
      }} />

      <BlogLayout includeCodeHighlighting>
        <div class="px-4 sm:px-8 py-8 mx-auto max-w-screen-lg border-t border-dashed border-gray-400">
          <p class="text-gray-400">
            {localizedDate}
          </p>

          <h1 class="text-3xl py-8 font-semibold">
            {data.post.title}
          </h1>
          <div
            style={{ backgroundColor: "#1b1d1e" }}
            class="markdown-body"
            data-color-mode="dark"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </BlogLayout>
    </>
  );
};

export default BlogPostPage;
