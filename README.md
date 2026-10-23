# Thoughtbook

The blog at [blog.arcbjorn.com](https://blog.arcbjorn.com): notes on systems, algorithms,
infrastructure, security, blockchain and AI tooling, next to Leetcode solutions in Go,
TypeScript, Python and C++.

A static site built with [Astro](https://astro.build), with a few Preact islands, styled
after [arcbjorn.com](https://arcbjorn.com), served by Cloudflare Workers as static assets.

## Develop

```sh
pnpm install
pnpm dev       # Astro dev server with HMR at http://localhost:4321
pnpm check     # TypeScript and formatting
pnpm test      # unit tests (vitest)
pnpm build     # static build into dist/
pnpm preview   # serve dist/ with the Workers runtime at http://localhost:8787
pnpm format    # prettier
pnpm images    # regenerate the touch icon (needs Chrome)
```

## Write

Posts are Markdown files in `data/posts/` with front matter:

```yaml
---
title: 'Post title'
published_at: '2026-07-04'
snippet: 'One line under the title in the index and in previews.'
tags: ['ai', 'agents'] # optional; Leetcode posts also set leetcode_number
image: '/images/posts/banner.png' # optional social preview, 1200x630
---
```

The file name is the URL. Code fences are highlighted at build time, `mermaid` fences become
diagrams, inline `$...$` is maths, and `$` inside code is written as `\$`.

## Layout

- `src/pages/` the routes: the index, `topics/[slug]`, `tags/[tag]`, `[id]` for posts,
  `404`, `rss.xml`, `sitemap.xml`
- `src/layouts/Base.astro` the page shell; `src/components/` static pieces;
  `src/islands/` the interactive parts (theme toggle, "More posts", copy buttons and diagrams)
- `src/lib/` the Markdown pipeline and the helpers for dates, tags, topics and related posts;
  `src/content.config.ts` the post collection and its schema
- `src/styles/` the stylesheets, one per concern, on the palette in `base.css`
- `public/` fonts, images, icons, and the Cloudflare `_headers` and `_redirects`

## Deploy

The site is a folder of files. `wrangler.jsonc` describes an assets-only Worker that serves
`dist/`, with a real 404 page and no trailing slashes.

- From this machine: `pnpm release` (builds, then `wrangler deploy`; sign in once with
  `pnpm exec wrangler login`).
- From git: connect the repository in the Cloudflare dashboard under Workers & Pages with the
  build command `pnpm build` and the deploy command `npx wrangler deploy`.

CI runs the checks, the tests and the build on every push.
