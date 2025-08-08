import { FunctionalComponent } from "preact";
import { PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

const App: FunctionalComponent<PageProps> = ({ Component }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={asset("/app.css")} />
        <link rel="icon" href={asset("/favicon.ico")} sizes="32x32" />
        
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" as="script" />
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" async></script>
        
        {/* Analytics */}
        <script
          defer
          src="https://analytics.arcbjorn.com/script.js"
          data-website-id="b633e350-4ff3-41d4-803f-13eeaa62e121"
        >
        </script>
      </head>
      <body>
        <div class="container mx-auto h-full animate-appear">
          <Component />
        </div>
      </body>
    </html>
  );
};

export default App;
