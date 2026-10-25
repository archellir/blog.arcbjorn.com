# Repository Guidelines

## Project Structure & Module Organization

- `src/pages/` Astro routes (index, `topics/[slug]`, `tags/[tag]`, `[id]`, `404`, feeds).
- `src/layouts/` the page shell; `src/components/` static Astro components;
  `src/islands/` Preact islands only.
- `src/lib/` the Markdown pipeline and pure helpers; `src/content.config.ts` the post
  collection.
- `data/posts/` Markdown sources with front matter. `public/` static assets and the
  Cloudflare `_headers` and `_redirects`.
- `src/styles/` stylesheets, one file per concern, on the palette in `base.css`.
- `dist/` is the build output - do not edit.
- `tests/` vitest suites.

## Build, Test, and Development Commands

- `pnpm dev` - run locally with HMR.
- `pnpm build` - build the static site into `dist/`.
- `pnpm preview` - serve the build with the Workers runtime.
- `pnpm test` - run vitest.
- `pnpm check` - type-check, lint (oxlint, type-aware) and format check.
- `pnpm outdated` - list dependencies with newer versions.

## Coding Style & Naming Conventions

- Language: TypeScript (TS/TSX) and Astro components. Avoid `any`; prefer explicit types.
- Formatting: Prettier (`pnpm format`); single quotes, 100 columns.
- Files: components in PascalCase (`PostHeader.astro`); routes use Astro's path names.
- Symbols: camelCase for functions and variables; UPPER_SNAKE_CASE for constants.
- Imports: packages from npm; nothing from a CDN at runtime except the analytics script.

## Testing Guidelines

- Framework: vitest. Location: `tests/`.
- Scope: cover `src/lib/` helpers and the Markdown pipeline (happy paths and edge cases).
- Run: `pnpm test`, and make sure `pnpm check` and `pnpm build` pass before pushing.

## Commit & Pull Request Guidelines

- Conventional Commits; one focused change per commit; subject under 50 characters.
  - Examples: `feat: related posts by shared tags`, `fix: title wrapping in firefox`.
- PRs: clear description, before/after screenshots for UI changes, notes on tests.

## Security & Configuration Tips

- Never commit secrets; the site needs no environment variables.
- Security headers live in `public/_headers`; keep the Content Security Policy in mind when
  adding anything external.
