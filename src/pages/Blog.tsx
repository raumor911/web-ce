import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/blog-admin/wp-json/wp/v2/posts?_embed&per_page=9');
        if (!response.ok) throw new Error('No se pudieron cargar las publicaciones');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        title="Blog e Insights"
        description="Noticias, guías y tendencias sobre infraestructura modular, contenedores marítimos y soluciones de espacio en México."
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
