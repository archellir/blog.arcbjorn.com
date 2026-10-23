import type { APIRoute } from 'astro';

import { allPosts, summaryOf } from '../lib/posts';
import { renderMarkdown } from '../lib/markdown';
import { describePost } from '../lib/describePost';
import type { IPost } from '../lib/types';
import { AUTHOR, SITE_DESCRIPTION, SITE_URL } from '../lib/site';

const siteTitle = `${AUTHOR}'s thoughtbook`;

// Posts that carry their full text in the feed; older ones link out.
const FULL_TEXT_COUNT = 10;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// HTML inside CDATA; the one sequence that would end the section is split.
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

// Relative links and images resolve against the site, not the reader.
function absoluteUrls(html: string): string {
  return html.replace(/(href|src)="\/(?!\/)/g, (_match, attr: string) => `${attr}="${SITE_URL}/`);
}

function item(post: IPost, withText: boolean): string {
  const content = withText
    ? `\n<content:encoded>${cdata(absoluteUrls(renderMarkdown(post.content).html))}</content:encoded>`
    : '';
  return `<item>
<guid isPermaLink="true">${SITE_URL}/${post.id}</guid>
<title>${escapeXml(post.title)}</title>
<link>${SITE_URL}/${post.id}</link>
<description>${escapeXml(describePost(summaryOf(post)))}</description>
<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${content}
</item>`;
}

export const GET: APIRoute = async () => {
  const posts = await allPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<link>${SITE_URL}</link>
<language>en</language>
<lastBuildDate>${new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post, index) => item(post, index < FULL_TEXT_COUNT)).join('\n')}
</channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
