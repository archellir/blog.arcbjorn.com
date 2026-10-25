// After the build, replace 'unsafe-inline' in the script policy of the
// headers file with a hash of every inline script the pages carry. Astro's
// island loaders and the two scripts of our own are the same on every build,
// so the hashes are stable and no inline script outside the build can run.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Code-unit order, the same on every machine and locale.
const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const INLINE_SCRIPT =
  /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

export async function hashInlineScripts(dist) {
  const hashes = new Set();
  for (const file of await htmlFiles(dist)) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(INLINE_SCRIPT)) {
      hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
    }
  }
  return [...hashes].sort(byCodeUnit);
}

export async function writeScriptHashes(dist) {
  const hashes = await hashInlineScripts(dist);
  if (hashes.length === 0) return hashes;
  const file = path.join(dist, '_headers');
  const headers = await readFile(file, 'utf8');
  const updated = headers.replace(
    /(script-src [^;]*?)'unsafe-inline'/,
    (_match, before) => `${before}${hashes.join(' ')}`
  );
  if (updated === headers)
    throw new Error("_headers has no 'unsafe-inline' in script-src to replace");
  await writeFile(file, updated);
  return hashes;
}
