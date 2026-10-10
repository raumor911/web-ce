import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Truck, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, getEntityId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import { coverageToAreaServed } from '../lib/semantic-schema';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const VentaRenta: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const serviceSale = SemanticSelectors.getServiceById('service:container-sale');
  const products = SemanticSelectors.getProductsForService('service:container-sale');
  const faqData = SemanticSelectors.getFaqByCategory('venta-renta');
  const generalFaq = SemanticSelectors.getGeneralFaq();
  const coverage = SemanticSelectors.getCoverageForService('service:container-sale');

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

  const pageUrl = getCanonicalUrl('/soluciones/venta-renta');
  const webpageId = getWebPageId('/soluciones/venta-renta');
  const serviceId = getEntityId('/soluciones/venta-renta', 'service');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Venta y Renta de Contenedores Industriales",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Contenedores marítimos de 20 y 40 pies para almacenamiento y logística industrial en CDMX."
      },
      {
        "@type": "Service",
        "@id": serviceId,
        "name": serviceSale?.name || "Venta de Contenedores",
        "provider": { "@id": ORG_ID },
        "description": serviceSale?.description || "Suministro de contenedores industriales de 20 y 40 pies.",
        "areaServed": coverageToAreaServed(coverage),
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Catálogo de Contenedores",
          "itemListElement": products.map(p => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": p.name,
              "description": p.description
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
            "name": "Venta y Renta de Contenedores",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": getEntityId('/soluciones/venta-renta', 'faq'),
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

  return (    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Venta y Renta de Contenedores Industriales"
        description="Contenedores marítimos de 20 y 40 pies para almacenamiento y logística industrial en CDMX. Disponibilidad sujeta a inventario."
        jsonLd={jsonLd}
      />
      
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt="Contenedores industriales para almacenamiento y operación"
            loading="eager"
            {...({ fetchpriority: "high" } as any)}
            className="h-full w-full object-cover grayscale will-change-transform transition-transform duration-[1400ms] ease-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.62)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.9)] via-[rgba(15,23,42,0.72)] to-[rgba(15,23,42,0.46)]"></div>
        </div>
        <motion.div
          className="container relative z-10 mx-auto px-6 lg:px-12"
          variants={heroMotion.container}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white">
            Venta y Renta de <br /> Contenedores.
          </motion.h1>
          <motion.p variants={heroMotion.body} className="max-w-3xl text-lg leading-relaxed text-white md:text-2xl font-sans text-justify">
            Unidades verificadas estructuralmente para garantizar el resguardo de activos y la continuidad operativa para distintos contextos operativos e industriales.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-6">Equipamiento Disponible</h2>
          <p className="text-brand-graphite text-lg font-sans">
            Contenedores marítimos de 20 y 40 pies en excelentes condiciones estructurales, listos para entrega inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {purchaseOffers.map((offer) => (
            <ContainerOfferCard 
              key={offer.id} 
              offer={offer} 
              onQuote={handleQuote} 
            />
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-brand-gray/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-serif text-brand-petroleum mb-4">¿Buscas una opción de renta?</h3>
            <p className="text-brand-graphite font-sans">
              También contamos con esquemas de alquiler mensual para proyectos temporales o almacenamiento dinámico.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/renta-contenedores-cdmx" className="btn-primary uppercase tracking-widest text-xs font-bold px-10">
              Ver opciones de renta
            </a>
            <a href="/compra-contenedores-cdmx" className="btn-secondary uppercase tracking-widest text-xs font-bold px-10">
              Detalles de venta
            </a>
          </div>
        </div>
      </section>

      {/* Logistics section */}
      <section className="bg-brand-gray/20 border-t border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Truck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum uppercase tracking-tight">Logística</h3>
            <p className="text-base text-brand-graphite leading-relaxed font-sans">
              Contamos con equipo especializado para la entrega y el posicionamiento preciso de unidades en sitios de difícil acceso.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Clock className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum uppercase tracking-tight">Disponibilidad</h3>
            <p className="text-base text-brand-graphite leading-relaxed font-sans">
              Tiempos de entrega optimizados según disponibilidad de inventario y ubicación del proyecto.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum uppercase tracking-tight">Garantía</h3>
            <p className="text-base text-brand-graphite leading-relaxed font-sans">
              Cada unidad entregada pasa por un proceso de inspección técnica para asegurar su hermeticidad y estabilidad estructural.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
              ¿Para qué necesitas un contenedor?
            </h2>
            <p className="text-lg text-brand-graphite font-sans">
              Los contenedores marítimos ofrecen soluciones versátiles para diversas necesidades operativas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Almacenamiento", path: "/contenedores-para-almacenamiento-cdmx", desc: "Resguardo seguro de materiales y equipo." },
              { title: "Bodega Temporal", path: "/contenedores-para-bodega-cdmx", desc: "Espacio adicional cerca de su operación." },
              { title: "Apoyo en Obra", path: "/contenedores-para-obra-cdmx", desc: "Infraestructura operativa en sitio." },
              { title: "Oficina Móvil", path: "/oficinas-moviles-cdmx", desc: "Espacios de trabajo reubicables." }
            ].map((useCase) => (
              <a 
                key={useCase.path}
                href={useCase.path}
                className="group p-8 border border-brand-gray/30 rounded-sm hover:border-brand-orange transition-all bg-slate-50/50"
              >
                <h3 className="text-xl font-bold text-brand-petroleum mb-3 group-hover:text-brand-orange transition-colors uppercase tracking-tight">{useCase.title}</h3>
                <p className="text-sm text-brand-graphite font-sans mb-6">{useCase.desc}</p>
                <span className="text-xs font-bold text-brand-orange tracking-widest uppercase flex items-center gap-2">
                  EXPLORAR CASO <ArrowRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FAQ 
        items={[...faqData, ...generalFaq].map(f => ({ question: f.question, answer: f.answer }))} 
        title="Dudas sobre Venta y Renta"
        subtitle="Información clave para decidir la mejor opción de infraestructura para su operación."
      />

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

export default VentaRenta;
