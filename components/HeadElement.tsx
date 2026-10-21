import { FunctionalComponent } from "preact";
import { Head } from "fresh/runtime";

import { AUTHOR, AUTHOR_HANDLE, SITE_NAME, SITE_URL } from "../constants.ts";

interface IHeadProps {
  url: URL;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  // ISO date; only for articles.
  publishedAt?: string;
  noindex?: boolean;
}

const HeadElement: FunctionalComponent<IHeadProps> = (props) => {
  const {
    description,
    image,
    title,
    url,
    type = "website",
    publishedAt,
    noindex = false,
  } = props;

  // Canonical URL on the canonical domain; of the query only the tag filter
  // identifies a distinct page.
  const canonical = new URL(url.pathname, SITE_URL);
  const tags = url.searchParams.get("tags");
  if (tags) canonical.searchParams.set("tags", tags);
  const canonicalUrl = canonical.toString();

  // Social scrapers cache images hard; a daily version lets a new banner
  // show up within a day.
  const addCacheBuster = (imageUrl: string) => {
    const separator = imageUrl.includes("?") ? "&" : "?";
    const version = new Date().toISOString().split("T")[0];
    return `${imageUrl}${separator}v=${version}`;
  };

  const cacheBustedImage = image ? addCacheBuster(image) : undefined;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content={AUTHOR} />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow"}
      />

      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {cacheBustedImage && (
        <meta property="og:image" content={cacheBustedImage} />
      )}
      {type === "article" && (
        <meta
          property="article:author"
          content={AUTHOR}
        />
      )}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}

      <meta
        name="twitter:card"
        content={cacheBustedImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:site" content={`@${AUTHOR_HANDLE}`} />
      <meta name="twitter:creator" content={`@${AUTHOR_HANDLE}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {cacheBustedImage && (
        <meta name="twitter:image" content={cacheBustedImage} />
      )}
    </Head>
  );
};

export default HeadElement;
