// IBM Plex Mono is the only text face. The latin weights are inlined and
// preloaded so there is no flash of fallback text; cyrillic and italic load
// on demand.

const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC_RANGE = "U+0400-04FF";

const WEIGHTS = [400, 500, 600, 700] as const;

function fontFace(
  file: string,
  weight: number,
  style: "normal" | "italic",
  display: "block" | "swap",
  range: string,
): string {
  return `@font-face{font-family:'IBM Plex Mono';font-style:${style};font-weight:${weight};font-display:${display};src:url('/fonts/${file}') format('woff2');unicode-range:${range}}`;
}

export const FONT_PRELOADS = WEIGHTS.map((weight) =>
  `/fonts/ibm-plex-mono-latin-${weight}-normal.woff2`
);

export const FONT_FACE_CSS = [
  ...WEIGHTS.map((weight) =>
    fontFace(
      `ibm-plex-mono-latin-${weight}-normal.woff2`,
      weight,
      "normal",
      "block",
      LATIN_RANGE,
    )
  ),
  fontFace(
    "ibm-plex-mono-latin-400-italic.woff2",
    400,
    "italic",
    "swap",
    LATIN_RANGE,
  ),
  ...WEIGHTS.map((weight) =>
    fontFace(
      `ibm-plex-mono-cyrillic-${weight}-normal.woff2`,
      weight,
      "normal",
      "swap",
      CYRILLIC_RANGE,
    )
  ),
].join("");
