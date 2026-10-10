import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, ArrowRight, Truck, HardHat, Package, Wrench, Boxes, Info, Building2, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { Link } from 'react-router-dom';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const ContenedoresBodegaCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:warehouse');
  const faqs = SemanticSelectors.getFaqByCategory('bodega');

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

      {/* BLOQUE — OFERTA PÚBLICA (F4.0) */}
      <section className="py-24 bg-brand-gray/20 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
              Unidades para bodega inmediata
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 font-sans">
              Contenedores usados verificados, listos para ser utilizados como bodega en su sitio de operación.
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
                  Transformamos la unidad en una bodega organizada con estantería, iluminación y accesos especiales.
                </p>
              </div>
              <Link 
                to="/soluciones/oficinas"
                className="w-full flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-all group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white">Ver Soluciones</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
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

      <DeliveryQuoteDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        offer={selectedOffer}
        whatsappNumber={org.contact.whatsapp}
      />
    </div>
  );
};

export default ContenedoresBodegaCDMX;
