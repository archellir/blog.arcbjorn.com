import { define } from "../fresh.ts";

// Redirect www to non-www
export const handler = define.middleware((ctx) => {
  const url = new URL(ctx.req.url);

  if (url.hostname.startsWith("www.")) {
    const newUrl = new URL(url);
    newUrl.hostname = url.hostname.replace(/^www\./, "");

    return new Response(null, {
      status: 301,
      headers: { Location: newUrl.toString() },
    });
  }

  return ctx.next();
});
