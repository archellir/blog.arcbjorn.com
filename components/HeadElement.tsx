import { FunctionalComponent } from "preact";
import { Head } from "$fresh/runtime.ts";

interface IHeadProps {
  url: URL;
  title: string;
  description: string;
  image?: string;
}

const HeadElement: FunctionalComponent<IHeadProps> = (props) => {
  const { description, image, title, url } = props;

  // Add cache-busting parameter to images
  const addCacheBuster = (imageUrl: string) => {
    if (!imageUrl) return imageUrl;
    const separator = imageUrl.includes('?') ? '&' : '?';
    const version = new Date().toISOString().split('T')[0]; // Use date as version
    return `${imageUrl}${separator}v=${version}`;
  };

  const cacheBustedImage = image ? addCacheBuster(image) : undefined;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url.href} />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url.href} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {cacheBustedImage && <meta property="og:image" content={cacheBustedImage} />}
      <meta property="og:site_name" content="blog.arcbjorn.com" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@arcbjorn" />
      <meta name="twitter:creator" content="@arcbjorn" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {cacheBustedImage && <meta name="twitter:image" content={cacheBustedImage} />}
      
      {/* Additional SEO */}
      <meta name="author" content="arcbjorn" />
      <meta name="robots" content="index, follow" />
      <meta property="article:author" content="arcbjorn" />
    </Head>
  );
};

export default HeadElement;
