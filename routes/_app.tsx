import { define } from "../fresh.ts";
import { asset, Partial } from "fresh/runtime";

import { FONT_FACE_CSS, FONT_PRELOADS } from "../utils/fonts.ts";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "../utils/theme.ts";
import { SITE_NAME } from "../constants.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={THEME_COLORS.light} />
        {/* Theme before paint, fonts before the stylesheet asks for them. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
        {FONT_PRELOADS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossorigin="anonymous"
          />
        ))}
        <link rel="icon" href={asset("/favicon.ico")} sizes="32x32" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} RSS`}
          href="/rss"
        />

        <script
          defer
          src="https://analytics.arcbjorn.com/t.js"
          data-website-id="98f9ce97-6559-4cf5-90e2-3b059c58bb1a"
        />
      </head>
      <body f-client-nav>
        <Partial name="body">
          <Component />
        </Partial>
      </body>
    </html>
  );
});
