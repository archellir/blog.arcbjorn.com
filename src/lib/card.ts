import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

import { AUTHOR, SITE_URL } from './site';

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

async function font(weight: 400 | 500 | 700) {
  const path = require.resolve(
    `@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${weight}-normal.woff`
  );
  return { name: 'IBM Plex Mono', weight, style: 'normal' as const, data: await readFile(path) };
}

const fonts = Promise.all([font(400), font(500), font(700)]);

export interface CardContent {
  title: string;
  // Shown after the title in the muted tone, such as a Leetcode number.
  number?: string;
  // One or two lines under the title: a date and reading time, or a summary.
  line: string;
}

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

// The card as SVG, before rasterising; also what the tests look at.
export async function renderCardSvg({ title, number, line }: CardContent): Promise<string> {
  // Satori adds padding outside a box's width, so the canvas-sized root has
  // none; the inner frame takes the margins instead and stays within it.
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
        justifyContent: 'space-between',
        marginTop: 64,
        marginRight: 80,
        marginBottom: 56,
        marginLeft: 80,
      },
      [
        box({ display: 'flex', flexDirection: 'column' }, [
          box({ fontSize: 28, fontWeight: 700 }, 'arcbjorn'),
          box(
            {
              marginTop: 44,
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
          box(
            {
              marginTop: 28,
              maxWidth: 980,
              fontSize: 27,
              lineHeight: 1.45,
              color: palette.muted,
              lineClamp: 2,
            },
            line
          ),
        ]),
        box(
          {
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 26,
            borderTop: `3px solid ${palette.accent}`,
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: '0.14em',
          },
          [
            box({}, SITE_URL.replace(/^https?:\/\//, '').toUpperCase()),
            box({}, AUTHOR.toUpperCase()),
          ]
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

export async function renderCard(content: CardContent): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await renderCardSvg(content);
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
  // A copy on a plain ArrayBuffer, which is what a Response accepts.
  const bytes = new Uint8Array(png.byteLength);
  bytes.set(png);
  return bytes;
}
