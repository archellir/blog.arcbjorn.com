// After the build, give the headers file a Link header naming the stylesheet
// and the fonts every page preloads. With Early Hints on for the zone, the
// edge replays it as a 103 ahead of the page, so a browser starts on both
// while the HTML is still on its way. The stylesheet's name carries a hash
// and changes with the build, hence a step after it.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { htmlFiles } from './csp-hashes.mjs';

const STYLESHEET = /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g;
const FONT = /<link rel="preload" href="([^"]+)" as="font"/g;

// The stylesheets present on every page, then the fonts, as Link values.
export async function preloadLinks(dist) {
  let shared;
  let fonts = [];
  for (const file of await htmlFiles(dist)) {
    const html = await readFile(file, 'utf8');
    const sheets = new Set([...html.matchAll(STYLESHEET)].map(match => match[1]));
    shared = shared ? new Set([...shared].filter(sheet => sheets.has(sheet))) : sheets;
    if (fonts.length === 0) fonts = [...html.matchAll(FONT)].map(match => match[1]);
  }
  return [
    ...[...(shared ?? [])].map(href => `<${href}>; rel=preload; as=style`),
    ...fonts.map(href => `<${href}>; rel=preload; as=font; type=font/woff2; crossorigin`),
  ];
}

export async function writeLinkHeader(dist) {
  const links = await preloadLinks(dist);
  if (links.length === 0) return links;
  const file = path.join(dist, '_headers');
  const headers = await readFile(file, 'utf8');
  const updated = headers.replace(
    /^(  Content-Security-Policy: .*)$/m,
    policy => `${policy}\n  Link: ${links.join(', ')}`
  );
  if (updated === headers) throw new Error('_headers has no Content-Security-Policy line');
  await writeFile(file, updated);
  return links;
}
