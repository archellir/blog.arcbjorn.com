import { FunctionalComponent } from "preact";
import { Head } from "$fresh/runtime.ts";

interface IHeadProps {
  url: URL;
  title: string;
  description: string;
  image?: string;
}

export const HeadElement: FunctionalComponent<IHeadProps> = (props) => {
  const { description, image, title, url } = props;

  return (
    <Head>
      <link rel="stylesheet" href="/app.css" />

      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <meta name="description" content={description} />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url.href} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={url.hostname} />
      <meta property="twitter:url" content={url.href} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <script
        async
        defer
        data-website-id="940d11c2-bcf5-40bf-afcd-039b6f28bc1a"
        src="https://analytics.arcbjorn.com/umami.js"
      >
      </script>
    </Head>
  );
};
