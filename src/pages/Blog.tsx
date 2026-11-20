import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { getPosts, getTags, WordPressPost, WordPressTag } from '../services/wordpress';

const PAGE_SIZE = 12;
const PRIMARY_TAGS = 8;
const MIN_TAG_COUNT = 3;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tags, setTags] = useState<WordPressTag[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagsReady, setTagsReady] = useState(false);
  const tagSlug = searchParams.get('tag');
  const activeTag = tags.find((t) => t.slug === tagSlug) || null;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const hasMore = page < totalPages;

  const loadPage = useCallback(async (pageToLoad: number, tagId?: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const isFirst = pageToLoad === 1;
    if (!isFirst) setIsLoadingMore(true);
    try {
      const result = await getPosts(PAGE_SIZE, pageToLoad, tagId);
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...result.posts.filter((p) => !seen.has(p.id))];
      });
      setTotalPages(result.totalPages || 1);
      setPage(pageToLoad);
      setLoadMoreError(false);
    } catch (err) {
      if (isFirst) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } else {
        setLoadMoreError(true);
      }
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getTags()
      .then((t) => { if (!cancelled) setTags(t); })
      .catch(() => { /* filters are optional: fail silently */ })
      .finally(() => { if (!cancelled) setTagsReady(true); });
    return () => { cancelled = true; };
  }, []);

  // (Re)load the first page whenever the active filter changes
  useEffect(() => {
    if (!tagsReady) return;
    let cancelled = false;
    const run = async () => {
      // wait for any in-flight request of the previous filter
      while (loadingRef.current) await new Promise((r) => setTimeout(r, 50));
      if (cancelled) return;
      setPosts([]);
      setPage(1);
      setTotalPages(1);
      setError(null);
      setLoadMoreError(false);
      setIsLoading(true);
      if (tagSlug && !activeTag) {
        // unknown tag: show empty state
        setIsLoading(false);
        return;
      }
      loadPage(1, activeTag?.id);
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsReady, tagSlug, activeTag?.id]);

  const selectTag = (slug: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('tag', slug); else next.delete('tag');
    setSearchParams(next);
  };

  const filterableTags = tags.filter((t) => t.count >= MIN_TAG_COUNT || t.slug === tagSlug);
  const primaryTags = filterableTags.slice(0, PRIMARY_TAGS);
  const extraTags = filterableTags.slice(PRIMARY_TAGS);
  const visibleTags = showAllTags || (activeTag && extraTags.includes(activeTag))
    ? filterableTags
    : primaryTags;

  // Infinite scroll: load next page when the sentinel approaches the viewport
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loadMoreError) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPage(page + 1, activeTag?.id);
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, page, loadMoreError, loadPage, posts.length, activeTag?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white">
      <SEO 
        title={activeTag ? `${activeTag.name} | Blog e Insights` : "Blog e Insights"}
        description="Noticias, guías y tendencias sobre infraestructura modular, contenedores marítimos y soluciones de espacio en México."
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://creativosespacios.mx/blog/#webpage",
              "url": "https://creativosespacios.mx/blog",
              "name": "Blog e Insights | Creativos Espacios",
              "isPartOf": { "@id": "https://creativosespacios.mx/#website" },
              "description": "Noticias, guías y tendencias sobre infraestructura modular, contenedores marítimos y soluciones de espacio en México."
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Inicio",
                  "item": "https://creativosespacios.mx/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://creativosespacios.mx/blog"
                }
              ]
            }
          ]
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-orange-500 bg-orange-500/10 rounded-full">
              Insights Operativos
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
              Conocimiento aplicado a la infraestructura modular.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed text-justify">
              Analizamos tendencias, compartimos guías técnicas y exploramos soluciones de espacio 
              para optimizar la capacidad operativa de su empresa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        {filterableTags.length > 0 && (
          <nav aria-label="Filtrar por tema" className="mb-16">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => selectTag(null)}
                aria-pressed={!activeTag}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                  !activeTag
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                Todos
              </button>
              {visibleTags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTag(t.slug)}
                  aria-pressed={activeTag?.id === t.id}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                    activeTag?.id === t.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  <span dangerouslySetInnerHTML={{ __html: t.name }} />
                  <span className="ml-2 opacity-50">{t.count}</span>
                </button>
              ))}
              {extraTags.length > 0 && !showAllTags && !(activeTag && extraTags.includes(activeTag)) && (
                <button
                  onClick={() => setShowAllTags(true)}
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-dashed border-slate-300 text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  + {extraTags.length} temas
                </button>
              )}
              {showAllTags && extraTags.length > 0 && (
                <button
                  onClick={() => setShowAllTags(false)}
                  className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors"
                >
                  Ver menos
                </button>
              )}
            </div>
            {activeTag && !isLoading && !error && (
              <p className="mt-6 text-sm text-slate-500">
                Mostrando {activeTag.count} {activeTag.count === 1 ? 'artículo' : 'artículos'} sobre{' '}
                <strong className="text-slate-900" dangerouslySetInnerHTML={{ __html: activeTag.name }} />
              </p>
            )}
          </nav>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-video bg-slate-100 rounded-md mb-6" />
                <div className="h-4 bg-slate-100 w-1/4 mb-4" />
                <div className="h-8 bg-slate-100 w-full mb-4" />
                <div className="h-20 bg-slate-100 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-orange-500 transition-colors"
            >
              Reintentar carga
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-slate-600 mb-6">No encontramos artículos para este tema.</p>
            <button
              onClick={() => selectTag(null)}
              className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-orange-500 transition-colors"
            >
              Ver todos los artículos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index % PAGE_SIZE % 3) * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video mb-8 overflow-hidden rounded-md bg-slate-100 relative">
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                      <img 
                        src={post._embedded['wp:featuredmedia'][0].source_url} 
                        alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <span className="text-xs uppercase tracking-widest">Creativos Espacios</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h2 
                    className="text-2xl font-serif text-slate-900 mb-4 group-hover:text-orange-500 transition-colors leading-tight"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />

                  <div 
                    className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 text-justify"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />

                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-orange-500 transition-colors">
                    Leer artículo completo
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div ref={sentinelRef} className="mt-16 flex justify-center min-h-[2rem]">
            {isLoadingMore && (
              <span className="text-xs uppercase tracking-widest text-slate-500">Cargando más artículos…</span>
            )}
            {loadMoreError && (
              <button
                onClick={() => { setLoadMoreError(false); loadPage(page + 1, activeTag?.id); }}
                className="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-orange-500 transition-colors"
              >
                Reintentar cargar más
              </button>
            )}
          </div>
        )}
      </section>

      {/* Newsletter / CTA Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif text-slate-900 mb-6">¿Necesita asesoría técnica?</h2>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Nuestro equipo técnico está preparado para analizar los requerimientos de su proyecto 
              y proponer la solución modular más eficiente.
            </p>
            <a 
              href="https://wa.me/522291846751" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex px-10 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Iniciar conversación técnica
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
