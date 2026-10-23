import type { APIRoute } from 'astro';

import { allPosts, summaryOf } from '../lib/posts';
import { tagHref } from '../lib/tags';
import { allTags, topicHref, topics } from '../lib/topics';
import { SITE_URL } from '../lib/site';

interface Entry {
  path: string;
  lastmod?: string;
  priority: string;
}

export const GET: APIRoute = async () => {
  const posts = (await allPosts()).map(summaryOf);
  const newest = posts[0]?.publishedAt;
  const entries: Entry[] = [
    { path: '/', lastmod: newest, priority: '1.0' },
    ...topics
      .filter(topic => topic.slug)
      .map(topic => ({ path: topicHref(topic), lastmod: newest, priority: '0.6' })),
    ...allTags(posts).map(tag => ({ path: tagHref(tag), lastmod: newest, priority: '0.4' })),
    ...posts.map(post => ({ path: `/${post.id}`, lastmod: post.publishedAt, priority: '0.8' })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    entry => `  <url>
    <loc>${SITE_URL}${entry.path}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
