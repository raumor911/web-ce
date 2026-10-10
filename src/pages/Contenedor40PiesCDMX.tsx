import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, Clock, ShieldCheck, Truck, HardHat, Package, Wrench, Maximize, LayoutGrid, Boxes } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const Contenedor40PiesCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const product40ft = SemanticSelectors.getProductById('product:container-40ft');
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const faqs = SemanticSelectors.getFaqByCategory('contenedor-40ft');

  // F4.0 - Public Offers for this specific product
  const purchaseOffers = SemanticSelectors.getPublicOffers({ 
    serviceId: 'service:container-sale', 
    condition: 'used',
    productId: 'product:container-40ft'
  });

  const [selectedOffer, setSelectedOffer] = useState<PublicContainerOffer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleQuote = (offer: PublicContainerOffer) => {
    setSelectedOffer(offer);
    setIsDrawerOpen(true);
  };
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedor-40-pies-cdmx');
  const webpageId = getWebPageId('/contenedor-40-pies-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedor de 40 pies en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Conoce opciones y usos de contenedores marítimos de 40 pies en ${location?.name || 'Ciudad de México'} para almacenamiento, obra y proyectos operativos.`
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
            "name": `Contenedor de 40 pies en ${location?.name || 'CDMX'}`,
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
        title="Contenedor de 40 pies en CDMX"
        description="Conoce opciones y usos de contenedores marítimos de 40 pies en Ciudad de México para almacenamiento, obra y proyectos operativos."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Contenedor de 40 pies en ${location?.name || 'Ciudad de México'}`}
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
            {product40ft?.category || 'MAYOR CAPACIDAD'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedor de 40 pies en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Mayor longitud y capacidad para operaciones que requieren almacenar más materiales, inventario o equipamiento dentro de una misma unidad.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Consultar 40 pies</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención desde {baseLocation?.name || 'Iztapalapa'} para toda la {location?.name || 'Ciudad de México'}.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE — CUÁNDO CONSIDERAR 40 PIES */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">¿Cuándo elegir un contenedor de 40 pies?</h2>
          <p className="text-lg text-brand-graphite leading-relaxed mb-8">
            La unidad de 40 pies es el estándar para proyectos de gran escala que necesitan maximizar la superficie útil en una sola pieza.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Mayor volumen", text: "Doble de capacidad que una unidad estándar de 20 pies para grandes inventarios." },
              { title: "Materiales extensos", text: "Ideal para resguardar materiales de obra de gran longitud o maquinaria voluminosa." },
              { title: "Centros de operación", text: "Base para oficinas amplias, talleres o áreas de trabajo integradas." },
              { title: "Eficiencia logística", text: "Concentra mayor capacidad en un solo movimiento de transporte y maniobra." }
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-brand-orange pl-6 py-2">
                <h4 className="text-xl font-serif text-brand-petroleum mb-2">{item.title}</h4>
                <p className="text-brand-graphite text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — OFERTA PÚBLICA (F4.0) */}
      <section className="bg-brand-gray/20 py-20 md:py-32 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-6">Unidades de 40 pies disponibles</h2>
            <p className="text-brand-graphite text-lg font-sans">
              Contenedores marítimos de 40 pies usados, verificados estructuralmente y listos para entrega inmediata.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {purchaseOffers.map((offer) => (
              <ContainerOfferCard 
                key={offer.id} 
                offer={offer} 
                onQuote={handleQuote} 
              />
            ))}

            {/* Módulo Especial - Acondicionamiento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-petroleum text-white p-8 flex flex-col justify-between border border-white/10 group"
            >
              <div>
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-brand-orange text-[10px] font-bold uppercase tracking-widest">
                  <Wrench className="h-3 w-3" />
                  Servicios
                </div>
                <h3 className="text-2xl font-serif mb-4">Acondicionamiento</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 font-sans">
                  El contenedor de 40 pies es la base ideal para oficinas amplias, bodegas de gran volumen o áreas operativas en sitio.
                </p>
              </div>
              <a 
                href="/soluciones/oficinas"
                className="w-full flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">Ver Soluciones</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOQUE — 20 VS 40 */}
      <section className="bg-brand-gray/20 py-20 md:py-32 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum text-center mb-16">¿20 o 40 pies?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-8 shadow-sm border border-brand-gray">
              <h3 className="text-2xl font-serif text-brand-petroleum mb-4">20 pies</h3>
              <ul className="space-y-4 text-brand-graphite">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Menor superficie requerida en sitio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Necesidades de almacenamiento moderadas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Proyectos compactos o urbanos.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 shadow-sm border border-brand-orange/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 uppercase tracking-tighter">Mayor Capacidad</div>
              <h3 className="text-2xl font-serif text-brand-petroleum mb-4">40 pies</h3>
              <ul className="space-y-4 text-brand-graphite">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Máxima capacidad volumétrica en una unidad.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Inventario o materiales de mayor escala.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span>Operaciones que requieren superficie extensa.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="/contacto" className="btn-primary">Ayúdame a elegir</a>
          </div>
        </div>
      </section>

      {/* BLOQUE — DIMENSIONES */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">Dimensiones del contenedor de 40 pies</h2>
              <p className="text-white/70 text-lg mb-10 font-sans">
                La unidad de 40 pies ofrece una longitud de 12 metros, proporcionando el doble de superficie que la configuración estándar.
              </p>
              {product40ft?.dimensions && (
                <div className="bg-white/5 p-8 border border-white/10 rounded">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <span className="block text-brand-orange font-bold uppercase tracking-wider text-xs mb-2">Medidas Exteriores</span>
                      <span className="text-2xl font-serif">{product40ft.dimensions}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:w-1/2 bg-brand-gray/10 p-8 rounded border border-white/10">
              <img src="/images/venta-renta-contenedor-40ft.png" alt="Esquema contenedor 40 pies" className="w-full grayscale brightness-125" />
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — COMPRA / RENTA / PROYECTO */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-12">Modalidades disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Comprar", link: "/compra-contenedores-cdmx", desc: "Adquisición definitiva para proyectos permanentes." },
            { title: "Rentar", link: "/renta-contenedores-cdmx", desc: "Flexibilidad operativa para necesidades temporales." },
            { title: "Proyecto", link: "/proyectos", desc: "Base para soluciones industriales acondicionadas." }
          ].map((item, idx) => (
            <a key={idx} href={item.link} className="group p-8 border border-brand-gray hover:border-brand-orange transition-colors">
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">{item.title}</h4>
              <p className="text-brand-graphite text-sm mb-6">{item.desc}</p>
              <ArrowRight className="h-5 w-5 text-brand-orange group-hover:translate-x-2 transition-transform" />
            </a>
          ))}
        </div>
      </section>

      {/* ENLAZADO P2 */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12 bg-brand-gray/10">
        <h2 className="text-2xl font-serif text-brand-petroleum mb-8">Otras configuraciones disponibles</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/contenedor-20-pies-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedor 20 pies <ArrowRight className="h-4 w-4" />
          </a>
          <a href="/contenedor-40-high-cube-cdmx" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray text-brand-petroleum hover:border-brand-orange transition-colors">
            Contenedor 40 High Cube <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title={`Preguntas sobre el contenedor de 40 pies`}
        />
      )}

      {/* CTA FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white text-center">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Buscas un contenedor de 40 pies en CDMX?</h2>
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-12 font-sans">
            Consulta disponibilidad y opciones de logística para grandes volúmenes en Ciudad de México y zona metropolitana.
          </p>
          <a href="/contacto" className="btn-primary">Consultar ahora</a>
        </div>
      </section>

      {/* F4.0 - Drawer */}
      <DeliveryQuoteDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        offer={selectedOffer}
        whatsappNumber={org.contact.whatsapp}
      />
    </div>
  );
};

export default Contenedor40PiesCDMX;
