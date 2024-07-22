import { FreshContext } from "$fresh/server.ts";
import { parse } from "https://esm.sh/accept-language-parser@1.5.0";
import { IState } from "../types.ts";

export function handler(req: Request, ctx: FreshContext<IState>) {
  ctx.state.locales = [];
  const langs = parse(req.headers.get("accept-language") || undefined);

  for (const lang of langs) {
    let locale = lang.code;
    if (lang.region) {
      locale += `-${lang.region}`;
      ctx.state.locales.push(locale);
    }
  }

  if (ctx.state.locales.length === 0) {
    ctx.state.locales.push("en");
  }

  return ctx.next();
}
