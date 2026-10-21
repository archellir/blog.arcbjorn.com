import { define } from "../fresh.ts";
import { listPosts } from "../api/listPosts.ts";
import { isoDate } from "../utils/dates.ts";
import { SITE_URL } from "../constants.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    const postsData = await listPosts({ limit: 0, offset: 0 });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${
      postsData.posts.map((post) =>
        `<url>
    <loc>${SITE_URL}/${post.id}</loc>
    <lastmod>${isoDate(post.publishedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      ).join("\n  ")
    }
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "max-age=3600",
      },
    });
  },
});
