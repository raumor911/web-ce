/**
 * Normalizes HTML coming from WordPress so it can receive editorial styling.
 * Regex based on purpose: it must also run in Node (prerender) without a DOM.
 */
export function formatArticleHtml(html: string): string {
  if (!html) return '';

  let out = html
    // strip scripts/styles/inline styles & legacy attributes from the editor
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/\s(style|class|align|width|height)="[^"]*"(?=[^>]*>)/gi, (m, attr) =>
      attr.toLowerCase() === 'width' || attr.toLowerCase() === 'height' ? '' : ''
    )
    // wp comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // nbsp and empty paragraphs
    .replace(/&nbsp;| /g, ' ')
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '')
    // headings h1 inside body -> h2 (page already has an h1)
    .replace(/<h1(\s[^>]*)?>/gi, '<h2>')
    .replace(/<\/h1>/gi, '</h2>');

  // Lazy images
  out = out.replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"');

  // External links open safely in a new tab
  out = out.replace(/<a\s+([^>]*href="https?:\/\/(?!(?:www\.)?creativosespacios\.mx)[^"]*"[^>]*)>/gi, (m, attrs) =>
    /target=/.test(attrs) ? m : `<a ${attrs} target="_blank" rel="noopener noreferrer">`
  );

  // Wrap tables for horizontal scroll on mobile
  out = out
    .replace(/<table/gi, '<div class="article-table"><table')
    .replace(/<\/table>/gi, '</table></div>');

  // Standalone "Publicado por ..." line -> byline style
  out = out.replace(/<p>\s*(Publicado por[\s\S]*?)<\/p>/i, '<p class="article-byline">$1</p>');

  // "Respuesta rápida" section -> callout (heading + following block until next heading)
  out = out.replace(
    /<h2>\s*(Respuesta r(?:á|a)pida)\s*<\/h2>([\s\S]*?)(?=<h[23]>|$)/i,
    '<aside class="article-callout"><span class="article-callout-label">$1</span>$2</aside>'
  );

  return out.trim();
}
