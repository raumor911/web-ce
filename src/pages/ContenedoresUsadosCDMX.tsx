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

const ContenedoresUsadosCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const faqs = SemanticSelectors.getFaqByCategory('contenedor-usado');

  // F4.0 - Public Offers
  const purchaseOffers = SemanticSelectors.getPublicOffers({ 
    serviceId: 'service:container-sale', 
    condition: 'used' 
  });

  const [selectedOffer, setSelectedOffer] = useState<PublicContainerOffer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleQuote = (offer: PublicContainerOffer) => {
    setSelectedOffer(offer);
    setIsDrawerOpen(true);
  };
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedores-usados-cdmx');
  const webpageId = getWebPageId('/contenedores-usados-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedores usados en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Consulta contenedores marítimos usados de 20 y 40 pies en ${location?.name || 'Ciudad de México'} para almacenamiento, obra y necesidades operativas.`
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
            "name": `Contenedores usados en ${location?.name || 'CDMX'}`,
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
        title="Contenedores usados en CDMX"
        description="Consulta contenedores marítimos usados de 20 y 40 pies en Ciudad de México para almacenamiento, obra y necesidades operativas."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Contenedores usados en ${location?.name || 'Ciudad de México'}`}
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
            CONTENEDORES MARÍTIMOS EN {location?.name || 'CDMX'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores usados en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Una alternativa para proyectos que necesitan capacidad de almacenamiento o infraestructura basada en contenedores sin requerir necesariamente una unidad nueva.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Consultar disponibilidad</a>
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

      {/* BLOQUE — QUÉ SIGNIFICA USADO */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">¿Qué implica comprar un contenedor usado?</h2>
          <p className="text-lg text-brand-graphite leading-relaxed mb-8">
            Un contenedor usado puede presentar señales propias de operación y transporte previos. Su conveniencia depende de factores estructurales y funcionales clave:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Condición estructural íntegra",
              "Puertas operativas y sellado",
              "Piso en condiciones para carga",
              "Nivel de acondicionamiento requerido",
              "Uso previsto (almacén vs proyecto)",
              "Hermeticidad verificada"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                <span className="text-brand-petroleum font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — OFERTA PÚBLICA (F4.0) */}
      <section className="bg-brand-gray/20 py-20 md:py-32 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-6">Unidades Disponibles</h2>
            <p className="text-brand-graphite text-lg font-sans">
              Contenedores marítimos usados con garantía estructural, listos para entrega inmediata desde nuestro patio operativo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  Podemos transformar cualquier unidad usada en una oficina, bodega o espacio técnico según los requerimientos de su proyecto.
                </p>
              </div>
              <a 
                href="/proyectos"
                className="w-full flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">Ver Proyectos</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOQUE — USOS */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-16">¿Para qué puede utilizarse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Boxes, title: "Almacenamiento", text: "Resguardo de mercancía y stock adicional." },
            { icon: HardHat, title: "Obra", text: "Herramientas y materiales cerca del proyecto." },
            { icon: Package, title: "Inventario", text: "Capacidad adicional durante temporadas altas." },
            { icon: Wrench, title: "Acondicionamiento", text: "Base para proyectos modulares especializados." }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="h-16 w-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
                <item.icon className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-serif text-brand-petroleum mb-2">{item.title}</h4>
              <p className="text-brand-graphite text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-16 text-brand-graphite/60 italic max-w-2xl mx-auto">
          Nota: El contenedor para acondicionamiento depende de su estado estructural y el tipo de modificación requerida.
        </p>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title="Preguntas sobre contenedores usados"
        />
      )}

      {/* CTA FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-8">Cuéntanos qué uso tendrá el contenedor</h2>
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-12">
            El tamaño y la condición adecuada dependen de lo que necesitas almacenar, del sitio y de si el contenedor requerirá modificaciones posteriores.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/contacto" className="btn-primary">Solicitar asesoría</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </div>
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

export default ContenedoresUsadosCDMX;
