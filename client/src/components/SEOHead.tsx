import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "/images/botler-logo-full.png",
  ogType = "website",
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = `${title} | Botler 360`;
  const siteUrl = "https://botler360.com";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="Botler 360" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
