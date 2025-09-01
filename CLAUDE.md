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

- `deno task start` - Start development server with hot reloading
- `deno task build` - Build the project for production
- `deno task preview` - Run production build locally

### Testing

- `deno task test` - Run all tests with proper permissions
- `deno test --allow-read --allow-env` - Run tests directly with manual
  permissions
- `deno task check` - Type check all TypeScript files
- `deno task ok` - Alias for check command
- Tests use Deno's built-in testing framework with BDD-style describe/it blocks

### Dependency Management

- `deno run -A -r https://fresh.deno.dev/update .` - Update Fresh framework and
  dependencies

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
  - `index.tsx` - Homepage with paginated post list
  - `[id].tsx` - Dynamic blog post pages
  - `posts.ts` - API endpoint for post data
- `islands/` - Client-side interactive components (Fresh islands)
- `components/` - Server-side React components
- `api/` - Data access layer for posts
- `data/posts/` - Markdown blog posts with frontmatter
- `static/` - Static assets (CSS, fonts, images)
- `utils/` - Utility functions for URL parsing and pagination

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
2. `api/listPosts.ts` - Loads all posts, sorts by date, handles pagination and
   tag filtering
3. Posts are cached in memory and sorted by publication date (newest first)

**Tag System**: Posts can have tags (linux, leetcode, advent) defined in
frontmatter for categorization and filtering.

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
3. Add post URL to `POST_URL_NAMES` array in `constants.ts` for SEO plugin

### Adding Images to Posts

- **For social media preview images**:
  - Place images in `/static/images/posts/` directory
  - Use relative path in frontmatter: `image: "/images/posts/my-banner.png"`
  - Recommended size: 1200x630 pixels for optimal display
  - Supports both local paths (`/images/...`) and external URLs (`https://...`)
- **Default image**: If no image is specified, uses
  `/static/images/og-default.png`

### Post Metadata

- Posts support math rendering (KaTeX)
- Syntax highlighting for multiple languages (Go, TypeScript, C/C++, Python)
- GitHub Flavored Markdown rendering

## Development Notes

### Fresh Framework Specifics

- Uses JSR imports for Fresh core (`jsr:@fresh/core`)
- Handlers export `GET` functions for server-side logic
- Components are functional Preact components
- Tailwind CSS config in `tailwind.config.ts` for styling

### Performance Optimizations

- Static asset caching middleware for fonts and images
- Uses `asset()` function for cache-friendly asset URLs
- Pagination system loads posts in sets of 6 (`POSTS_SET_NUMBER`)
- Concurrent post loading using `Promise.all()`
- Proper HTML structure in `_app.tsx` for SEO and performance

### SEO Features

- Uses `fresh_seo` plugin for metadata generation
- Dynamic meta tags based on post content
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

## Error Handling

The project includes proper error pages:

- `routes/_404.tsx` - Custom 404 Not Found page
- `routes/_500.tsx` - Custom 500 Internal Server Error page
- Both pages maintain the site's design consistency

## Common Development Patterns

When adding new features:

1. Check existing patterns in `routes/` and `components/` directories
2. Follow Fresh conventions for handlers and components
3. Use TypeScript interfaces defined in `types.ts`
4. Maintain the islands architecture - keep interactivity minimal and isolated
5. Use `asset()` function for static assets to enable proper caching
6. Guard client-side code with `IS_BROWSER` checks when needed
7. Test new API functions in `tests/api_test.ts`

The codebase follows functional programming patterns with TypeScript,
emphasizing immutability and pure functions where possible.
