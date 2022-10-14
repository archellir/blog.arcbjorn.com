import { HandlerContext, Handlers } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";
import { IPost } from "../types.ts";

const siteURL = "https://blog.arcbjorn.com";
const siteTitle = "Arcbjorn's thoughtbook";
const siteDescription = "Tech explorations";

const render = (posts: IPost[]) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss" rel="self" type="application/rss+xml"/>
${
    posts
      .map(
        (post) =>
          `<item>
<guid isPermaLink="true">${siteURL}/${post.id}</guid>
<title>${post.title}</title>
<link>${siteURL}/${post.id}</link>
<description>${post.snippet}</description>
<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
</item>`,
      )
      .join("")
  }
</channel>
</rss>
`;

export const handler: Handlers = {
  async GET(_req: Request, _ctx: HandlerContext) {
    const posts: IPost[] = await listPosts();
    const xmlData = render(posts);
    const headers = new Headers({
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    });

    return new Response(xmlData, {
      status: 200,
      headers,
    });
  },
};
