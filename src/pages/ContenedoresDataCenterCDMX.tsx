import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, ArrowRight, Server, ShieldCheck, Zap, Wind, Info, Database, Cpu, Lock, Activity, Settings } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID, getEntityId } from '../lib/canonical';
import { coverageToAreaServed } from '../lib/semantic-schema';
import { Link } from 'react-router-dom';

const ContenedoresDataCenterCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:data-center');
  const configuration = SemanticSelectors.getConfigurationById('configuration:data-center');
  const faqs = SemanticSelectors.getFaqByCategory('data-center');
  const coverage = SemanticSelectors.getCoverageForService('service:modular-projects');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedores-para-data-center-cdmx');
  const webpageId = getWebPageId('/contenedores-para-data-center-cdmx');
  const serviceId = getEntityId('/contenedores-para-data-center-cdmx', 'service');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedores para Data Center en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Infraestructura modular para data center, servidores y resguardo de equipos de red en Ciudad de México."
      },
      {
        "@type": "Service",
        "@id": serviceId,
        "name": `Soluciones de Data Center Modular en ${location?.name || 'CDMX'}`,
        "provider": { "@id": ORG_ID },
        "description": "Desarrollo de módulos técnicos para infraestructura de TI y centros de datos reubicables.",
        "areaServed": coverageToAreaServed(coverage)
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
            "name": `Contenedores para Data Center en ${location?.name || 'CDMX'}`,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
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

  const ctaWhatsApp = () => {
    window.open(org.contact.whatsapp, '_blank');
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Contenedores para Data Center en CDMX"
        description="Infraestructura modular para data center, servidores y resguardo de equipos de red en Ciudad de México. Soluciones técnicas a la medida."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/proyectos-especiales-container.jpg"
            alt={`Data Center Modular en ${location?.name || 'Ciudad de México'}`}
            loading="eager"
            className="h-full w-full object-cover grayscale transition-transform duration-[1400ms] ease-out md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.7)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.95)] via-[rgba(15,23,42,0.8)] to-[rgba(15,23,42,0.5)]"></div>
        </div>
        <motion.div
          className="container relative z-10 mx-auto px-6 lg:px-12"
          variants={heroMotion.container}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={heroMotion.eyebrow} className="mb-4 block text-sm font-bold tracking-[0.2em] text-brand-orange uppercase">
            {useCase?.name || 'INFRAESTRUCTURA TÉCNICA'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores para Data Center en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Módulos técnicos diseñados para el resguardo de servidores y equipos de red, proporcionando un entorno controlado y escalable para su infraestructura de datos.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              CONSULTAR PROYECTO TÉCNICO
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={ctaWhatsApp}
              className="flex items-center gap-3 rounded-sm border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              HABLAR CON UN ASESOR
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 text-sm text-white/60">
            Atención desde {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE — INFRAESTRUCTURA CRÍTICA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
              Infraestructura modular para activos de TI
            </h2>
            <p className="text-lg text-slate-600 font-sans leading-relaxed">
              Un data center modular permite desplegar capacidad de cómputo de forma rápida, segura y eficiente en cualquier ubicación estratégica.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-sm">
              <Server className="text-brand-orange mb-6 h-8 w-8" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-3 uppercase text-sm tracking-widest">Servidores</h3>
              <p className="text-slate-600 font-sans text-sm">Resguardo físico robusto para racks y equipos de procesamiento de datos.</p>
            </div>
            <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-sm">
              <Database className="text-brand-orange mb-6 h-8 w-8" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-3 uppercase text-sm tracking-widest">Almacenamiento</h3>
              <p className="text-slate-600 font-sans text-sm">Espacio optimizado para sistemas de almacenamiento masivo y backup.</p>
            </div>
            <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-sm">
              <Activity className="text-brand-orange mb-6 h-8 w-8" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-3 uppercase text-sm tracking-widest">Redes</h3>
              <p className="text-slate-600 font-sans text-sm">Infraestructura preparada para la conectividad y gestión de tráfico de datos.</p>
            </div>
            <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-sm">
              <Lock className="text-brand-orange mb-6 h-8 w-8" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-3 uppercase text-sm tracking-widest">Seguridad</h3>
              <p className="text-slate-600 font-sans text-sm">Control de acceso y protección física contra intrusiones o daños externos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — CONFIGURACIÓN TÉCNICA */}
      <section className="py-24 bg-brand-petroleum text-white overflow-hidden relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl uppercase tracking-tight">
              {configuration?.name || 'Módulo Data Center'}
            </h2>
            <p className="text-lg text-white/70 font-sans leading-relaxed italic">
              {configuration?.description || 'Habilitación técnica para infraestructura de cómputo y resguardo de datos.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {configuration?.features.map((feature, index) => (
              <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-sm group hover:border-brand-orange transition-colors">
                <div className="text-brand-orange mb-4">
                  {index === 0 && <Wind className="h-6 w-6" />}
                  {index === 1 && <Zap className="h-6 w-6" />}
                  {index === 2 && <ShieldCheck className="h-6 w-6" />}
                  {index === 3 && <Settings className="h-6 w-6" />}
                </div>
                <span className="text-sm font-bold uppercase tracking-[0.2em]">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 border border-white/10 bg-white/5 max-w-2xl">
            <div className="flex gap-4 items-start">
              <Cpu className="h-6 w-6 text-brand-orange shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-2 uppercase text-sm tracking-widest text-brand-orange">Alta Disponibilidad</h4>
                <p className="text-white/60 font-sans text-sm leading-relaxed">
                  Diseñamos módulos que permiten la integración de sistemas UPS y generadores externos para garantizar la continuidad operativa de sus servicios digitales.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[20%] w-[40%] opacity-10 pointer-events-none">
          <img src="/images/proyectos-blueprint.png" alt="" className="w-full grayscale invert" />
        </div>
      </section>

      {/* BLOQUE — PRODUCT FIT */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
              Unidades compatibles para el proyecto
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 font-sans">
              La elección del tamaño depende de la escala de la infraestructura de TI y los requerimientos de potencia y enfriamiento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCase?.supportedProductIds.map((productId) => {
              const product = SemanticSelectors.getProductById(productId);
              if (!product) return null;
              
              const imageMap: Record<string, string> = {
                'product:container-20ft': '/images/venta-renta-contenedor-20ft.png',
                'product:container-40ft': '/images/venta-renta-contenedor-40ft.png',
                'product:container-40hc': '/images/venta-renta-contenedor-40ft.png'
              };
              const pathMap: Record<string, string> = {
                'product:container-20ft': '/contenedor-20-pies-cdmx',
                'product:container-40ft': '/contenedor-40-pies-cdmx',
                'product:container-40hc': '/contenedor-40-high-cube-cdmx'
              };
              
              return (
                <div 
                  key={product.id} 
                  className="group p-8 border border-slate-100 bg-white rounded-sm hover:border-brand-orange transition-all shadow-sm flex flex-col"
                >
                  <div className="mb-8 flex justify-center overflow-hidden rounded-sm bg-slate-50 aspect-video relative">
                    <img 
                      src={imageMap[product.id]} 
                      alt={product.name} 
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-brand-petroleum mb-4 uppercase tracking-tight">{product.name}</h3>
                  <p className="text-slate-500 text-sm font-sans mb-8 flex-grow">
                    {product.id === 'product:container-20ft' ? 'Ideal para data centers compactos o nodos de red en borde (Edge Computing).' : 'Capacidad máxima para centros de datos de gran escala con múltiples racks y sistemas redundantes.'}
                  </p>
                  <Link 
                    to={pathMap[product.id]}
                    className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs tracking-widest uppercase group-hover:gap-3 transition-all"
                  >
                    DETALLES TÉCNICOS <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOQUE — MÉTODO */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-subtitle">Nuestro método</span>
              <h2 className="mb-8 text-3xl font-bold text-brand-petroleum md:text-5xl uppercase tracking-tighter leading-none">
                Del requerimiento técnico a la operación
              </h2>
              <p className="mb-10 text-lg text-slate-600 font-sans leading-relaxed text-justify">
                El desarrollo de un data center modular parte de entender la densidad de carga térmica, los requerimientos de potencia y la seguridad. Analizamos estos factores para definir la configuración óptima de enfriamiento, instalaciones y redundancia.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-brand-petroleum mb-2 uppercase text-xs tracking-widest text-brand-orange">1. Diagnóstico</h4>
                  <p className="text-xs text-slate-500 font-sans">Identificación de necesidades de TI y sitio.</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-petroleum mb-2 uppercase text-xs tracking-widest text-brand-orange">2. Configuración</h4>
                  <p className="text-xs text-slate-500 font-sans">Diseño de instalaciones y climatización.</p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-sm shadow-2xl">
              <img 
                src="/images/nosotros-method-installation.png" 
                alt="Instalación de módulo técnico" 
                className="w-full grayscale transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title="Preguntas frecuentes sobre Data Center Modular"
          subtitle="Resolvemos dudas sobre la factibilidad y requerimientos técnicos para infraestructura de TI."
        />
      )}

      {/* CTA FINAL */}
      <section className="py-24 bg-brand-orange text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl uppercase tracking-tighter">
            ¿Buscas escalar tu infraestructura de datos?
          </h2>
          <p className="mb-12 text-xl text-white/90 max-w-3xl mx-auto font-sans leading-relaxed">
            Dinos qué equipos necesitas albergar y cuáles son tus requerimientos de potencia y enfriamiento. Evaluamos la factibilidad técnica para tu proyecto en CDMX.
          </p>
          <button 
            onClick={ctaWhatsApp}
            className="bg-brand-petroleum px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-petroleum-light transition-all inline-flex items-center gap-3 uppercase"
          >
            INICIAR REVISIÓN DE PROYECTO <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContenedoresDataCenterCDMX;
