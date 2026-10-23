// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Static site: every page is built ahead of time and served as files.
export default defineConfig({
  site: 'https://blog.arcbjorn.com',
  trailingSlash: 'never',
  integrations: [preact()],
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Fonts and images stay files: the security policy allows no data: fonts.
      assetsInlineLimit: 0,
    },
  },
});
