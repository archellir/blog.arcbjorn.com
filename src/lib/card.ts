import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

import { longDate } from './dates';
import { readingTime } from './readingTime';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site';
import type { IPost } from './types';

// The social card: the design of the site in a 1200 by 630 image, drawn at
// build time with the site's own face. Satori lays out a small tree of
// styled boxes; resvg turns the result into a PNG.

const WIDTH = 1200;
const HEIGHT = 630;

const palette = {
  bg: '#f9f5ef',
  color: '#1b1d1e',
  muted: '#6b6a67',
  accent: '#f15025',
};

const require = createRequire(import.meta.url);

async function font(weight: 400 | 500) {
  const path = require.resolve(
    `@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${weight}-normal.woff`
  );
  return { name: 'IBM Plex Mono', weight, style: 'normal' as const, data: await readFile(path) };
}

const fonts = Promise.all([font(400), font(500)]);

export interface CardContent {
  title: string;
  // Shown after the title in the muted tone, such as a Leetcode number.
  number?: string;
  // One or two lines at the foot: a date and reading time, or a summary.
  line: string;
}

// The card of a post: its title, its Leetcode number, its date and length.
export function postCard(post: IPost): CardContent {
  return {
    title: post.title,
    number: post.leetcode_number ? `#${post.leetcode_number}` : undefined,
    line: `${longDate(post.publishedAt)} · ${readingTime(post.content)} min read`,
  };
}

// The card of every page that is not a post.
export const SITE_CARD: CardContent = { title: SITE_NAME, line: SITE_DESCRIPTION };

// Title size steps down with length so three lines always suffice.
function titleSize(title: string): number {
  if (title.length <= 24) return 96;
  if (title.length <= 48) return 72;
  if (title.length <= 80) return 56;
  return 46;
}

function box(style: Record<string, unknown>, children: unknown) {
  return { type: 'div', props: { style, children } };
}

async function layOut({ title, number, line }: CardContent): Promise<string> {
  // Satori adds padding outside a box's width, so the canvas-sized root has
  // none; the inner frame takes the margins instead and stays within it.
  // Three rows: the domain, the title in the room between, the line.
  const tree = box(
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      backgroundColor: palette.bg,
      color: palette.color,
      fontFamily: 'IBM Plex Mono',
    },
    box(
      {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 64,
        marginRight: 88,
        marginBottom: 64,
        marginLeft: 88,
      },
      [
        box({ fontSize: 24, color: palette.muted }, SITE_URL.replace(/^https?:\/\//, '')),
        box({ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }, [
          box({ width: 56, height: 4, backgroundColor: palette.accent }, []),
          box(
            {
              marginTop: 28,
              fontSize: titleSize(title),
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              lineClamp: 3,
            },
            number
              ? [
                  title,
                  ' ',
                  {
                    type: 'span',
                    props: { style: { fontWeight: 400, color: palette.muted }, children: number },
                  },
                ]
              : title
          ),
        ]),
        box(
          { maxWidth: 980, fontSize: 26, lineHeight: 1.45, color: palette.muted, lineClamp: 2 },
          line
        ),
      ]
    )
  );

  return satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: await fonts,
  });
}

// Each card is laid out once per build: the page asks for its version, the
// endpoint for the drawing itself.
const drawings = new Map<string, Promise<string>>();

// The card as SVG, before rasterising; also what the tests look at.
export function renderCardSvg(content: CardContent): Promise<string> {
  const key = JSON.stringify(content);
  let svg = drawings.get(key);
  if (!svg) {
    svg = layOut(content);
    drawings.set(key, svg);
  }
  return svg;
}

// Eight hex digits of the drawing's hash. Share sites cache a card by its
// URL, so the version changes the URL exactly when the card itself changes.
export async function cardVersion(content: CardContent): Promise<string> {
  const svg = await renderCardSvg(content);
  return createHash('sha256').update(svg).digest('hex').slice(0, 8);
}

export async function postCardUrl(post: IPost): Promise<string> {
  return `${SITE_URL}/og/${post.id}.png?v=${await cardVersion(postCard(post))}`;
}

export async function siteCardUrl(): Promise<string> {
  return `${SITE_URL}/og/default.png?v=${await cardVersion(SITE_CARD)}`;
}

export async function renderCard(content: CardContent): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await renderCardSvg(content);
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
  // A copy on a plain ArrayBuffer, which is what a Response accepts.
  const bytes = new Uint8Array(png.byteLength);
  bytes.set(png);
  return bytes;
}
