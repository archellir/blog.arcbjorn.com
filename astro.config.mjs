// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { fileURLToPath } from 'node:url';

// KaTeX ships its stylesheet without font-display, so maths text would stay
// invisible until its fonts arrive. Swap shows the fallback meanwhile.
/** @type {import('vite').Plugin} */
const katexFontDisplay = {
  name: 'katex-font-display',
  enforce: 'pre',
  transform(code, id) {
    if (!/katex[\\/].*\.css(\?|$)/.test(id)) return null;
    return { code: code.replace(/@font-face\{/g, '@font-face{font-display:swap;'), map: null };
  },
};

// Once the pages exist, the script policy gets a hash per inline script.
/** @type {import('astro').AstroIntegration} */
const cspHashes = {
  name: 'csp-hashes',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const { writeScriptHashes } = await import('./scripts/csp-hashes.mjs');
      const hashes = await writeScriptHashes(fileURLToPath(dir));
      logger.info(`script-src carries ${hashes.length} inline script hashes`);
    },
  },
};

// Static site: every page is built ahead of time and served as files.
export default defineConfig({
  site: 'https://blog.arcbjorn.com',
  trailingSlash: 'never',
  integrations: [preact(), cspHashes],
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [katexFontDisplay],
    build: {
      // Fonts and images stay files: the security policy allows no data: fonts.
      assetsInlineLimit: 0,
    },
  },
});
