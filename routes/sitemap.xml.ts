import { define } from "../fresh.ts";
import { listPosts } from "../api/listPosts.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const origin = url.origin;

    const postsData = await listPosts({ limit: 1000, offset: 0 });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${
      postsData.posts.map((post) =>
        `<url>
    <loc>${origin}/${post.id}</loc>
    <lastmod>${post.publishedAt}</lastmod>
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
