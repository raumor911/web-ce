import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, Clock, ShieldCheck, Truck, HardHat, Package, Wrench, Maximize, LayoutGrid, Boxes } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';

const Contenedor40HighCubeCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const product40hc = SemanticSelectors.getProductById('product:container-40hc');
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const faqs = SemanticSelectors.getFaqByCategory('contenedor-40hc');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedor-40-high-cube-cdmx');
  const webpageId = getWebPageId('/contenedor-40-high-cube-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedor 40 High Cube en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Conoce el contenedor marítimo 40 High Cube en ${location?.name || 'CDMX'} y cuándo su mayor altura interior puede ser útil para almacenamiento o proyectos acondicionados.`
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
            "name": `Contenedor 40 High Cube en ${location?.name || 'CDMX'}`,
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
        title="Contenedor 40 High Cube en CDMX"
        description="Conoce el contenedor marítimo 40 High Cube en CDMX y cuándo su mayor altura interior puede ser útil para almacenamiento o proyectos acondicionados."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Contenedor 40 High Cube en ${location?.name || 'Ciudad de México'}`}
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
            {product40hc?.name || '40 HIGH CUBE'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedor 40 High Cube en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Una configuración de 40 pies con mayor altura que puede aportar capacidad adicional para determinados proyectos de almacenamiento y acondicionamiento.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Consultar High Cube</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención desde {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE — QUÉ LO HACE DIFERENTE */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">¿Qué diferencia a un 40 High Cube?</h2>
          <p className="text-lg text-brand-graphite leading-relaxed mb-8">
            La diferencia principal frente a un contenedor estándar de 40 pies es la **altura adicional**. Esta característica técnica permite:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-brand-gray bg-brand-gray/5">
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">Mayor altura interior</h4>
              <p className="text-brand-graphite text-sm">Aporta aproximadamente 30 centímetros adicionales de espacio vertical libre.</p>
            </div>
            <div className="p-6 border border-brand-gray bg-brand-gray/5">
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">Volumen vertical</h4>
              <p className="text-brand-graphite text-sm">Útil para almacenar mercancía estibada o maquinaria que requiere mayor despeje.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — CUÁNDO CONSIDERARLO */}
      <section className="bg-brand-gray/20 py-20 md:py-32 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum text-center mb-16">¿Cuándo elegir High Cube?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Maximize, title: "Espacio vertical", text: "Cuando el requerimiento principal es la altura libre interior." },
              { icon: Boxes, title: "Estiba alta", text: "Almacenamiento de materiales o cajas que permiten niveles adicionales." },
              { icon: Wrench, title: "Acondicionado", text: "Proyectos que integran instalaciones en techo o plafones." },
              { icon: LayoutGrid, title: "Volumen extra", text: "Proyectos donde cada metro cúbico de capacidad es relevante." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 shadow-sm border border-brand-gray text-center">
                <item.icon className="h-10 w-10 text-brand-orange mx-auto mb-6" />
                <h4 className="text-xl font-serif text-brand-petroleum mb-4">{item.title}</h4>
                <p className="text-brand-graphite text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — 40 STANDARD VS 40 HIGH CUBE */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8 text-left">Dimensiones High Cube</h2>
            <p className="text-brand-graphite text-lg mb-10 font-sans">
              La unidad 40 High Cube mantiene la longitud de 12 metros pero incrementa la altura total a 2.89 metros (9' 6").
            </p>
            {product40hc?.dimensions && (
              <div className="bg-brand-gray/10 p-8 border border-brand-gray rounded">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="block text-brand-orange font-bold uppercase tracking-wider text-xs mb-2">Medidas Exteriores</span>
                    <span className="text-2xl font-serif text-brand-petroleum">{product40hc.dimensions}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-1/2 bg-brand-gray/5 p-8 rounded border border-brand-gray">
            <img src="/images/venta-renta-contenedor-40ft.png" alt="Esquema contenedor 40 High Cube" className="w-full grayscale brightness-110" />
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum text-center mb-16">Standard vs High Cube</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-brand-petroleum border-b border-brand-gray pb-4">Standard (8' 6")</h3>
            <ul className="space-y-4 text-brand-graphite">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Altura convencional</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Almacenamiento general</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Operación habitual</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-brand-petroleum border-b border-brand-orange pb-4">High Cube (9' 6")</h3>
            <ul className="space-y-4 text-brand-graphite">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Mayor altura libre</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Mayor capacidad vertical</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Potencial para acondicionamiento</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BLOQUE — POSIBILIDAD DE ACONDICIONAMIENTO */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">Base para proyectos acondicionados</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed font-sans">
              Cuando el contenedor dejará de funcionar únicamente como almacenamiento, la altura disponible puede influir en la configuración del proyecto, permitiendo instalaciones ocultas o mayor despeje interior.
            </p>
            <a href="/soluciones/oficinas" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
              Ver soluciones acondicionadas <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ENLAZADO P2 */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12 bg-brand-gray/10">
        <h2 className="text-2xl font-serif text-brand-petroleum mb-8">Otras configuraciones de 40 pies</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/contenedor-40-pies-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedor 40 Standard <ArrowRight className="h-4 w-4" />
          </a>
          <a href="/contenedores-usados-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedores usados <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title={`Preguntas sobre el contenedor 40 High Cube`}
        />
      )}

      {/* CTA FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white text-center border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Buscas un contenedor 40 High Cube?</h2>
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-12 font-sans">
            Consulta disponibilidad y opciones de logística en Ciudad de México para esta configuración de mayor capacidad vertical.
          </p>
          <a href="/contacto" className="btn-primary">Solicitar información</a>
        </div>
      </section>
    </div>
  );
};

export default Contenedor40HighCubeCDMX;
