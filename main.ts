import { App, cors, csp, csrf, staticFiles, trailingSlashes } from "fresh";
import { define } from "./fresh.ts";
import type { IState } from "./types.ts";

// Initialize app
export const app = new App<IState>();

// Trailing slashes handling (remove trailing slashes)
app.use(trailingSlashes("never"));

// CORS policy
app.use(cors());

// CSRF protection
app.use(csrf());

// Content Security Policy
app.use(csp({
  csp: [
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://analytics.arcbjorn.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://analytics.arcbjorn.com",
  ],
}));

// Serve files from ./static at / and enable Vite client
app.use(staticFiles());

// Cache policy for specific static assets
const staticCacheMiddleware = define.middleware(async (ctx) => {
  const res = await ctx.next();
  const url = new URL(ctx.req.url);

  if (url.pathname.match(/\.(ttf|woff|woff2)$/)) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  if (url.pathname.endsWith("/by-nc-sa.svg")) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return res;
});
app.use(staticCacheMiddleware);

// Locale detection (replaces routes/_middleware.tsx)
const localesMiddleware = define.middleware((ctx) => {
  const header = ctx.req.headers.get("accept-language") || undefined;
  const locales: string[] = [];
  try {
    // lightweight parse to keep compatibility if parser is unavailable
    const parts = (header ?? "").split(",");
    for (const part of parts) {
      const token = part.trim().split(";")[0];
      if (token) locales.push(token);
    }
  } catch (_) {
    // ignore
  }
  if (locales.length === 0) locales.push("en");
  ctx.state.locales = locales;
  return ctx.next();
});
app.use(localesMiddleware);

// Log unexpected errors during SSR/handlers
const errorLogger = define.middleware(async (ctx) => {
  try {
    return await ctx.next();
  } catch (err) {
    console.error("Unhandled error:", err);
    throw err;
  }
});
app.use(errorLogger);

// Security headers middleware
const securityHeaders = define.middleware(async (ctx) => {
  const res = await ctx.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
});
app.use(securityHeaders);

// Performance monitoring middleware
const performanceMiddleware = define.middleware(async (ctx) => {
  const start = Date.now();
  const res = await ctx.next();
  const duration = Date.now() - start;
  res.headers.set("X-Response-Time", `${duration}ms`);
  return res;
});
app.use(performanceMiddleware);

// Global error handler
app.onError("*", (ctx) => {
  console.error(`[Error] ${ctx.error}`);
  return new Response("Internal Server Error", { status: 500 });
});

// Not found handler
app.notFound((_ctx) => {
  return new Response("Not Found", { status: 404 });
});

// Register file-system routes
app.fsRoutes();
