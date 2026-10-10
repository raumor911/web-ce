import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, ArrowRight, HardHat, Package, Wrench, Maximize, Boxes, Info, Truck, Construction, Layout, Hammer } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { Link } from 'react-router-dom';

const ContenedoresObraCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:construction-site');
  const faqs = SemanticSelectors.getFaqByCategory('obra');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedores-para-obra-cdmx');
  const webpageId = getWebPageId('/contenedores-para-obra-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedores para obra en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Utiliza contenedores para almacenamiento, resguardo y apoyo operativo en proyectos de obra en Ciudad de México."
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
            "name": `Contenedores para obra en ${location?.name || 'CDMX'}`,
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
        title="Contenedores para obra en CDMX"
        description="Utiliza contenedores para almacenamiento, resguardo y apoyo operativo en proyectos de obra en Ciudad de México."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/oficina-contenedor-creativos-espacios.png"
            alt={`Contenedores para obra en ${location?.name || 'Ciudad de México'}`}
            loading="eager"
            className="h-full w-full object-cover grayscale transition-transform duration-[1400ms] ease-out md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.65)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.9)] via-[rgba(15,23,42,0.7)] to-[rgba(15,23,42,0.4)]"></div>
        </div>
        <motion.div
          className="container relative z-10 mx-auto px-6 lg:px-12"
          variants={heroMotion.container}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={heroMotion.eyebrow} className="mb-4 block text-sm font-bold tracking-[0.2em] text-brand-orange uppercase">
            {useCase?.name || 'APOYO OPERATIVO EN OBRA'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores para obra en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Los contenedores pueden incorporar capacidad de almacenamiento y apoyo operativo directamente en el sitio del proyecto.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              CONSULTAR PARA OBRA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={ctaWhatsApp}
              className="flex items-center gap-3 rounded-sm border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              HABLAR POR WHATSAPP
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 text-sm text-white/60">
            Atención desde {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE — USOS EN OBRA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              ¿Cómo puede utilizarse un contenedor dentro de una obra?
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              Desde el resguardo de activos hasta la base de operaciones, los contenedores resuelven múltiples necesidades en el sitio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
              <div className="aspect-video overflow-hidden">
                <img 
                  src="/images/contenedor-para-almacenamiento-resguardo.jpg" 
                  alt="Materiales en obra"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-8">
                <Package className="text-brand-orange mb-6 h-8 w-8" />
                <h3 className="text-xl font-bold text-brand-petroleum mb-3">Materiales</h3>
                <p className="text-slate-600 font-sans text-sm">Resguardo de materiales compatibles con este tipo de almacenamiento, protegiéndolos de la intemperie.</p>
              </div>
            </div>
            <div className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
              <div className="aspect-video overflow-hidden">
                <img 
                  src="/images/contenedor-para-almacenamiento-resguardo.jpg" 
                  alt="Herramientas en obra"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-8">
                <Hammer className="text-brand-orange mb-6 h-8 w-8" />
                <h3 className="text-xl font-bold text-brand-petroleum mb-3">Herramientas</h3>
                <p className="text-slate-600 font-sans text-sm">Espacio cercano para herramientas y equipo de trabajo, optimizando los tiempos de la operación.</p>
              </div>
            </div>
            <div className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
              <div className="aspect-video overflow-hidden">
                <img 
                  src="/images/contenedor-para-almacenamiento-resguardo.jpg" 
                  alt="Inventario operativo"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-8">
                <Boxes className="text-brand-orange mb-6 h-8 w-8" />
                <h3 className="text-xl font-bold text-brand-petroleum mb-3">Inventario operativo</h3>
                <p className="text-slate-600 font-sans text-sm">Capacidad para insumos utilizados durante el proyecto, manteniendo el orden en el sitio de obra.</p>
              </div>
            </div>
            <Link to="/soluciones/oficinas" className="group overflow-hidden border border-brand-orange/20 bg-brand-orange/5 rounded-sm hover:bg-brand-orange/10 transition-all">
              <div className="aspect-video overflow-hidden">
                <img 
                  src="/images/oficina-contenedor-creativos-espacios.png" 
                  alt="Base para acondicionamiento"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-8">
                <Layout className="text-brand-orange mb-6 h-8 w-8" />
                <h3 className="text-xl font-bold text-brand-petroleum mb-3">Base para acondicionamiento</h3>
                <p className="text-slate-600 font-sans text-sm mb-4">Un contenedor también puede convertirse en punto de partida para configuraciones que requieran funciones adicionales.</p>
                <span className="text-brand-orange font-bold text-xs inline-flex items-center gap-2">VER SOLUCIONES <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOQUE — PROYECTO TEMPORAL */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Infraestructura vinculada a la duración de la obra
            </h2>
            <p className="text-lg text-slate-600 font-sans leading-relaxed">
              La elección entre compra o renta depende de factores como la duración estimada del proyecto, la posibilidad de reutilización futura y la ubicación del sitio.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white border border-slate-100 rounded-sm">
              <h4 className="font-bold text-brand-petroleum mb-2 uppercase text-sm tracking-widest">Renta en Obra</h4>
              <p className="text-slate-600 font-sans text-sm">Ideal para proyectos con fecha de término definida, optimizando costos operativos.</p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-sm">
              <h4 className="font-bold text-brand-petroleum mb-2 uppercase text-sm tracking-widest">Compra para Proyectos</h4>
              <p className="text-slate-600 font-sans text-sm">Recomendada cuando se planea reutilizar el equipo en múltiples etapas o ubicaciones futuras.</p>
            </div>
          </div>

          <div className="flex gap-8">
            <Link to="/compra-contenedores-cdmx" className="font-bold text-brand-orange hover:translate-x-1 transition-transform inline-flex items-center gap-2">COMPRA <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/renta-contenedores-cdmx" className="font-bold text-brand-orange hover:translate-x-1 transition-transform inline-flex items-center gap-2">RENTA <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* BLOQUE — ACCESO Y UBICACIÓN */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-brand-petroleum md:text-4xl">
                El sitio también forma parte de la decisión
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <Truck className="h-5 w-5" />, text: "Acceso para transporte y descarga" },
                  { icon: <Maximize className="h-5 w-5" />, text: "Espacio disponible para la maniobra" },
                  { icon: <Layout className="h-5 w-5" />, text: "Tipo de superficie y nivelación" },
                  { icon: <Construction className="h-5 w-5" />, text: "Ubicación estratégica dentro del proyecto" }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="text-brand-orange">{item.icon}</div>
                    <span className="font-bold text-brand-petroleum">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-petroleum p-10 text-white rounded-sm">
              <h3 className="text-2xl font-bold mb-6">Dimensiones disponibles</h3>
              <p className="text-white/70 mb-8 font-sans">Selecciona el tamaño adecuado según la escala de tu obra y los requerimientos de almacenamiento.</p>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/contenedor-20-pies-cdmx" className="p-4 border border-white/10 hover:border-brand-orange transition-colors flex justify-between items-center group">
                  <span>Contenedor 20 Pies</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contenedor-40-pies-cdmx" className="p-4 border border-white/10 hover:border-brand-orange transition-colors flex justify-between items-center group">
                  <span>Contenedor 40 Pies</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contenedor-40-high-cube-cdmx" className="p-4 border border-white/10 hover:border-brand-orange transition-colors flex justify-between items-center group">
                  <span>Contenedor 40 High Cube</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-brand-orange text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">
            Cuéntanos cómo funciona tu obra
          </h2>
          <p className="mb-12 text-xl text-white/90 max-w-3xl mx-auto font-sans leading-relaxed">
            La solución depende de qué necesitas resguardar, cuánto espacio requieres, dónde se colocará el contenedor y durante cuánto tiempo.
          </p>
          <button 
            onClick={ctaWhatsApp}
            className="bg-brand-petroleum px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-petroleum-light transition-all inline-flex items-center gap-3"
          >
            CONSULTAR PARA MI PROYECTO <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-brand-white border-t border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="mb-16 text-center text-3xl font-bold text-brand-petroleum md:text-4xl">
            Preguntas frecuentes sobre obra
          </h2>
          <div className="max-w-3xl mx-auto grid gap-8">
            {jsonLd["@graph"][2].mainEntity.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 pb-8">
                <h3 className="text-lg font-bold text-brand-petroleum mb-4 flex gap-4">
                  <span className="text-brand-orange">?</span>
                  {faq.name}
                </h3>
                <p className="text-slate-600 font-sans pl-8">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContenedoresObraCDMX;
