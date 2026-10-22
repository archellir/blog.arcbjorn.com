import { define } from "../fresh.ts";
import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { KATEX_CSS } from "$gfm";

import { loadPost } from "../api/loadPost.ts";
import { listPosts } from "../api/listPosts.ts";
import { renderMarkdown } from "../api/renderMarkdown.ts";

import HeadElement from "../components/HeadElement.tsx";
import Shell from "../components/Shell.tsx";
import PostHeader from "../components/PostHeader.tsx";
import PostNav from "../components/PostNav.tsx";
import StructuredData from "../components/StructuredData.tsx";
import PostEnhancer from "../islands/PostEnhancer.tsx";

import { formatDate, isoDate } from "../utils/dates.ts";
import { describePost } from "../utils/describePost.ts";
import { readingTime } from "../utils/readingTime.ts";
import { resolveImageUrl } from "../utils/imageUtils.ts";
import { AUTHOR, AUTHOR_URL, SITE_NAME, SITE_URL } from "../constants.ts";

export default define.page(async (ctx) => {
  const url = ctx.url;
  const post = await loadPost(ctx.params.id);
  if (!post) throw new HttpError(404);

  // Neighbours in publication order, for the links at the end.
  const { posts } = await listPosts({ offset: 0, limit: 0 });
  const index = posts.findIndex((item) => item.id === post.id);
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index >= 0 && index < posts.length - 1
    ? posts[index + 1]
    : undefined;

  const rendered = renderMarkdown(post.content);
  const date = formatDate(post.publishedAt, ctx.state.locales);
  const published = isoDate(post.publishedAt);
  const minutes = readingTime(post.content);
  const description = describePost(post);
  const image = resolveImageUrl(post.image, url.origin);

  const blogPostData = {
    headline: post.title,
    description,
    datePublished: published,
    dateModified: published,
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Person",
      name: AUTHOR,
      url: AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${url.origin}/images/og-default.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.href,
    },
    image,
  };

  return (
    <>
      <HeadElement
        url={url}
        title={`${post.title} · ${SITE_NAME}`}
        description={description}
        image={image}
        type="article"
        publishedAt={published}
      />
      {rendered.hasMath && (
        <Head>
          <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />
        </Head>
      )}

      <StructuredData type="BlogPosting" data={blogPostData} />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: SITE_NAME,
              item: url.origin,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: post.title,
              item: url.href,
            },
          ],
        }}
      />

      <Shell>
        <article class="article">
          <PostHeader
            post={post}
            date={date}
            minutes={minutes}
            headings={rendered.headings}
          />
          <div
            class="prose"
            f-client-nav={false}
            dangerouslySetInnerHTML={{ __html: rendered.html }}
          />
          <PostNav newer={newer} older={older} />
        </article>
        <PostEnhancer mermaid={rendered.hasMermaid} />
      </Shell>
    </>
  );
});
