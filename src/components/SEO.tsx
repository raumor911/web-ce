import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { getCanonicalUrl } from '../lib/canonical';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
  /** Representación alterna de la misma página (p. ej. Markdown en /ai/). Solo si existe y es 1:1. */
  markdownAlternate?: { path: string; title: string };
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  type = 'website',
  ogImage,
  jsonLd,
  markdownAlternate
}) => {
  const { pathname } = useLocation();
  const fullTitle = `${title} | Creativos Espacios - Infraestructura Modular`;
  const siteUrl = 'https://creativosespacios.mx';
  // social-preview.png ya no está en el repo (404 en producción, verificado 2026-11-23). Sin una imagen
  // social dedicada 1200x630 se usa el logo PNG existente (1536x1024, fondo transparente).
  const defaultOgImage = `${siteUrl}/images/logo-creativos-espacios.png`;
  
  // Construir la URL canónica basada en el pathname actual o el prop canonical usando la lógica centralizada
  const path = canonical || pathname;
  const canonicalUrl = getCanonicalUrl(path);
  const finalOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`) : defaultOgImage;

  return (
    <Helmet>
      {/* Estándar SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {markdownAlternate && (
        <link
          rel="alternate"
          type="text/markdown"
          href={getCanonicalUrl(markdownAlternate.path)}
          title={markdownAlternate.title}
        />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="Creativos Espacios" />
      <meta property="og:locale" content="es_MX" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* JSON-LD para Google y LLMs */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
