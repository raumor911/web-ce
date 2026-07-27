import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Settings, Warehouse, Building2, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import faqData from '../data/faqData.json';

const Proyectos: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const soluciones = [
    {
      title: 'Almacenamiento y resguardo',
      desc: 'Espacios para proteger herramientas, materiales, equipos y suministros dentro de obras, plantas industriales y proyectos temporales.',
      icon: <Warehouse className="w-10 h-10" />,
      features: ['Configuración según el uso', 'Ventilación', 'Iluminación', 'Opciones de seguridad'],
      cta: 'Conocer solución'
    },
    {
      title: 'Oficinas y espacios de operación',
      desc: 'Infraestructura para supervisión, administración, coordinación de contratistas y operación temporal.',
      icon: <Building2 className="w-10 h-10" />,
      features: ['Distribución configurable', 'Instalación eléctrica', 'Climatización opcional', 'Preparación para voz y datos'],
      cta: 'Conocer solución'
    },
    {
      title: 'Proyectos especiales',
      desc: 'Espacios desarrollados bajo requerimientos específicos para procesos industriales, comerciales o de servicio.',
      icon: <Compass className="w-10 h-10" />,
      features: ['Diseño personalizado', 'Integración de servicios', 'Adecuaciones especiales', 'Fabricación bajo proyecto'],
      cta: 'Consultar factibilidad'
    }
  ];

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Proyectos Especiales y Modificaciones"
        description="Ingeniería a medida en contenedores. Desarrollo de soluciones personalizadas para necesidades técnicas y operativas específicas."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Ingeniería y Proyectos Especiales en Contenedores",
            "description": "Desarrollo de proyectos modulares adaptados a requerimientos específicos.",
            "provider": { "@id": "https://www.creativosespacios.mx/#organization" },
            "areaServed": "MX"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.proyectos.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.creativosespacios.mx"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Proyectos",
                "item": "https://www.creativosespacios.mx/proyectos"
              }
            ]
          }
        ]}
      />

      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/proyectos-hero.png"
            alt="Proyecto modular instalado"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/proyectos-hero.svg';
            }}
            className="h-full w-full object-cover grayscale will-change-transform transition-transform duration-[1400ms] ease-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.72)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.92)] via-[rgba(15,23,42,0.78)] to-[rgba(15,23,42,0.58)]"></div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-[-12%] w-[34%] bg-gradient-to-r from-white/0 via-white/10 to-white/0 mix-blend-screen will-change-transform"
            variants={heroMotion.shimmer}
            initial="hidden"
            animate="visible"
          />
        </div>
        <motion.div
          className="container relative z-10 mx-auto px-6 lg:px-12"
          variants={heroMotion.container}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={heroMotion.eyebrow} className="section-subtitle !text-brand-orange">
            Soluciones a la medida
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 max-w-5xl leading-tight text-white">
            Espacios diseñados para las necesidades de cada proyecto.
          </motion.h1>
          <motion.p variants={heroMotion.body} className="max-w-3xl text-lg leading-relaxed text-white md:text-2xl font-sans text-justify">
            Cada proyecto tiene necesidades distintas. Diseñamos y habilitamos espacios modulares de acuerdo con los requerimientos operativos, técnicos y funcionales de cada cliente.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20">
          <h2 className="section-title">Soluciones diseñadas para distintas necesidades operativas</h2>
          <p className="text-brand-graphite text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-sans">
            Cada proyecto tiene requerimientos diferentes. Diseñamos espacios modulares de acuerdo con el uso, la operación y las condiciones de cada instalación.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {soluciones.map((sol, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-industrial group shadow-xl flex flex-col text-center !p-8 md:!p-10 lg:!p-12"
            >
              <div className="text-brand-orange mb-8 md:mb-10 group-hover:scale-110 transition-transform duration-500 flex justify-center">
                {sol.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8 text-brand-petroleum uppercase tracking-tight leading-tight md:min-h-[4rem] flex items-center justify-center">{sol.title}</h3>
              <p className="text-brand-graphite text-base md:text-lg mb-8 md:mb-12 leading-relaxed font-sans md:min-h-[6rem] flex items-center justify-center">
                {sol.desc}
              </p>
              <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12 flex-grow flex flex-col items-center justify-center">
                {sol.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-brand-graphite uppercase tracking-widest">
                    <div className="w-2 h-2 bg-brand-orange flex-shrink-0"></div> {feat}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a 
                  href="https://wa.me/522291846751" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary w-full text-center py-4 md:py-5 text-[10px] md:text-xs block"
                >
                  {sol.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blueprint / Design section - High Contrast Black Text */}
      <section className="py-20 md:py-32 bg-brand-gray/20 border-t border-brand-gray overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-48 h-48 md:w-64 md:h-64 border-l-2 border-t-2 border-brand-orange/40"></div>
            <img 
              src="/images/proyectos-blueprint.png" 
              alt="Blueprint Técnico"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/proyectos-blueprint.svg';
              }}
              className="relative z-10 w-full opacity-60 grayscale mix-blend-multiply"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="section-subtitle">Nuestro método</span>
            <h2 className="text-3xl md:text-6xl font-serif mb-8 md:mb-10 leading-tight text-brand-petroleum">Del requerimiento a una solución lista para operar</h2>
            <p className="text-brand-graphite text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 font-sans text-justify">
              Analizamos el uso, las condiciones del sitio y los requerimientos técnicos de cada proyecto. A partir de esta información, definimos la configuración, los servicios y las adecuaciones necesarias para entregar una solución preparada para su instalación y puesta en operación.
            </p>
            <div className="flex gap-10 md:gap-16">
              <div>
                <span className="block font-serif text-4xl md:text-5xl text-brand-orange mb-2 md:mb-3">CAD</span>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-graphite/60">Modelado 3D</p>
              </div>
              <div>
                <span className="block font-serif text-4xl md:text-5xl text-brand-orange mb-2 md:mb-3">ISO</span>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-graphite/60">Estándares Técnicos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ 
        items={[...faqData.proyectos, ...faqData.general]} 
        title="Dudas sobre Proyectos Especiales"
        subtitle="Información sobre el desarrollo de soluciones de ingeniería modular a medida."
      />
    </div>
  );
};

export default Proyectos;
