import { App, csrf, HttpError, staticFiles, trailingSlashes } from "fresh";
import { define } from "./fresh.ts";
import type { IState } from "./types.ts";

// Initialize app
export const app = new App<IState>();

// Trailing slashes handling (remove trailing slashes)
app.use(trailingSlashes("never"));

// CSRF protection
app.use(csrf());

// Serve files from ./static at / and enable Vite client
app.use(staticFiles());

// Cache policy for specific static assets
const staticCacheMiddleware = define.middleware(async (ctx) => {
  const res = await ctx.next();
  const url = new URL(ctx.req.url);

  if (url.pathname.match(/\.(ttf|woff|woff2)$/)) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return res;
});
app.use(staticCacheMiddleware);

// Log unexpected errors during SSR/handlers; expected HTTP errors (404s)
// pass through to the error page quietly.
const errorLogger = define.middleware(async (ctx) => {
  try {
    return await ctx.next();
  } catch (err) {
    if (!(err instanceof HttpError)) {
      console.error("Unhandled error:", err);
    }
    throw err;
  }
});
app.use(errorLogger);

// Pages and the posts JSON are the same for every reader: the edge may keep
// them for ten minutes and serve stale copies while it refreshes.
const edgeCache = define.middleware(async (ctx) => {
  const res = await ctx.next();
  if (ctx.req.method !== "GET" || res.status !== 200) return res;
  if (res.headers.has("Cache-Control")) return res;
  const type = res.headers.get("Content-Type") ?? "";
  if (type.startsWith("text/html") || type.startsWith("application/json")) {
    res.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    );
  }
  return res;
});
app.use(edgeCache);

// Security headers. The policy names every third party the site touches:
// the analytics script and the CDN that serves mermaid and the KaTeX fonts.
// Inline scripts stay allowed because Fresh hydrates islands with one, and
// the theme is set by an inline script before paint.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://analytics.arcbjorn.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://cdn.jsdelivr.net",
  "img-src 'self' data: https:",
  "connect-src 'self' https://analytics.arcbjorn.com https://cdn.jsdelivr.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = define.middleware(async (ctx) => {
  const res = await ctx.next();
  const secure = ctx.url.protocol === "https:";
  res.headers.set(
    "Content-Security-Policy",
    secure
      ? `${CONTENT_SECURITY_POLICY}; upgrade-insecure-requests`
      : CONTENT_SECURITY_POLICY,
  );
  if (secure) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
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

// Register file-system routes; routes/_error.tsx handles 404s and failures.
app.fsRoutes();
