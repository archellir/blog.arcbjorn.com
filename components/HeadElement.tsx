import { FunctionalComponent } from "preact";
import { Head } from "fresh/runtime";

const CANONICAL_DOMAIN = "https://blog.arcbjorn.com";

interface IHeadProps {
  url: URL;
  title: string;
  description: string;
  image?: string;
}

const HeadElement: FunctionalComponent<IHeadProps> = (props) => {
  const { description, image, title, url } = props;

  // Build canonical URL using the canonical domain
  const canonicalUrl = `${CANONICAL_DOMAIN}${url.pathname}${url.search}`;

  // Add cache-busting parameter to images
  const addCacheBuster = (imageUrl: string) => {
    if (!imageUrl) return imageUrl;
    const separator = imageUrl.includes("?") ? "&" : "?";
    const version = new Date().toISOString().split("T")[0]; // Use date as version
    return `${imageUrl}${separator}v=${version}`;
  };

  const cacheBustedImage = image ? addCacheBuster(image) : undefined;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {cacheBustedImage && (
        <meta property="og:image" content={cacheBustedImage} />
      )}
      <meta property="og:site_name" content="blog.arcbjorn.com" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@arcbjorn" />
      <meta name="twitter:creator" content="@arcbjorn" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {cacheBustedImage && (
        <meta name="twitter:image" content={cacheBustedImage} />
      )}

      {/* Additional SEO */}
      <meta name="author" content="arcbjorn" />
      <meta name="robots" content="index, follow" />
      <meta property="article:author" content="arcbjorn" />
      <meta name="theme-color" content="#1b1d1e" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/rss"
      />
    </Head>
  );
};

export default HeadElement;
