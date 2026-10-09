import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, Clock, ShieldCheck, Truck, HardHat, Package, Wrench, Maximize, LayoutGrid, Boxes } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';

const Contenedor20PiesCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const product20ft = SemanticSelectors.getProductsForService('service:container-sale').find(p => p.id === 'product:container-20ft');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedor-20-pies-cdmx');
  const webpageId = getWebPageId('/contenedor-20-pies-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Contenedor de 20 pies en CDMX | Creativos Espacios",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Conoce las características y usos de un contenedor marítimo de 20 pies en CDMX para almacenamiento, obra y proyectos empresariales."
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
            "name": "Contenedor de 20 pies en CDMX",
            "item": pageUrl
          }
        ]
      }
    ]
  };

  const ctaWhatsApp = () => {
    window.open(org.contact.whatsapp, '_blank');
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Contenedor de 20 pies en CDMX"
        description="Conoce las características y usos de un contenedor marítimo de 20 pies en CDMX para almacenamiento, obra y proyectos empresariales."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt="Contenedor de 20 pies en Ciudad de México"
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
            CONTENEDOR MARÍTIMO
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedor de 20 pies en CDMX
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Una configuración compacta para proyectos donde se necesita capacidad de almacenamiento o una base para soluciones acondicionadas sin ocupar el espacio de una unidad de mayor longitud.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Consultar 20 pies</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención en Ciudad de México y zona metropolitana.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE — CUÁNDO CONSIDERAR 20 PIES */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">¿Cuándo elegir un contenedor de 20 pies?</h2>
          <p className="text-lg text-brand-graphite leading-relaxed mb-8">
            El contenedor de 20 pies es la unidad estándar más versátil para proyectos que requieren movilidad y optimización de superficie.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Espacio limitado", text: "Ideal para terrenos, patios o sitios de obra con restricciones de área." },
              { title: "Almacenamiento moderado", text: "Capacidad suficiente para herramientas, materiales de obra o inventario de media escala." },
              { title: "Proyectos ágiles", text: "Facilidad de transporte y posicionamiento en sitios de difícil acceso." },
              { title: "Base de acondicionamiento", text: "Excelente para oficinas compactas, casetas de vigilancia o bodegas especializadas." }
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-brand-orange pl-6 py-2">
                <h4 className="text-xl font-serif text-brand-petroleum mb-2">{item.title}</h4>
                <p className="text-brand-graphite text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — DIMENSIONES */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">Dimensiones del contenedor de 20 pies</h2>
              <p className="text-white/70 text-lg mb-10">
                La estructura estándar de 20 pies proporciona una superficie de almacenamiento segura y hermética.
              </p>
              {product20ft?.dimensions && (
                <div className="bg-white/5 p-8 border border-white/10 rounded">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <span className="block text-brand-orange font-bold uppercase tracking-wider text-xs mb-2">Medidas Exteriores</span>
                      <span className="text-2xl font-serif">{product20ft.dimensions}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:w-1/2 bg-brand-gray/10 p-8 rounded border border-white/10">
              <img src="/images/venta-renta-contenedor-20ft.png" alt="Esquema contenedor 20 pies" className="w-full grayscale brightness-125" />
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — COMPRA O RENTA */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12 border-b border-brand-gray">
        <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">Disponible según modalidad y proyecto</h2>
        <p className="text-lg text-brand-graphite leading-relaxed max-w-3xl mb-12">
          Un contenedor de 20 pies puede formar parte de una solución de compra o renta dependiendo de disponibilidad, duración y necesidad operativa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/compra-contenedores-cdmx" className="group p-8 border border-brand-gray hover:border-brand-orange transition-colors flex items-center justify-between">
            <div>
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">Comprar contenedor en CDMX</h4>
              <p className="text-brand-graphite text-sm">Adquisición definitiva para activos permanentes.</p>
            </div>
            <ArrowRight className="h-6 w-6 text-brand-orange group-hover:translate-x-2 transition-transform" />
          </a>
          <a href="/renta-contenedores-cdmx" className="group p-8 border border-brand-gray hover:border-brand-orange transition-colors flex items-center justify-between">
            <div>
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">Rentar contenedor en CDMX</h4>
              <p className="text-brand-graphite text-sm">Flexibilidad para proyectos temporales u obra.</p>
            </div>
            <ArrowRight className="h-6 w-6 text-brand-orange group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>

      {/* ENLAZADO P2 */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12 bg-brand-gray/10">
        <h2 className="text-2xl font-serif text-brand-petroleum mb-8">Otras configuraciones disponibles</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/contenedor-40-pies-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedor 40 pies <ArrowRight className="h-4 w-4" />
          </a>
          <a href="/contenedores-usados-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedores usados <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white text-center">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-serif mb-8">¿Necesitas un contenedor de 20 pies?</h2>
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-12">
            Consulta disponibilidad y opciones de entrega en Ciudad de México para tu próximo proyecto de almacenamiento o infraestructura.
          </p>
          <a href="/contacto" className="btn-primary">Consultar ahora</a>
        </div>
      </section>
    </div>
  );
};

export default Contenedor20PiesCDMX;
