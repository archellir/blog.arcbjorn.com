import { FunctionalComponent } from "preact";
import { PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

const App: FunctionalComponent<PageProps> = ({ Component }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={asset("/app.css")} />
        <link rel="icon" href={asset("/favicon.ico")} sizes="32x32" />
        
        {/* Analytics */}
        <script
          async
          defer
          data-website-id="940d11c2-bcf5-40bf-afcd-039b6f28bc1a"
          src="https://analytics.arcbjorn.com/umami.js"
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
