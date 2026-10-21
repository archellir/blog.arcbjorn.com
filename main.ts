import {
  App,
  cors,
  csrf,
  HttpError,
  staticFiles,
  trailingSlashes,
} from "fresh";
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

// Locale detection from the Accept-Language header
const localesMiddleware = define.middleware((ctx) => {
  const header = ctx.req.headers.get("accept-language") ?? "";
  const locales = header
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter((token) => token && token !== "*");
  ctx.state.locales = locales.length ? locales : ["en"];
  return ctx.next();
});
app.use(localesMiddleware);

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

// Security headers middleware
const securityHeaders = define.middleware(async (ctx) => {
  const res = await ctx.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
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

// Register file-system routes; routes/_error.tsx handles 404s and failures.
app.fsRoutes();
