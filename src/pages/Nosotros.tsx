import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Shield, Settings, Truck, MapPin, CheckCircle2, Building2, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Nosotros: React.FC = () => {
  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Nuestra Empresa | Infraestructura Modular Industrial"
        description="Diseñamos infraestructura modular para operaciones que no pueden detenerse. Más de una década desarrollando soluciones técnicas para la industria."
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://www.creativosespacios.mx/nosotros/#webpage",
              "url": "https://www.creativosespacios.mx/nosotros",
              "name": "Nuestra Empresa | Infraestructura Modular Industrial",
              "isPartOf": { "@id": "https://www.creativosespacios.mx/#website" },
              "description": "Información sobre Creativos Espacios y nuestra experiencia en infraestructura modular."
            },
            {
              "@type": "AboutPage",
              "@id": "https://www.creativosespacios.mx/nosotros/#about",
              "url": "https://www.creativosespacios.mx/nosotros",
              "mainEntity": { "@id": "https://www.creativosespacios.mx/#organization" }
            }
          ]
        }}
      />

      {/* Hero Section - Technical & Sober */}
      <header className="bg-brand-gray/20 py-20 md:py-32 border-b border-brand-gray relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 grayscale pointer-events-none">
          <img 
            src="/images/nosotros-hero-blueprint.png" 
            alt="Ingeniería Industrial" 
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/nosotros-hero-blueprint.svg';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-subtitle">Nuestra Empresa</span>
            <h1 className="text-brand-graphite mb-8 leading-tight max-w-4xl">
              Diseñamos infraestructura modular para operaciones que <span className="text-brand-orange">no pueden detenerse.</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
              <p className="text-brand-graphite text-lg md:text-xl font-sans leading-relaxed text-justify">
                Durante más de una década hemos desarrollado soluciones modulares para empresas, industria y proyectos que requieren incorporar capacidad operativa sin depender de la construcción tradicional.
              </p>
              <p className="text-brand-graphite text-lg md:text-xl font-sans leading-relaxed text-justify">
                Nuestra experiencia combina venta y renta de contenedores, oficinas reubicables y proyectos modulares desarrollados de acuerdo con los requerimientos específicos de cada operación. Trabajamos con organizaciones que necesitan espacios funcionales para ejecutar proyectos, ampliar su capacidad o responder con rapidez a nuevas necesidades operativas.
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Method Section - Siemens/Caterpillar Style */}
      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-48 h-48 md:w-64 md:h-64 border-l-2 border-t-2 border-brand-orange/40"></div>
              <img 
                src="/images/nosotros-method-installation.png" 
                alt="Infraestructura Modular" 
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/nosotros-method-installation.svg';
                }}
                className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
            </div>
            <div>
              <h2 className="section-title">Más que contenedores, desarrollamos soluciones para cada operación.</h2>
              <div className="space-y-8 mt-10">
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Entendemos que cada proyecto tiene condiciones particulares de tiempo, espacio, operación y logística.
                </p>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Por ello, antes de fabricar una solución, analizamos el uso previsto, las condiciones del sitio y los requerimientos técnicos para definir una configuración alineada con las necesidades del proyecto.
                </p>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans border-l-4 border-brand-orange pl-8 italic">
                  "Nuestro objetivo no es únicamente entregar un espacio modular, sino desarrollar infraestructura que pueda integrarse de forma eficiente a la operación del cliente."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Industrial focus */}
      <section className="py-20 md:py-32 bg-brand-gray/10 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-20 text-center">
            <span className="section-subtitle">Lo que hacemos</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
            {[
              {
                title: "Venta y renta de contenedores",
                desc: "Disponibilidad de contenedores para almacenamiento, operación y proyectos temporales.",
                icon: <Box className="w-8 h-8" />
              },
              {
                title: "Oficinas reubicables",
                desc: "Espacios para supervisión, coordinación, administración y ampliaciones operativas.",
                icon: <Building2 className="w-8 h-8" />
              },
              {
                title: "Proyectos modulares",
                desc: "Soluciones desarrolladas de acuerdo con requerimientos técnicos, funcionales y de operación.",
                icon: <Settings className="w-8 h-8" />
              }
            ].map((item, i) => (
              <div key={i} className="flex h-full flex-col items-center text-center gap-6">
                <div className="text-brand-orange">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-serif text-brand-petroleum uppercase tracking-tight">{item.title}</h3>
                <p className="text-brand-graphite/70 text-sm md:text-base leading-relaxed font-sans max-w-sm">
                  {item.desc}
                </p>
                <a 
                  href="https://wa.me/522291846751" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary mt-auto py-4 px-8 text-[10px] md:text-xs"
                >
                  Solicitar Cotización
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Technical Workflow */}
      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <span className="section-subtitle">Cómo trabajamos</span>
            <h2 className="section-title">Nuestro proceso comienza por comprender la necesidad del proyecto.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                A partir de esa información definimos el alcance, la configuración, las adecuaciones y los servicios necesarios para desarrollar una solución funcional y preparada para su instalación.
              </p>
              <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                Durante todo el proceso coordinamos las diferentes etapas para ofrecer una experiencia ordenada, desde la definición del proyecto hasta la entrega de la infraestructura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* National Coverage - Logistics focus */}
      <section className="py-20 md:py-32 bg-brand-petroleum text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none grayscale invert">
          <img 
            src="/images/nosotros-coverage-map.png" 
            alt="Cobertura Nacional" 
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/nosotros-coverage-map.svg';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-brand-orange font-sans text-xs md:text-sm uppercase tracking-[0.3em] mb-6 block font-bold">Cobertura nacional</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">Desarrollamos proyectos en toda la República Mexicana.</h2>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed font-sans mb-10 text-justify">
                Nuestra red logística y experiencia en transporte e instalación nos permite atender proyectos en distintas regiones del país, adaptando cada solución a las condiciones particulares de cada ubicación.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-petroleum bg-brand-gray flex items-center justify-center">
                      <Truck className="w-5 h-5 text-brand-petroleum" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">Logística Especializada</span>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-10 border border-white/10">
              <h3 className="text-xl font-serif mb-8 text-white uppercase tracking-tight">Lo que nos distingue</h3>
              <p className="text-white/60 text-sm mb-10 font-sans">
                No creemos que todos los proyectos necesiten la misma solución. Desarrollamos espacios modulares considerando:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Uso operativo",
                  "Tiempo de implementación",
                  "Condiciones del sitio",
                  "Requerimientos técnicos",
                  "Crecimiento futuro",
                  "Necesidades del cliente"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white">
                    <div className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-12 text-brand-orange text-xs font-bold uppercase tracking-[0.2em]">
                Cada proyecto representa una solución distinta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment - Resilience focus */}
      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-subtitle">Nuestro compromiso</span>
            <h2 className="section-title">Infraestructura modular que aporta funcionalidad, flexibilidad y continuidad.</h2>
            <p className="text-brand-graphite text-lg md:text-xl leading-relaxed font-sans mt-10">
              Más que entregar un contenedor adaptado, trabajamos para que cada espacio responda a las necesidades reales de quienes lo utilizarán. Buscamos ser el soporte de la operación de nuestros clientes a través de soluciones de espacio resilientes y eficientes.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Executive Closing */}
      <section className="py-24 md:py-40 bg-brand-gray/20 border-t border-brand-gray text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <h2 className="mb-10 md:mb-12 leading-tight">¿Qué necesita tu operación?</h2>
          <p className="text-brand-graphite text-lg md:text-xl font-sans mb-16 leading-relaxed">
            Compártenos el uso, la ubicación y el tiempo requerido para tu proyecto. <br className="hidden md:block" />
            Trabajaremos contigo para definir la solución modular más adecuada para tu operación.
          </p>
          <div className="flex justify-center">
            <a href="https://wa.me/522291846751" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Solicitar Cotización
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
