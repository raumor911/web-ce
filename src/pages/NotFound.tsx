import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowLeft, Construction } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <SEO 
        title="404 - Página no encontrada"
        description="La página que busca no está disponible en nuestra infraestructura digital."
      />
      
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex p-4 rounded-full bg-slate-50 text-orange-500 mb-8">
            <Construction className="w-12 h-12" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif text-slate-900 mb-6">404</h1>
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-slate-400 mb-8">
            Recurso no disponible
          </h2>
          
          <p className="text-slate-600 mb-12 leading-relaxed text-lg">
            La ruta solicitada no forma parte de nuestra infraestructura digital actual o ha sido reubicada. 
            Verifique la URL o regrese a una zona operativa conocida.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Volver al inicio
            </Link>
            
            <Link 
              to="/contacto" 
              className="w-full sm:w-auto px-8 py-4 border border-slate-200 text-slate-900 font-medium rounded-md hover:bg-slate-50 transition-all"
            >
              Reportar anomalía técnica
            </Link>
          </div>
        </motion.div>
        
        <div className="mt-24 pt-8 border-t border-slate-100">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            Creativos Espacios | Sistema de Gestión de Errores
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
