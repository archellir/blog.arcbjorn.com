import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      fontFamily: {
        "plex-mono": ["IBMPlexMono", "Courier New", "Courier", "monospace"],
        "plex-sans": ["IBMPlexSans", "sans-serif", "sans"],
      },
    },
  },
  preflight: {
    "@font-face": [
      {
        fontFamily: "IBMPlexMono",
        src: "url(/fonts/IBMPlexMono-Regular.ttf)",
        fontWeight: "normal",
        fontDisplay: "swap",
      },
      {
        fontFamily: "IBMPlexMono",
        src: "url(/fonts/IBMPlexMono-Bold.ttf)",
        fontWeight: "bold",
        fontDisplay: "swap",
      },
      {
        fontFamily: "IBMPlexMono",
        src: "url(/fonts/IBMPlexMono-SemiBold.ttf)",
        fontWeight: "600",
        fontDisplay: "swap",
      },
      {
        fontFamily: "IBMPlexSans",
        src: "url(/fonts/IBMPlexSans-Regular.ttf)",
        fontWeight: "normal",
        fontDisplay: "swap",
      },
      {
        fontFamily: "IBMPlexSans",
        src: "url(/fonts/IBMPlexSans-Bold.ttf)",
        fontWeight: "bold",
        fontDisplay: "swap",
      },
      {
        fontFamily: "IBMPlexSans",
        src: "url(/fonts/IBMPlexSans-SemiBold.ttf)",
        fontWeight: "600",
        fontDisplay: "swap",
      },
    ],
  },
} as Options;
