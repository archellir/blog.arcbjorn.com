import { define } from "../fresh.ts";
import { listPosts } from "../api/listPosts.ts";
import { IPostsResponse, IPostSummary } from "../types.ts";
import { describePost } from "../utils/describePost.ts";
import { AUTHOR, SITE_DESCRIPTION, SITE_URL } from "../constants.ts";

const siteTitle = `${AUTHOR}'s thoughtbook`;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const render = (posts: IPostSummary[]) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<link>${SITE_URL}</link>
<language>en</language>
<atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
${
    posts
      .map(
        (post) =>
          `<item>
<guid isPermaLink="true">${SITE_URL}/${post.id}</guid>
<title>${escapeXml(post.title)}</title>
<link>${SITE_URL}/${post.id}</link>
<description>${escapeXml(describePost(post))}</description>
<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
</item>`,
      )
      .join("")
  }
</channel>
</rss>
`;

export const handler = define.handlers({
  async GET(_ctx) {
    const postsData: IPostsResponse = await listPosts({ offset: 0, limit: 0 });
    const xmlData = render(postsData.posts);
    const headers = new Headers({
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    });

    return new Response(xmlData, {
      status: 200,
      headers,
    });
  },
});
