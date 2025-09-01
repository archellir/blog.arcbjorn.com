/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { freshSEOPlugin } from "https://deno.land/x/fresh_seo@1.0.1/mod.ts";
import { FreshContext } from "$fresh/server.ts";
import { POST_URL_NAMES } from "./constants.ts";

const staticCacheMiddleware = {
  name: "staticCacheMiddleware",
  middlewares: [
    {
      path: "/",
      middleware: {
        handler: async (req: Request, ctx: FreshContext) => {
          const res = await ctx.next();
          const url = new URL(req.url);

          // Cache fonts
          if (url.pathname.match(/\.(ttf|woff|woff2)$/)) {
            res.headers.set(
              "Cache-Control",
              "public, max-age=31536000, immutable",
            );
          }

          // Cache Creative Commons image
          if (url.pathname.endsWith("/by-nc-sa.svg")) {
            res.headers.set(
              "Cache-Control",
              "public, max-age=31536000, immutable",
            );
          }

          return res;
        },
      },
    },
  ],
};

// Merge starter config plugins (Tailwind) with project plugins
await start(manifest, {
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    staticCacheMiddleware,
    freshSEOPlugin(manifest, {
      include: POST_URL_NAMES,
    }),
  ],
});
