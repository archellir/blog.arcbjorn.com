# Thoughtbook

The blog at [blog.arcbjorn.com](https://blog.arcbjorn.com): notes on systems,
algorithms, infrastructure, security, blockchain and AI tooling, next to
Leetcode solutions in Go, TypeScript, Python and C++.

Built with [Fresh](https://fresh.deno.dev) on Deno, rendered on the server with
a few Preact islands, styled after [arcbjorn.com](https://arcbjorn.com).

## Develop

```sh
deno task dev     # Vite dev server with HMR at http://localhost:5173
deno task check   # format, lint and type-check
deno task test    # unit tests
deno task build   # production build into _fresh/
deno task start   # serve the production build on :8000
```

Tailwind v4 needs its native binary once; if the dev server complains about
oxide, run `deno task oxide`. `NO_TAILWIND=1 deno task dev` skips it.

## Write

Posts are Markdown files in `data/posts/` with front matter:

```yaml
---
title: "Post title"
published_at: "2026-07-04"
snippet: "One line under the title in the index and in previews."
tags: ["ai", "agents"]            # optional; Leetcode posts also set leetcode_number
image: "/images/posts/banner.png" # optional social preview, 1200x630
---
```

The file name is the URL. Code fences are highlighted at render time, `mermaid`
fences become diagrams, and `$` inside code is written as `\$`.

## Layout

- `routes/` pages and endpoints: the index, `[id]` for posts, `rss`,
  `sitemap.xml`, the error page
- `components/` server-rendered Preact; `islands/` the interactive parts
- `api/` reading and rendering posts; `utils/` dates, tags, topics
- `assets/` the stylesheets, one per concern, on the palette in `base.css`
- `static/` fonts and images

## Deploy

`docker compose up --build` builds and serves the site on port 8000. The
production site runs on Deno Deploy from the `master` branch.
