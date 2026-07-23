import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  type = 'website',
  ogImage,
  jsonLd
}) => {
  const fullTitle = `${title} | Creativos Espacios - Infraestructura Modular`;
  const siteUrl = 'https://www.creativosespacios.mx';

  return (
    <Helmet>
      {/* Estándar SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical ? `${siteUrl}${canonical}` : `${siteUrl}/`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* JSON-LD para Google y LLMs */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
