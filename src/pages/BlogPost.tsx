import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';

interface WordPressPost {
  id: number;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'author'?: Array<{
      name: string;
    }>;
  };
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/blog-admin/wp-json/wp/v2/posts?slug=${slug}&_embed`);
        if (!response.ok) throw new Error('No se pudo cargar el artículo');
        const data = await response.json();
        
        if (data.length === 0) {
          navigate('/404', { replace: true });
          return;
        }
        
        setPost(data[0]);
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

  return (
    <div className="bg-white pb-24">
      <SEO 
        title={post.title.rendered}
        description={post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160)}
        type="article"
      />

      {/* Reading Progress Bar (Optional UI touch) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-[60] origin-left"
        initial={{ scaleX: 0 }}
        style={{ scaleX: 0 }} // This would normally be handled by a scroll listener
      />

      <article className="pt-32">
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
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Lectura técnica
              </span>
            </div>

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            {post._embedded?.['author']?.[0] && (
              <div className="flex items-center gap-3 py-6 border-y border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  CE
                </div>
                <div>
                  <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold">Autor</span>
                  <span className="text-sm font-medium text-slate-900">{post._embedded['author'][0].name}</span>
                </div>
              </div>
            )}
          </motion.div>
        </header>

        {post._embedded?.['wp:featuredmedia']?.[0] && (
          <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="aspect-[21/9] rounded-lg overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50"
            >
              <img 
                src={post._embedded['wp:featuredmedia'][0].source_url} 
                alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div 
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
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Compartir</span>
              <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <Link 
              to="/contacto"
              className="text-sm font-bold text-slate-900 hover:text-orange-500 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              Consultar sobre este tema
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </article>

      {/* Related / Next Section */}
      <section className="mt-24 bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h3 className="text-2xl font-serif text-slate-900 mb-6">¿Interesado en una solución modular?</h3>
          <p className="text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
            Nuestro equipo de ingeniería puede ayudarle a aterrizar los requerimientos técnicos 
            vistos en este artículo para su proyecto específico.
          </p>
          <Link 
            to="/contacto"
            className="inline-flex px-10 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-orange-500 transition-all"
          >
            Solicitar asesoría técnica
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
