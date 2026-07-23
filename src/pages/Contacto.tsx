import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { MessageSquare, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Contacto: React.FC = () => {
  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Contacto y Cotización Técnica"
        description="Inicie su proyecto de infraestructura modular. Solicite una cotización técnica para venta o renta de contenedores en CDMX."
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://www.creativosespacios.mx/contacto/#webpage",
              "url": "https://www.creativosespacios.mx/contacto",
              "name": "Contacto y Cotización Técnica",
              "isPartOf": { "@id": "https://www.creativosespacios.mx/#website" },
              "description": "Página de contacto de Creativos Espacios para cotizaciones técnicas."
            },
            {
              "@type": "ContactPage",
              "@id": "https://www.creativosespacios.mx/contacto/#contact",
              "url": "https://www.creativosespacios.mx/contacto",
              "mainEntity": { "@id": "https://www.creativosespacios.mx/#organization" }
            }
          ]
        }}
      />

      <header className="bg-brand-gray/50 py-20 md:py-32 border-b border-brand-gray">
        <div className="container px-6 lg:px-12">
          <h1 className="section-title">Inicie su Conversación.</h1>
          <p className="text-brand-graphite/70 text-base md:text-lg max-w-2xl font-sans leading-relaxed">
            Nuestro equipo de especialistas le proporcionará una estimación detallada basada en sus necesidades operativas y logística de sitio.
          </p>
        </div>
      </header>

      <section className="container px-6 lg:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 sm:p-12 border border-brand-gray shadow-2xl"
          >
            <form className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">Nombre Completo</label>
                  <input type="text" className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">Empresa / Cargo</label>
                  <input type="text" className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">Email Corporativo</label>
                <input type="email" className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">Línea de Interés</label>
                <select className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors appearance-none cursor-pointer">
                  <option>Venta / Renta de Contenedores</option>
                  <option>Oficinas Reubicables</option>
                  <option>Proyectos</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">Descripción del Requerimiento Técnico</label>
                <textarea rows={4} className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm text-justify focus:outline-none focus:border-brand-orange transition-colors"></textarea>
              </div>
              <button className="w-full btn-primary flex items-center justify-center gap-3">
                Enviar Solicitud <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>

          <div className="flex flex-col justify-between py-6">
            <div className="space-y-12 md:space-y-16">
              <div>
                <h3 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 text-brand-petroleum">Contacto Directo</h3>
                <div className="space-y-6 md:space-y-8">
                  <a href="tel:5554269941" className="flex items-center gap-6 md:gap-8 group">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                      <Phone size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">TELÉFONO</h4>
                      <p className="text-sm text-brand-graphite/60 font-sans mt-1">55 5426 9941</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-graphite/30">
                      <Mail size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">EMAIL</h4>
                      <p className="text-sm text-brand-graphite/60 font-sans mt-1">ventas@creativosespacios.mx</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 text-brand-petroleum">Ubicación y Cobertura</h3>
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-graphite/30">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Centro Operativo</h4>
                    <a
                      href="https://google.com/maps/place/Creativos+Espacios+%7C+Venta,+renta+y+adaptaci%C3%B3n+de+contenedores+mar%C3%ADtimos/data=!4m2!3m1!1s0x0:0xcf94e14da72b42e9?sa=X&ved=1t:2428&ictx=111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm leading-relaxed text-brand-graphite/60 font-sans transition-colors duration-200 hover:text-brand-orange focus-visible:outline-none focus-visible:text-brand-orange"
                    >
                      Av. del Arbol 104-Lote 2, Lomas de San Lorenzo, Iztapalapa, 09790 Ciudad de Mexico, CDMX
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 md:pt-12 border-t border-brand-gray mt-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-graphite/30">
                Horario de atención técnica: <br />
                Lunes a Viernes 08:00 - 18:00 hrs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
