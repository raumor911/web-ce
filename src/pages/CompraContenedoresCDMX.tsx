import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { MapPin, MessageSquare, Package, HardHat, LayoutGrid, Settings, ArrowRight } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const CompraContenedoresCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const faqs = SemanticSelectors.getFaqByCategory('container-sale');
  
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

  const pageUrl = getCanonicalUrl('/compra-contenedores-cdmx');
  const webpageId = getWebPageId('/compra-contenedores-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Compra de contenedores en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Compra contenedores marítimos de 20 y 40 pies en ${location?.name || 'Ciudad de México'}. Soluciones para almacenamiento, obra y operación empresarial con atención desde ${baseLocation?.name || 'Iztapalapa'}.`
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
            "name": `Compra de contenedores en ${location?.name || 'CDMX'}`,
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
        title={`Compra de contenedores en ${location?.name || 'CDMX'}`}
        description={`Compra contenedores marítimos de 20 y 40 pies en ${location?.name || 'Ciudad de México'}. Soluciones para almacenamiento, obra y operación empresarial con atención desde ${baseLocation?.name || 'Iztapalapa'}.`}
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Venta de contenedores en ${location?.name || 'Ciudad de México'}`}
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
            CONTENEDORES EN {location?.name.toUpperCase() || 'CIUDAD DE MÉXICO'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Compra contenedores marítimos en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Contenedores de 20 y 40 pies para almacenamiento, obra, operación empresarial y proyectos que requieren espacio adicional.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Solicitar información</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención desde nuestro centro operativo en {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE 2 — OFERTA PÚBLICA DE VENTA */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-6">Oferta de Venta en {location?.name || 'CDMX'}</h2>
          <p className="text-brand-graphite text-lg font-sans">
            Unidades marítimas usadas, verificadas estructuralmente y listas para entrega inmediata desde nuestro patio operativo.
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

          {/* Módulo Especial / Acondicionados */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-brand-petroleum text-white p-8 flex flex-col justify-between border border-white/10 group"
          >
            <div>
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-brand-orange text-[10px] font-bold uppercase tracking-widest">
                <Settings className="h-3 w-3" />
                Acondicionados
              </div>
              <h3 className="text-2xl font-serif mb-4">Proyectos Especiales</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8 font-sans">
                Cuando el proyecto requiere algo más que almacenamiento, convertimos contenedores en oficinas, áreas operativas o infraestructura técnica a la medida.
              </p>
            </div>
            <div className="space-y-4">
              <a href="/soluciones/oficinas" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group/link">
                <span className="text-xs font-bold uppercase tracking-widest">Ver Oficinas</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
              </a>
              <a href="/proyectos" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group/link">
                <span className="text-xs font-bold uppercase tracking-widest">Proyectos Especiales</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BLOQUE 3 — COMPRA POR PROBLEMA */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 md:mb-24 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">¿Para qué necesitas el contenedor?</h2>
            <p className="text-white/70 text-lg font-sans leading-relaxed text-justify">
              Entendemos que la compra de un contenedor es una solución a una necesidad operativa específica. No solo vendemos cajas de acero; proveemos la infraestructura base para su proyecto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Package, title: "Almacenamiento", text: "Amplía capacidad sin construir infraestructura permanente." },
              { icon: HardHat, title: "Obra", text: "Resguarda herramientas, materiales o equipamiento cerca del punto de operación." },
              { icon: LayoutGrid, title: "Inventario", text: "Crea capacidad adicional cuando el espacio existente ya no es suficiente." },
              { icon: Settings, title: "Proyecto especial", text: "Parte de una solución que puede requerir acondicionamiento o configuración adicional." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="h-1 w-12 bg-brand-orange group-hover:w-20 transition-all duration-500"></div>
                <item.icon className="w-10 h-10 text-brand-orange/80 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-serif uppercase tracking-tight">{item.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm font-sans">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — UBICACIÓN ESTRATÉGICA */}
      <section className="bg-brand-gray/20 border-y border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-brand-orange mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">Atención desde {location?.name || 'Ciudad de México'}</h2>
            <p className="text-lg md:text-xl text-brand-graphite leading-relaxed mb-10 font-sans">
              Creativos Espacios opera desde su centro operativo en {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}. Desde este punto coordinamos proyectos de compra, acondicionamiento y logística de contenedores para empresas y proyectos en la {location?.name || 'Ciudad de México'} y zona metropolitana.
            </p>
            <a href="/contacto" className="btn-secondary uppercase tracking-widest text-xs font-bold">Contactar con un asesor</a>
          </div>
        </div>
      </section>

      {/* FAQ COMPRA */}
      <FAQ 
        items={faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        }))} 
        title="Preguntas frecuentes sobre compra"
        subtitle={`Información técnica y comercial para orientar su decisión de compra en ${location?.name || 'CDMX'}.`}
      />

      {/* CTA FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Buscas comprar un contenedor en {location?.name || 'CDMX'}?</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-12 font-sans">
            Solicite una cotización formal que incluya el costo de entrega y maniobras en su ubicación específica.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={ctaWhatsApp} className="btn-primary flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-petroleum" />
              Solicitar Cotización por WhatsApp
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

export default CompraContenedoresCDMX;
