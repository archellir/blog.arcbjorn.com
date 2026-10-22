# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a personal blog built with Deno Fresh framework - a modern full-stack
web framework for TypeScript/JavaScript. The blog serves programming-focused
content including LeetCode solutions, system administration tutorials, and
technical explorations.

## Development Commands

### Core Development

- `deno task dev` - Start development server (Vite + HMR)
- `deno task build` - Build the project for production
- `deno task start` - Serve the production build

### Testing

- `deno task test` - Run all tests with proper permissions
- `deno test --allow-read --allow-env` - Run tests directly with manual
  permissions
- `deno task check` - Format, lint, and type check
- Tests use Deno's built-in testing framework with BDD-style describe/it blocks

### Dependency Management

- `deno run -A -r jsr:@fresh/update .` - Update Fresh framework and dependencies

## Architecture

### Tech Stack

- **Runtime**: Deno (modern TypeScript/JavaScript runtime)
- **Framework**: Fresh (Deno's full-stack web framework)
- **UI**: Preact (lightweight React alternative)
- **Styling**: Tailwind CSS
- **Content**: Markdown files with frontmatter metadata
- **Rendering**: Server-side rendering with islands architecture

### Directory Structure

- `routes/` - File-based routing (Fresh convention)
  - `_app.tsx` - HTML skeleton: theme-init script, inlined font faces, preloads,
    analytics
  - `index.tsx` - Homepage with the paginated, tag-filterable post list
  - `[id].tsx` - Post pages; throws `HttpError(404)` for unknown ids
  - `_error.tsx` - One error page for 404s and failures, rendered with the real
    status
  - `posts.ts` - JSON endpoint for the next page of posts
  - `rss.ts`, `sitemap.xml.ts` - Feeds
- `islands/` - Client-side interactive components (Fresh islands)
  - `ThemeToggle.tsx` - Light/dark switch in the header
  - `PostIndex.tsx` - Posts grouped by year plus the "More posts" control
  - `PostEnhancer.tsx` - Copy buttons and lazy, theme-aware mermaid
- `components/` - Preact components (server-rendered)
  - `Shell.tsx` - One centred column: header (wordmark, theme toggle), the page,
    footer
  - `HomeIntro.tsx`, `PostHeader.tsx`, `PageIntro.tsx` - The head of a page
  - `Topics.tsx` (page nav with counts), `PostRow.tsx`, `PostNav.tsx`,
    `RelatedPosts.tsx`, `Footer.tsx`
- `api/` - Data access and rendering (`listPosts`, `loadPost`, `renderMarkdown`)
- `data/posts/` - Markdown blog posts with frontmatter
- `static/` - Static assets (self-hosted woff2 fonts, images)
- `assets/` - Stylesheets, bundled via Vite from `client.ts`; `styles.css`
  imports Tailwind v4 and one file per concern (`base`, `layout`, `intro`,
  `index`, `article`, `code`). `base.css` holds the palette, the type scale
  (`--text-*`, `--tracking-caps`) and the column tokens
- `utils/` - Dates, tags, topics, reading time, headings, theme and font
  constants, URL parsing

### Key Architecture Patterns

**Islands Architecture**: Fresh uses islands of interactivity - most components
render server-side, with selective client-side hydration for interactive
components in `islands/`.

**File-based Post System**: Blog posts are stored as Markdown files in
`data/posts/` with YAML frontmatter containing metadata (title, published_at,
snippet, tags). The system reads these files at runtime.

**Post Loading Pipeline**:

1. `api/loadPost.ts` - Loads individual posts from filesystem, extracts
   frontmatter
2. `api/listPosts.ts` - Loads every `.md` file, sorts by date, filters by tags
   and paginates; returns summaries without the body
3. `api/renderMarkdown.ts` - Renders a post with a custom deno-gfm renderer:
   Prism highlighting at render time (`.codeBlock[data-lang]`), mermaid fences
   left as `pre.mermaid` for the client, heading permalinks, wrapped tables,
   external links in a new tab. Posts are first-party, so the HTML is not
   sanitized.

**Tag System**: Tags are free-form strings in frontmatter. `?tags=a,b` filters
the list (exact, case-insensitive). `utils/topics.ts` defines the nav topics,
each a group of tags.

**Shell and Theme**: `components/Shell.tsx` is one centred column, `--column`
wide with `--gutter` at the sides, in the visual language of arcbjorn.com:
wordmark, site links and theme toggle on top, the page, a footer line. The home
page is the intro, a row of topics with post counts, then the posts grouped by
year with the day in a column of its own. A post page is its header (title,
date, reading time, tags, snippet, contents) and the prose. The palette lives in
`assets/base.css` as `--bg`, `--color`, `--focusColor` (orange), `--titleColor`
(teal), with `--mutedColor`, `--lineColor` and `--surface` derived via
`color-mix`. The theme class (`dark`/`light`) is set on `<html>` by the inline
script in `utils/theme.ts` before paint; without a stored choice the system
preference and then the time of day decide. IBM Plex Mono is the only text face,
self-hosted from `static/fonts/` and declared in `utils/fonts.ts`.

## Content Management

### Adding New Posts

1. Create new `.md` file in `data/posts/` directory
2. Include required frontmatter:
   ```yaml
   ---
   title: "Post Title"
   published_at: "2024-01-01"
   snippet: "Brief description"
   tags: ["leetcode", "go"]  # optional
   image: "/images/posts/my-post-banner.png"  # optional - for social media previews
   ---
   ```
3. No registry step needed; routes are resolved dynamically.

### Adding Images to Posts

- **For social media preview images**:
  - Place images in `/static/images/posts/` directory
  - Use relative path in frontmatter: `image: "/images/posts/my-banner.png"`
  - Recommended size: 1200x630 pixels for optimal display
  - Supports both local paths (`/images/...`) and external URLs (`https://...`)
- **Default image**: If no image is specified, uses
  `/static/images/og-default.png`

### Post Metadata

- Posts support math rendering (KaTeX); its stylesheet is included only on pages
  that use it
- Syntax highlighting at render time for Go, TypeScript, JavaScript, Python,
  Bash, YAML, Zig, SQL, C, C++, Rust, TOML, JSON, Java and Dockerfiles; add a
  language by importing its Prism component in `api/renderMarkdown.ts`
- Mermaid diagrams in `` ```mermaid `` fences; the library loads from the CDN
  only on posts that have one and redraws on theme change
- Posts escape `$` in code as `\$` so the math pass leaves it alone; the
  renderer shows the bare `$`
- GitHub Flavored Markdown rendering

## Development Notes

### Fresh Framework Specifics

- Uses JSR imports for Fresh core (`jsr:@fresh/core`) and `fresh/runtime`
- Routes use `define.page` and `define.handlers` (v2 API)
- Components are functional Preact components
- Tailwind v4 via `@tailwindcss/vite`; styles loaded from `client.ts`. The
  design is plain CSS with semantic class names; Tailwind provides the reset
- There is no `_layout.tsx`: each route renders `Shell` around its own content

### Performance Optimizations

- Static asset caching middleware for fonts
- Pagination system loads posts in sets of 10 (`POSTS_SET_NUMBER`)
- Concurrent post loading using `Promise.all()`
- Lists and the JSON endpoint carry post summaries, never bodies
- Fonts are preloaded and declared inline; no third-party font requests

### SEO Features

- Dynamic meta tags based on post content (see `components/HeadElement.tsx`)
- RSS feed generation at `/rss` endpoint

## Git Conventions

**Commit Messages**: Use conventional commits format without Co-Authored-By or
other metadata:

- `feat: add new feature`
- `fix: resolve bug in component`
- `refactor: restructure API layer`
- `chore: update dependencies`
- `docs: update documentation`

Follow the existing commit style seen in the repository history.

## Headers

`main.ts` sets the security headers, among them a Content Security Policy
that names the only third parties the site uses: the analytics host and the
CDN that serves mermaid and the KaTeX fonts. A new external script, font or
image host must be added there, or the browser blocks it. Pages and the posts
JSON carry edge cache headers.

## Error Handling

`routes/_error.tsx` renders every error inside the shell. Fresh passes the
thrown error as `ctx.error`; an `HttpError` keeps its status (404 for unknown
paths and post ids), anything else is a 500. `main.ts` registers no plain
`notFound`/`onError` handlers so the page is always used.

## Common Development Patterns

When adding new features:

1. Check existing patterns in `routes/` and `components/` directories
2. Follow Fresh conventions for handlers and components
3. Use TypeScript interfaces defined in `types.ts`
4. Maintain the islands architecture - keep interactivity minimal and isolated
5. Reference static assets by absolute paths (e.g., `/images/...`)
6. Guard client-side code with `IS_BROWSER` checks when needed
7. Test new API functions and utilities in `tests/api_test.ts`
8. Use the palette variables, never literal colours, so both themes follow;
   sizes below the body size come from the `--text-*` scale

The codebase follows functional programming patterns with TypeScript,
emphasizing immutability and pure functions where possible.
