import { FunctionalComponent } from "preact";

export interface StructuredDataProps {
  type: "BlogPosting" | "WebPage" | "Organization";
  data: Record<string, any>;
}

const StructuredData: FunctionalComponent<StructuredDataProps> = (
  { type, data },
) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
