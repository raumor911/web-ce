import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, ArrowRight, Truck, HardHat, Package, Wrench, Boxes, Info, Building2, ShieldCheck, MapPin } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { Link } from 'react-router-dom';

const ContenedoresBodegaCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:warehouse');
  const faqs = SemanticSelectors.getFaqByCategory('bodega');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedores-para-bodega-cdmx');
  const webpageId = getWebPageId('/contenedores-para-bodega-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedores para bodega en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Convierte un contenedor en una solución de bodega para materiales, herramientas o inventario en Ciudad de México."
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
            "name": `Contenedores para bodega en ${location?.name || 'CDMX'}`,
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
        title="Contenedores para bodega en CDMX"
        description="Convierte un contenedor en una solución de bodega para materiales, herramientas o inventario en Ciudad de México."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/contenedor-para-almacenamiento-resguardo.jpg"
            alt={`Contenedores para bodega en ${location?.name || 'Ciudad de México'}`}
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
            {useCase?.name || 'ESPACIO DE BODEGA'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores para bodega en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Una alternativa para crear espacio de resguardo cerca de la operación cuando una bodega convencional no es práctica o no se justifica.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              CONSULTAR CONTENEDOR PARA BODEGA
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

      {/* BLOQUE — CUÁNDO PUEDE FUNCIONAR */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              ¿Cuándo puede ser útil una bodega en contenedor?
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              La versatilidad de los contenedores los convierte en la solución de bodega ideal para diversos escenarios operativos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <HardHat className="h-6 w-6" />, title: "Obras", desc: "Bodega de materiales y herramientas en el sitio de construcción." },
              { icon: <Building2 className="h-6 w-6" />, title: "Patio", desc: "Espacio de resguardo adicional en instalaciones propias." },
              { icon: <Wrench className="h-6 w-6" />, title: "Operación", desc: "Apoyo logístico cerca de los puntos de trabajo." },
              { icon: <Boxes className="h-6 w-6" />, title: "Capacidad Extra", desc: "Respuesta rápida a picos de inventario o stock." },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Resguardo Temporal", desc: "Solución de seguridad para activos en tránsito o espera." },
              { icon: <Truck className="h-6 w-6" />, title: "Expansión", desc: "Crecimiento de bodega sin necesidad de construcción." }
            ].map((item, index) => (
              <div key={index} className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="/images/contenedor-para-almacenamiento-resguardo.jpg" 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="text-brand-orange mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold text-brand-petroleum mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-sans text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — QUÉ DEBES CONSIDERAR */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Antes de utilizar un contenedor como bodega
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              Para asegurar la funcionalidad del espacio, es vital considerar factores operativos y logísticos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              "Tipo de material a resguardar",
              "Espacio disponible en el sitio",
              "Acceso para transporte de carga",
              "Maniobra de colocación",
              "Ventilación requerida",
              "Duración estimada del uso",
              "Frecuencia de acceso al interior"
            ].map((item, index) => (
              <div key={index} className="flex gap-4 items-center p-4 bg-white border border-slate-100 rounded-sm shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
                <span className="font-bold text-brand-petroleum">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — COMPRA O RENTA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src="/images/nosotros-coverage-map.png" 
                alt="Logística de bodegas en CDMX" 
                className="rounded-sm shadow-2xl grayscale"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-8 text-3xl font-bold text-brand-petroleum md:text-4xl">
                Compra o renta según la duración
              </h2>
              <p className="mb-8 text-lg text-slate-600 font-sans leading-relaxed">
                Si la necesidad está asociada a un proyecto temporal, la renta puede ser una alternativa. Si forma parte de una operación recurrente o de mayor duración, puede evaluarse la compra.
              </p>
              <div className="flex flex-wrap gap-8">
                <Link to="/compra-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                  COMPRAR BODEGA <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/renta-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                  RENTAR BODEGA <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — TAMAÑO */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Dimensiones para tu bodega
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-white/70 font-sans">
              Contamos con diferentes capacidades para adaptarnos al volumen de tu carga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SemanticSelectors.getProductsForUseCase('usecase:warehouse').map((product) => {
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
                <Link 
                  key={product.id} 
                  to={pathMap[product.id]}
                  className="group p-10 border border-white/10 text-center hover:border-brand-orange transition-colors bg-white/5"
                >
                  <div className="mb-6 flex justify-center overflow-hidden rounded-sm bg-white/5">
                    <img 
                      src={imageMap[product.id]} 
                      alt={product.name} 
                      className="h-48 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{product.name}</h3>
                  <span className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs tracking-widest uppercase">
                    VER CAPACIDAD <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title="Preguntas frecuentes sobre bodegas"
        />
      )}
    </div>
  );
};

export default ContenedoresBodegaCDMX;
