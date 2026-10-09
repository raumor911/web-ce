import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, Truck, ShieldCheck, Clock } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, getEntityId, ORG_ID, WEBSITE_ID } from '../lib/canonical';

const VentaRenta: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const serviceSale = SemanticSelectors.getServiceById('service:container-sale');
  const serviceRental = SemanticSelectors.getServiceById('service:container-rental');
  const products = SemanticSelectors.getProductsForService('service:container-sale');
  const faqData = SemanticSelectors.getFaqByCategory('venta-renta');
  const generalFaq = SemanticSelectors.getGeneralFaq();

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  // Combinar los datos del Semantic Core con las imágenes de la UI
  const inventario = products.map(product => {
    const is20ft = product.id.includes('20ft');
    return {
      id: product.id,
      titulo: product.name,
      dimensiones: product.dimensions,
      uso: product.description,
      features: product.features,
      img: is20ft ? '/images/venta-renta-contenedor-20ft.png' : '/images/venta-renta-contenedor-40ft.png',
      fallbackImg: is20ft ? '/images/venta-renta-contenedor-20ft.svg' : '/images/venta-renta-contenedor-40ft.svg'
    };
  });

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
        "areaServed": { "@type": "Country", "name": "México" },
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
            "name": "Venta y Renta",
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

  return (
    <div className="bg-brand-white min-h-screen">
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
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/venta-renta-hero.svg';
            }}
            className="h-full w-full object-cover grayscale will-change-transform transition-transform duration-[1400ms] ease-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
            variants={heroMotion.background}
            initial="hidden"
            animate="visible"
          />
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.62)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.9)] via-[rgba(15,23,42,0.72)] to-[rgba(15,23,42,0.46)]"></div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-[-12%] w-[34%] bg-gradient-to-r from-white/0 via-white/10 to-white/0 mix-blend-screen will-change-transform"
            variants={heroMotion.shimmer}
            initial="hidden"
            animate="visible"
          />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
          {inventario.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-industrial group flex h-full flex-col !p-0 overflow-hidden shadow-xl"
            >
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-brand-gray/60 bg-brand-gray/10 p-6 sm:p-8 md:p-10">
                <img
                  src={item.img}
                  alt={item.titulo}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = item.fallbackImg;
                  }}
                  className="h-full w-full object-contain object-center grayscale transition-all duration-1000 group-hover:grayscale-0 md:group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-10 md:p-12">
                <div className="mb-8 text-center md:mb-10">
                  <h2 className="text-2xl md:text-4xl font-serif text-brand-petroleum">{item.titulo}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12 pb-8 md:pb-10 border-b border-brand-gray">
                  <div>
                    <span className="block text-[10px] md:text-xs font-bold text-brand-orange uppercase mb-2 md:mb-3 tracking-widest">Dimensiones</span>
                    <span className="text-base md:text-lg font-sans text-brand-graphite">{item.dimensiones}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] md:text-xs font-bold text-brand-orange uppercase mb-2 md:mb-3 tracking-widest">Disponibilidad</span>
                    <span className="text-base md:text-lg font-sans text-brand-graphite">Venta / Renta</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="min-h-[120px] text-brand-graphite text-base leading-relaxed italic md:min-h-[144px] md:text-lg">
                    "{item.uso}"
                  </p>

                  <div className="mb-10 space-y-4 md:mb-12 md:space-y-5">
                    {item.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-4 text-sm text-brand-graphite font-medium">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href="https://wa.me/522291846751" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-auto block w-full text-center btn-primary"
                >
                  Solicitar Cotización
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Logistics section - Improved Legibility */}
      <section className="bg-brand-gray/20 border-t border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Truck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Logística y Posicionamiento</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Contamos con equipo especializado para la entrega y el posicionamiento preciso de unidades en sitios de difícil acceso.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Clock className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Disponibilidad sujeta a inventario y ubicación</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Tiempos definidos según disponibilidad y logística.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Garantía Estructural</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Cada unidad entregada pasa por un proceso de inspección técnica para asegurar su hermeticidad y estabilidad.
            </p>
          </div>
        </div>
      </section>

      <FAQ 
        items={[...faqData, ...generalFaq]} 
        title="Dudas sobre Venta y Renta"
        subtitle="Información clave para decidir la mejor opción de infraestructura para su operación."
      />
    </div>
  );
};

export default VentaRenta;
