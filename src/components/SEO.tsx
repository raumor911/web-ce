import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
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
  const logoImage = `${siteUrl}/images/logo-creativos-espacios.png`;
  const socialPreview = `${siteUrl}/images/social-preview.png`;
  
  // Construir la URL canónica basada en el pathname actual o el prop canonical
  const path = canonical || pathname;
  const canonicalUrl = `${siteUrl}${path === '/' ? '' : path.replace(/\/$/, '')}`;
  
  // Prioridad de imagen: ogImage prop > social-preview.png > logo fallback
  let finalOgImage = socialPreview;
  if (ogImage) {
    finalOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  }

  // Normalizar jsonLd a un array si no lo es
  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : (jsonLd ? [jsonLd] : []);

  return (
    <Helmet>
      {/* Estándar SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

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
      {jsonLdArray.map((ld, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};
