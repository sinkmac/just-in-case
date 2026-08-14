type ArticleJsonLdProps = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
};

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    author: {
      "@type": "Organization",
      name: "AI Scotland Productions",
      url: "https://aiscotlandproductions.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Just In Case",
      url: "https://justincase.scot/",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Just In Case",
      url: "https://justincase.scot/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}