import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Calendar, ArrowLeft, Clock, Share2, Facebook, Linkedin } from 'lucide-react';
import { getPostBySlug, WordPressPost } from '../services/wordpress';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await getPostBySlug(slug);
        
        if (!data) {
          navigate('/404', { replace: true });
          return;
        }
        
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cleanExcerpt = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const getMetaDescription = (post: WordPressPost) => {
    // 1. Prioritize clean excerpt
    const excerpt = cleanExcerpt(post.excerpt.rendered);
    if (excerpt && excerpt.length > 50) return excerpt.slice(0, 160);
    
    // 2. Fallback to content
    const content = cleanExcerpt(post.content.rendered);
    return content.slice(0, 160);
  };

  const generateJsonLd = (post: WordPressPost) => {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.['author']?.[0];
    const description = getMetaDescription(post);
    const siteUrl = 'https://creativosespacios.mx';

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${post.slug}`
      },
      "headline": post.title.rendered,
      "description": description,
      "image": featuredMedia ? [featuredMedia.source_url] : [],
      "datePublished": post.date,
      "dateModified": post.modified,
      "author": {
        "@type": "Organization",
        "name": "Creativos Espacios",
        "url": siteUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "Creativos Espacios",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo-creativos-espacios.png`
        }
      }
    };
  };

  const shareOnSocial = (platform: 'facebook' | 'linkedin') => {
    const url = window.location.href;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };

    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 animate-pulse">
          <div className="h-4 bg-slate-100 w-24 mb-8" />
          <div className="h-12 bg-slate-100 w-full mb-6" />
          <div className="h-4 bg-slate-100 w-48 mb-12" />
          <div className="aspect-video bg-slate-100 rounded-md mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 w-full" />
            <div className="h-4 bg-slate-100 w-full" />
            <div className="h-4 bg-slate-100 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-600 mb-6">{error || 'Artículo no encontrado'}</p>
          <Link to="/blog" className="text-orange-500 font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="bg-white pb-24">
      <SEO 
        title={post.title.rendered}
        description={getMetaDescription(post)}
        type="article"
        ogImage={featuredMedia?.source_url}
        jsonLd={generateJsonLd(post)}
      />

      <article className="pt-32" itemScope itemType="https://schema.org/BlogPosting">
        <header className="max-w-4xl mx-auto px-6 lg:px-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Regresar al listado
            </Link>

            <div className="flex items-center gap-6 mb-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <time itemProp="datePublished" dateTime={post.date}>{formatDate(post.date)}</time>
                <meta itemProp="dateModified" content={post.modified} />
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Lectura técnica
              </span>
            </div>

            <h1 
              itemProp="headline"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <div className="flex items-center gap-3 py-6 border-y border-slate-100" itemProp="author" itemScope itemType="https://schema.org/Organization">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                CE
              </div>
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold">Autor</span>
                <span className="text-sm font-medium text-slate-900" itemProp="name">
                  {post._embedded?.['author']?.[0]?.name || 'Creativos Espacios'}
                </span>
                <link itemProp="url" href="https://creativosespacios.mx" />
              </div>
            </div>
          </motion.div>
        </header>

        {featuredMedia && (
          <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="aspect-[21/9] rounded-lg overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50"
            >
              <img 
                itemProp="image"
                src={featuredMedia.source_url} 
                alt={featuredMedia.alt_text || post.title.rendered}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div 
            itemProp="articleBody"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
              prose-p:text-left
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-ul:my-6 prose-li:my-2
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative" ref={shareMenuRef}>
                <button 
                  onClick={() => setIsShareOpen(!isShareOpen)}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-orange-500 hover:border-orange-500 transition-all duration-300 group/btn"
                >
                  <Share2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Compartir</span>
                </button>

                <AnimatePresence>
                  {isShareOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute bottom-full left-0 mb-4 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100 p-2 min-w-[200px] z-50 overflow-hidden"
                    >
                      <button 
                        onClick={() => {
                          shareOnSocial('facebook');
                          setIsShareOpen(false);
                        }}
                        className="flex items-center gap-4 w-full px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/item:bg-orange-50 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </div>
                        Facebook
                      </button>
                      <button 
                        onClick={() => {
                          shareOnSocial('linkedin');
                          setIsShareOpen(false);
                        }}
                        className="flex items-center gap-4 w-full px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/item:bg-orange-50 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        LinkedIn
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <Link 
              to="/contacto"
              className="text-xs font-bold text-slate-900 hover:text-orange-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-3 group"
            >
              Consultar sobre este tema
              <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>

      {/* Related / Next Section */}
      <section className="mt-24 bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
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

export default BlogPost;
