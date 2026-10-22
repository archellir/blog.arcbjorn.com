import { define } from "../fresh.ts";
import { listPosts } from "../api/listPosts.ts";
import { loadPost } from "../api/loadPost.ts";
import { renderMarkdown } from "../api/renderMarkdown.ts";
import { IPostSummary } from "../types.ts";
import { describePost } from "../utils/describePost.ts";
import { AUTHOR, SITE_DESCRIPTION, SITE_URL } from "../constants.ts";

const siteTitle = `${AUTHOR}'s thoughtbook`;

// Posts that carry their full text in the feed; older ones link out.
const FULL_TEXT_COUNT = 20;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// HTML inside CDATA; the one sequence that would end the section is split.
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

// Relative links and images resolve against the site, not the reader.
function absoluteUrls(html: string): string {
  return html.replace(
    /(href|src)="\/(?!\/)/g,
    (_match, attr: string) => `${attr}="${SITE_URL}/`,
  );
}

async function fullText(post: IPostSummary): Promise<string> {
  const full = await loadPost(post.id);
  if (!full) return "";
  const { html } = renderMarkdown(full.content);
  return `\n<content:encoded>${cdata(absoluteUrls(html))}</content:encoded>`;
}

const item = (post: IPostSummary, content: string) =>
  `<item>
<guid isPermaLink="true">${SITE_URL}/${post.id}</guid>
<title>${escapeXml(post.title)}</title>
<link>${SITE_URL}/${post.id}</link>
<description>${escapeXml(describePost(post))}</description>
<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${content}
</item>`;

const render = (posts: IPostSummary[], contents: string[]) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<link>${SITE_URL}</link>
<language>en</language>
<lastBuildDate>${
    new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()
  }</lastBuildDate>
<atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
${posts.map((post, index) => item(post, contents[index] ?? "")).join("\n")}
</channel>
</rss>
`;

export const handler = define.handlers({
  async GET(_ctx) {
    const { posts } = await listPosts({ offset: 0, limit: 0 });
    const contents = await Promise.all(
      posts.slice(0, FULL_TEXT_COUNT).map(fullText),
    );
    const headers = new Headers({
      "Cache-Control": "max-age=0, s-maxage=3600",
      "Content-Type": "application/xml; charset=utf-8",
    });

    return new Response(render(posts, contents), { status: 200, headers });
  },
});
