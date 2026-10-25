import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { preloadLinks } from '../scripts/early-hints.mjs';

const page = (sheets: string[]) =>
  `<html><head>${sheets.map(href => `<link rel="stylesheet" href="${href}">`).join('')}` +
  '<link rel="preload" href="/fonts/a.woff2" as="font" type="font/woff2" crossorigin="anonymous">' +
  '</head></html>';

describe('early hints', () => {
  it('preloads the stylesheet every page shares, and the fonts', async () => {
    const dist = await mkdtemp(path.join(tmpdir(), 'dist-'));
    await writeFile(path.join(dist, 'index.html'), page(['/_astro/Base.abc.css']));
    await mkdir(path.join(dist, 'post'));
    await writeFile(
      path.join(dist, 'post', 'index.html'),
      page(['/_astro/katex.def.css', '/_astro/Base.abc.css'])
    );
    expect(await preloadLinks(dist)).toEqual([
      '</_astro/Base.abc.css>; rel=preload; as=style',
      '</fonts/a.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
    ]);
  });
});
