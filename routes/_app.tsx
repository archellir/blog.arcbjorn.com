import { define } from "../fresh.ts";
import { asset, Partial } from "fresh/runtime";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thoughtbook</title>
        <meta name="theme-color" content="#1b1d1e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={asset("/favicon.ico")} sizes="32x32" />

        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
          as="script"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
          async
        />

        <script
          defer
          src="https://analytics.arcbjorn.com/t.js"
          data-website-id="98f9ce97-6559-4cf5-90e2-3b059c58bb1a"
        />

      </head>
      <body f-client-nav>
        <div class="container mx-auto h-full animate-appear">
          <Partial name="body">
            <Component />
          </Partial>
        </div>
      </body>
    </html>
  );
});
