import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, getEntityId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import { coverageToAreaServed } from '../lib/semantic-schema';

const Oficinas: React.FC = () => {
  const serviceOffices = SemanticSelectors.getServiceById('service:relocatable-offices');
  const configurations = SemanticSelectors.getConfigurationsForService('service:relocatable-offices');
  const faqData = SemanticSelectors.getFaqByCategory('oficinas');
  const generalFaq = SemanticSelectors.getGeneralFaq();
  const coverage = SemanticSelectors.getCoverageForService('service:relocatable-offices');

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/soluciones/oficinas');
  const webpageId = getWebPageId('/soluciones/oficinas');
  const serviceId = getEntityId('/soluciones/oficinas', 'service');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Oficinas Reubicables para Industria y Obra",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Módulos de oficina habitables para supervisión, administración y frentes de obra."
      },
      {
        "@type": "Service",
        "@id": serviceId,
        "name": serviceOffices?.name || "Oficinas Reubicables",
        "provider": { "@id": ORG_ID },
        "description": serviceOffices?.description || "Diseño y suministro de oficinas modulares reubicables.",
        "areaServed": coverageToAreaServed(coverage),
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Configuraciones de Oficinas",
          "itemListElement": configurations.map(c => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": c.name,
              "description": c.description
            }
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": getCanonicalUrl('/')
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Oficinas Reubicables e Industriales",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": getEntityId('/soluciones/oficinas', 'faq'),
        "mainEntity": [...faqData, ...generalFaq].map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Oficinas Reubicables para Industria y Obra"
        description="Módulos de oficina habitables para supervisión, administración y frentes de obra en CDMX. Equipamiento técnico completo."
        jsonLd={jsonLd}
      />

      <header className="group relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-brand-gray/20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <motion.img 
            src="/images/oficinas-hero.png" 
            alt="Oficinas Reubicables"
            loading="eager"
            {...({ fetchpriority: "high" } as any)}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/oficinas-hero.svg';
            }}
            className="w-full h-full object-cover grayscale will-change-transform transition-transform duration-[1400ms] ease-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.72)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(253,253,253,0.94)] via-[rgba(253,253,253,0.84)] to-[rgba(253,253,253,0.52)]" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-[-12%] w-[34%] bg-gradient-to-r from-white/0 via-white/25 to-white/0 will-change-transform"
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
          <motion.h1 variants={heroMotion.title} className="text-brand-graphite mb-8 leading-tight uppercase tracking-tight">
            OFICINAS <br /> REUBICABLES.
          </motion.h1>
          <motion.p variants={heroMotion.body} className="text-brand-graphite text-lg md:text-2xl max-w-3xl font-sans leading-relaxed">
            Infraestructura diseñada para ofrecer un entorno de trabajo ergonómico, seguro y eficiente, justo donde su operación lo necesita.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <span className="section-subtitle">Ingeniería del espacio</span>
            <h2 className="section-title">Espacios preparados para trabajar con seguridad y comodidad.</h2>
            <p className="text-brand-graphite text-base md:text-lg leading-relaxed font-sans max-w-xl">
              Cada oficina reubicable integra soluciones pensadas para crear un entorno funcional, confortable y adecuado para las necesidades de cada operación.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
            <div className="flex flex-col gap-4 md:gap-6">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-petroleum border-l-2 border-brand-orange pl-4">CONTROL TÉRMICO</h3>
              <p className="text-xs md:text-sm text-brand-graphite/70 leading-relaxed">
                Aislamiento y soluciones de climatización para mantener condiciones interiores más estables.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:gap-6">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-petroleum border-l-2 border-brand-orange pl-4">CONECTIVIDAD</h3>
              <p className="text-xs md:text-sm text-brand-graphite/70 leading-relaxed">
                Instalaciones eléctricas y preparación para voz y datos de acuerdo con los requerimientos del proyecto.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:gap-6">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-petroleum border-l-2 border-brand-orange pl-4">DISTRIBUCIÓN FUNCIONAL</h3>
              <p className="text-xs md:text-sm text-brand-graphite/70 leading-relaxed">
                Configuraciones interiores que facilitan el trabajo administrativo, la supervisión y la coordinación de equipos.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:gap-6">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-petroleum border-l-2 border-brand-orange pl-4">SEGURIDAD</h3>
              <p className="text-xs md:text-sm text-brand-graphite/70 leading-relaxed">
                Estructuras resistentes, accesos definidos y elementos seleccionados según el uso previsto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-gray/10 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
            <h2 className="section-title">Configuraciones según las necesidades de tu operación</h2>
            <p className="text-brand-graphite text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans mb-8">
              Oficinas reubicables con distribución, equipamiento y servicios.
            </p>
            <div className="flex justify-center">
              <Link to="/oficinas-moviles-cdmx" className="text-brand-orange font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                Explorar Oficinas Móviles en CDMX <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {configurations.map((item, i) => (
              <div key={i} className="bg-white p-8 sm:p-10 md:p-12 border border-brand-gray shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl md:text-2xl font-serif mb-6 text-brand-petroleum">{item.name}</h4>
                  <p className="text-brand-graphite/70 text-sm mb-8 md:mb-10 font-sans leading-relaxed">
                    {item.description}
                  </p>
                  <ul className="space-y-3 mb-8 md:mb-10">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-brand-graphite leading-tight">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a 
                  href="https://wa.me/522291846751" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 text-brand-petroleum hover:text-brand-orange transition-colors group"
                >
                  Solicitar Cotización <ArrowRight size={18} className="text-brand-orange group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ 
        items={[...faqData, ...generalFaq]} 
        title="Dudas sobre Oficinas Reubicables"
        subtitle="Todo lo que necesita saber para habilitar su espacio de trabajo en sitio."
      />
    </div>
  );
};

export default Oficinas;
