import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, HardHat, Package, Wrench, Maximize } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const RentaContenedoresCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const faqs = SemanticSelectors.getFaqByCategory('container-rental');

  // F4.0 - Public Offers for Rental
  const rentalOffers = SemanticSelectors.getPublicOffers({ 
    serviceId: 'service:container-rental', 
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

  const pageUrl = getCanonicalUrl('/renta-contenedores-cdmx');
  const webpageId = getWebPageId('/renta-contenedores-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Renta de contenedores en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Renta contenedores para almacenamiento, obra y necesidades temporales en ${location?.name || 'Ciudad de México'}. Soluciones de 20 y 40 pies según el alcance del proyecto.`
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
            "name": `Renta de contenedores en ${location?.name || 'CDMX'}`,
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
        title={`Renta de contenedores en ${location?.name || 'CDMX'}`}
        description={`Renta contenedores para almacenamiento, obra y necesidades temporales en ${location?.name || 'Ciudad de México'}. Soluciones de 20 y 40 pies según el alcance del proyecto.`}
        jsonLd={jsonLd}
      />
      
      {/* HERO RENTA */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Renta de contenedores en ${location?.name || 'Ciudad de México'}`}
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
            ALMACENAMIENTO TEMPORAL EN {location?.name.toUpperCase() || 'CDMX'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Renta contenedores en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Obtén espacio adicional para materiales, inventario, herramientas o proyectos sin convertir una necesidad temporal en infraestructura permanente.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Cotizar renta</a>
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

      {/* BLOQUE 2 — POR QUÉ RENTAR */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum max-w-3xl">Cuando necesitas espacio, pero no necesariamente comprarlo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum uppercase tracking-tight">Temporalidad</h3>
            <p className="text-brand-graphite leading-relaxed text-sm font-sans">Útil para necesidades vinculadas a una etapa, proyecto o periodo operativo.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum uppercase tracking-tight">Flexibilidad</h3>
            <p className="text-brand-graphite leading-relaxed text-sm font-sans">La capacidad puede responder a una necesidad temporal sin construir espacio permanente.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum uppercase tracking-tight">Proximidad</h3>
            <p className="text-brand-graphite leading-relaxed text-sm font-sans">Permite disponer de almacenamiento donde se desarrolla el trabajo.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum uppercase tracking-tight">Escalabilidad</h3>
            <p className="text-brand-graphite leading-relaxed text-sm font-sans">Puede complementar infraestructura existente durante picos de operación.</p>
          </div>
        </div>
      </section>

      {/* BLOQUE 3 — OFERTA DE RENTA */}
      <section className="bg-brand-gray/20 border-y border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-6">Opciones de Renta</h2>
            <p className="text-brand-graphite text-lg font-sans">
              Contenedores estándar de 20 y 40 pies disponibles para alquiler mensual o por proyecto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rentalOffers.map((offer) => (
              <ContainerOfferCard 
                key={offer.id} 
                offer={offer} 
                onQuote={handleQuote} 
              />
            ))}

            {/* Módulo Especial Renta */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-petroleum text-white p-8 flex flex-col justify-between border border-white/10"
            >
              <div>
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-brand-orange text-[10px] font-bold uppercase tracking-widest">
                  <Wrench className="h-3 w-3" />
                  Servicios
                </div>
                <h3 className="text-2xl font-serif mb-4">Evaluación de Sitio</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8 font-sans">
                  Para asegurar una entrega exitosa, revisamos la accesibilidad del terreno, radios de giro y ausencia de obstáculos aéreos.
                </p>
              </div>
              <button
                onClick={ctaWhatsApp}
                className="w-full flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group"
              >
                <span className="text-xs font-bold uppercase tracking-widest">Solicitar Evaluación</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — CASOS DE USO RENTA */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum">Aplicaciones en Renta</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: HardHat, title: "Obra", text: "Herramientas, materiales y equipamiento cerca del proyecto." },
            { icon: Package, title: "Inventario", text: "Capacidad adicional durante temporadas o cambios operativos." },
            { icon: Wrench, title: "Equipamiento", text: "Resguardo de activos y materiales en el punto donde se necesitan." },
            { icon: Maximize, title: "Expansión", text: "Espacio adicional mientras una necesidad permanece activa." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 border border-brand-gray shadow-sm hover:shadow-md transition-shadow group">
              <item.icon className="w-10 h-10 text-brand-orange mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-serif text-brand-petroleum mb-4 uppercase tracking-tight">{item.title}</h4>
              <p className="text-brand-graphite leading-relaxed text-sm font-sans">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOQUE 5 — RENTA EN CDMX */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif mb-8">Renta de contenedores desde {location?.name || 'Ciudad de México'}</h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-sans">
              Nuestra operación se encuentra en {baseLocation?.name || 'Iztapalapa'}, desde donde atendemos necesidades de infraestructura temporal y almacenamiento para proyectos en {location?.name || 'Ciudad de México'} y zona metropolitana.
            </p>
            <div className="h-1 w-20 bg-brand-orange mx-auto"></div>
          </div>
        </div>
      </section>

      {/* BLOQUE 6 — REQUERIMIENTOS */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-petroleum mb-6">Para cotizar la renta necesitamos saber</h2>
            <p className="text-brand-graphite leading-relaxed font-sans">Esta información nos permite preparar una propuesta comercial precisa y viable logísticamente.</p>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            {[
              "Uso del contenedor",
              "Tamaño aproximado (20 o 40 pies)",
              "Ubicación exacta de entrega",
              "Duración estimada de la renta",
              "Condiciones de acceso al sitio",
              "Necesidad de maniobra especial",
              "Requerimientos adicionales"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4 border-b border-brand-gray/30 font-sans">
                <div className="h-2 w-2 bg-brand-orange rounded-full"></div>
                <span className="text-brand-petroleum font-bold uppercase text-xs tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ RENTA */}
      <FAQ 
        items={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        }))} 
        title="Preguntas frecuentes sobre renta"
        subtitle={`Todo lo que necesitas saber para gestionar infraestructura temporal en ${location?.name || 'CDMX'}.`}
      />

      {/* CTA FINAL RENTA */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Necesitas espacio temporal en {location?.name || 'CDMX'}?</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-12 font-sans">
            Solicite una cotización formal de renta indicando el tiempo estimado y la ubicación de su proyecto.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={ctaWhatsApp} className="btn-primary flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-petroleum" />
              Solicitar Cotización de Renta
            </button>
            <a href="/contacto" className="btn-secondary border-white/20 text-white hover:bg-white/10">
              Formulario de Contacto
            </a>
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

export default RentaContenedoresCDMX;
