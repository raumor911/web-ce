import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowRight, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <SEO 
        title="404 - Página no encontrada" 
        description="Lo sentimos, la página que busca no existe o ha sido movida."
      />
      
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
              <AlertTriangle className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase text-slate-500 bg-slate-100 rounded-full">
            Error 404
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
            Página no encontrada.
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 text-justify mx-auto max-w-lg leading-relaxed">
            La ruta solicitada no se encuentra disponible en nuestra infraestructura digital. 
            Es posible que el enlace esté desactualizado o que el recurso haya sido reubicado.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Volver al Inicio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/contacto"
              className="w-full sm:w-auto px-8 py-4 border border-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Contactar Soporte
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
