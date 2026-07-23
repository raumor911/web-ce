import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();
  const fullTitle = `${title} | Creativos Espacios - Infraestructura Modular`;
  const siteUrl = 'https://www.creativosespacios.mx';
  
  // Construir la URL canónica basada en el pathname actual o el prop canonical
  const path = canonical || pathname;
  const canonicalUrl = `${siteUrl}${path === '/' ? '' : path.replace(/\/$/, '')}`;

  return (
    <Helmet>
      {/* Estándar SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl || siteUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
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
