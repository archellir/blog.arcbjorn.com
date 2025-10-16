import { define } from "../fresh.ts";
import type { FreshContext } from "fresh";
import type { IState } from "../types.ts";

export const handler = [
  // Redirect www to non-www
  async (ctx: FreshContext<IState>) => {
    const url = new URL(ctx.req.url);

    if (url.hostname.startsWith("www.")) {
      const newUrl = new URL(url);
      newUrl.hostname = url.hostname.replace(/^www\./, "");

      return new Response(null, {
        status: 301,
        headers: { Location: newUrl.toString() },
      });
    }

    return await ctx.next();
  },
];
