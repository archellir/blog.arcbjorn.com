import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      fontFamily: {
        "plex-mono": ["IBMPlexMono", "Courier New", "Courier", "monospace"],
        "plex-sans": ["IBMPlexSans", "sans-serif", "sans"],
      },

      animation: {
        appear: "fadeIn 0.5s ease-in-out",
      },

      // that is actual animation
      keyframes: () => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
      }),
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
