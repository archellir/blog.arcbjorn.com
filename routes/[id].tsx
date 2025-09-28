import { define } from "../fresh.ts";
import { render } from "$gfm";

import type { IPost as _IPost } from "../types.ts";
import { loadPost } from "../api/loadPost.ts";
import { resolveImageUrl } from "../utils/imageUtils.ts";

import HeadElement from "../components/HeadElement.tsx";
import BlogLayout from "../components/BlogLayout.tsx";
import StructuredData from "../components/StructuredData.tsx";

// PrismJS language definitions are now loaded client-side via CSS/JS in BlogLayout

export default define.page(async (ctx) => {
  const url = ctx.url;
  const id = ctx.params.id;
  const post = await loadPost(id);
  if (!post) {
    const headers = new Headers({ Location: "/" });
    return new Response("", { status: 303, headers });
  }

  const dateFmt = new Intl.DateTimeFormat(ctx.state.locales, {
    dateStyle: "full",
  });
  const date = new Date(post.publishedAt);
  const localizedDate = dateFmt.format(date);

  const html = render(post.content, {
    allowMath: true,
  });

  const blogPostData = {
    "headline": post.title,
    "description": post.snippet,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": "arcbjorn",
    },
    "publisher": {
      "@type": "Organization",
      "name": "blog.arcbjorn.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${url.origin}/images/og-default.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.href,
    },
    "image": resolveImageUrl(post.image, url.origin),
  };

  return (
    <>
      <HeadElement
        url={url}
        title={post.title}
        description={post.snippet}
        image={resolveImageUrl(post.image, url.origin)}
      />

      <StructuredData type="BlogPosting" data={blogPostData} />

      <StructuredData
        type="BreadcrumbList"
        data={{
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": url.origin,
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": post.title,
              "item": url.href,
            },
          ],
        }}
      />

      <BlogLayout includeCodeHighlighting>
        <div class="px-4 sm:px-8 py-8 mx-auto max-w-screen-lg border-t border-dashed border-gray-400">
          <p class="text-gray-400">
            {localizedDate}
          </p>

          <h1 class="text-3xl py-8 font-semibold">
            {post.title}
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
});
