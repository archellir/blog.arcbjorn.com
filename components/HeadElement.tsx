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
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="blog.arcbjorn.com" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@arcbjorn" />
      <meta name="twitter:creator" content="@arcbjorn" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional SEO */}
      <meta name="author" content="arcbjorn" />
      <meta name="robots" content="index, follow" />
      <meta property="article:author" content="arcbjorn" />
    </Head>
  );
};

export default HeadElement;
