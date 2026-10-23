# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

A personal blog built with Astro as a static site: programming-focused content including
Leetcode solutions, infrastructure notes and technical explorations. Every page is built ahead
of time; Cloudflare Workers serves the files.

## Development Commands

- `pnpm dev` - Astro dev server with HMR
- `pnpm build` - static build into `dist/`
- `pnpm preview` - serve `dist/` with the Workers runtime (`wrangler dev`)
- `pnpm check` - Astro types, TypeScript (`tsc --noEmit`) and Prettier
- `pnpm test` - vitest
- `pnpm format` - Prettier
- `pnpm images` - regenerate the touch icon with headless Chrome
- `pnpm release` - build and `wrangler deploy`

`pnpm check`, `pnpm test` and `pnpm build` must pass; CI runs all three.

## Architecture

### Tech Stack

- **Framework**: Astro 7, static output
- **UI**: Astro components for static markup, Preact 11 for the islands
- **Content**: Markdown in `data/posts/` through an Astro content collection
- **Rendering**: a unified pipeline (remark, rehype) in `src/lib/markdown.ts`
- **Styling**: plain CSS on a palette of variables, no framework
- **Hosting**: Cloudflare Workers static assets (`wrangler.jsonc`)
- **Tooling**: Node 24, pnpm, TypeScript 7, Prettier, vitest

### Directory Structure

- `src/pages/` - File-based routes
  - `index.astro` - Home: the index of every post, grouped by year
  - `topics/[slug].astro` - The index filtered by a topic (`src/lib/topics.ts`)
  - `tags/[tag].astro` - The index filtered by one tag, with a note saying so
  - `[id].astro` - Post pages
  - `404.astro` - Not found, served with a real 404 by the Worker
  - `rss.xml.ts`, `sitemap.xml.ts` - Feeds
- `src/layouts/Base.astro` - The page: head metadata, theme and font setup, header, footer
- `src/components/` - Static Astro components (`Topics`, `PostHeader`, `PostNav`,
  `RelatedPosts`, `IndexNote`, `Footer`, intros) and `Icons.tsx`
- `src/islands/` - Preact islands: `ThemeToggle`, `PostIndex` ("More posts" reveal),
  `PostEnhancer` (copy buttons, lazy Mermaid), `PostRow` (used by the index island and
  statically by `RelatedPosts`)
- `src/lib/` - `markdown.ts`, `posts.ts` (reads the collection), `topics.ts`, `tags.ts`,
  `dates.ts`, `related.ts`, `groupPosts.ts`, `describePost.ts`, `readingTime.ts`,
  `theme.ts`, `fonts.ts`, `site.ts` (constants)
- `src/content.config.ts` - The `posts` collection: `glob` over `data/posts`, front matter
  schema, dates normalised to `YYYY-MM-DD`
- `src/styles/` - `styles.css` imports one file per concern (`base`, `layout`, `intro`,
  `index`, `article`, `code`). `base.css` holds the palette, the type scale (`--text-*`,
  `--tracking-caps`), the column tokens (`--page`, `--column`, `--gutter`) and a small reset
- `public/` - Fonts, images, icons, `robots.txt`, and Cloudflare's `_headers` (security
  headers, cache rules) and `_redirects`
- `tests/` - vitest suites for the pipeline and the library
- `scripts/` - `images.mjs` for the touch icon

### Key Patterns

**Static everything.** Filters are pages, not query strings: `/topics/leetcode`,
`/tags/go`. The index island receives every post of its list and hides the ones past the
first ten until "More posts" reveals them, so the full list is in the HTML.

**Markdown pipeline** (`src/lib/markdown.ts`): remark-gfm and remark-math, then rehype with
KaTeX and the blog's own plugin: content headings start at h2 and never skip a level, each
with a permalink; code highlighted with Prism at build time inside `.codeBlock[data-lang]`;
`mermaid` fences left as `pre.mermaid` for the client; tables wrapped so they scroll;
external links in a new tab; `\$` in code shown as `$`; prices such as `$30/mo ... $40`
kept out of the maths pass. Posts are first-party, so nothing is sanitized. Add a Prism
language by importing its component there.

**Theme.** The class (`dark`/`light`) is set on `<html>` by the inline script from
`src/lib/theme.ts` before paint; without a stored choice the system preference and then the
time of day decide. IBM Plex Mono is the only text face, self-hosted from `public/fonts/`
and declared in `src/lib/fonts.ts`.

**Headers.** `public/_headers` sets the security headers, among them a Content Security
Policy that names the only third party the site uses, the analytics host. Mermaid and the
KaTeX fonts are bundled. A new external script, font or image host must be added there.

**URLs.** No trailing slashes (`trailingSlash: "never"` in Astro, `drop-trailing-slash` in
the Worker). Post URLs are the file names, as before.

## Content Management

Create `data/posts/<id>.md` with front matter `title`, `published_at`, optional `snippet`,
`tags`, `image`, `leetcode_number`. No registry step; the collection picks the file up.
A social card is drawn for every post at build time (`src/lib/card.ts`, served at
`/og/<id>.png`); a post may bring its own with the `image` front matter field.

## Common Development Patterns

1. Keep logic in `src/lib/` as pure functions with tests; pages and endpoints only read the
   collection and call them.
2. Use the palette variables, never literal colours; sizes below the body size come from the
   `--text-*` scale.
3. Keep islands small and few; everything else renders at build time.
4. Reference static assets by absolute paths (`/images/...`).

## Git Conventions

Conventional commits, one goal per commit, subject under 50 characters, no Co-Authored-By or
other metadata.
