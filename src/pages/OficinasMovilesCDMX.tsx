import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, ArrowRight, HardHat, Package, Wrench, Maximize, Boxes, Info, Truck, Building2, Layout, Zap, Sun, DoorOpen, Wind, Palette, Split, Clock, MessageSquare } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { Link } from 'react-router-dom';
import { ContainerOfferCard } from '../components/commercial/ContainerOfferCard';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { PublicContainerOffer } from '../types/semantic';

const OficinasMovilesCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:mobile-office');
  const faqs = SemanticSelectors.getFaqByCategory('oficina-movil');

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

  const pageUrl = getCanonicalUrl('/oficinas-moviles-cdmx');
  const webpageId = getWebPageId('/oficinas-moviles-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Oficinas móviles en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Oficinas móviles basadas en contenedores para proyectos, obra y necesidades operativas en ${location?.name || 'Ciudad de México'}.`
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
            "name": `Oficinas móviles en ${location?.name || 'CDMX'}`,
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
        title={`Oficinas móviles en ${location?.name || 'CDMX'}`}
        description={`Oficinas móviles basadas en contenedores para proyectos, obra y necesidades operativas en ${location?.name || 'Ciudad de México'}.`}
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/oficina-contenedor-creativos-espacios.png"
            alt={`Oficinas móviles en ${location?.name || 'Ciudad de México'}`}
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
            ESPACIO DE TRABAJO REUBICABLE
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Oficinas móviles en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Espacios basados en contenedores que pueden acondicionarse para incorporar funciones administrativas u operativas donde el proyecto las necesita.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              CONSULTAR OFICINA MÓVIL
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link 
              to="/soluciones/oficinas"
              className="flex items-center gap-3 rounded-sm border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              VER OFICINAS
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* BLOQUE — CUÁNDO PUEDE SER ÚTIL */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Cuando necesitas trabajar cerca de la operación
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              Las oficinas móviles ofrecen una respuesta ágil para establecer puntos de trabajo en ubicaciones estratégicas desde {baseLocation?.name || 'Iztapalapa'}, atendiendo toda la {location?.name || 'CDMX'}.
            </p>
            <div className="mt-6">
              <Link to="/oficina-para-supervision-de-obra-cdmx" className="text-brand-orange font-bold text-sm tracking-widest uppercase inline-flex items-center gap-2 hover:gap-3 transition-all">
                SOLUCIÓN PARA SUPERVISIÓN DE OBRA <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <HardHat className="h-6 w-6" />, title: "Obra", desc: "Punto de supervisión y control administrativo en sitio." },
              { icon: <Building2 className="h-6 w-6" />, title: "Patios", desc: "Oficinas operativas en centros logísticos o patios de maniobra." },
              { icon: <Clock className="h-6 w-6" />, title: "Temporales", desc: "Infraestructura para proyectos con duración definida." },
              { icon: <Truck className="h-6 w-6" />, title: "Remotas", desc: "Espacios de trabajo en ubicaciones de difícil acceso." },
              { icon: <Maximize className="h-6 w-6" />, title: "Ampliaciones", desc: "Crecimiento de áreas administrativas sin construcción fija." },
              { icon: <Layout className="h-6 w-6" />, title: "Provisionales", desc: "Puntos de atención o administración de emergencia." }
            ].map((item, index) => (
              <div key={index} className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="/images/oficina-contenedor-creativos-espacios.png" 
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

      {/* BLOQUE — ACONDICIONAMIENTO */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              El contenedor es la base, no el producto terminado
            </h2>
            <p className="text-lg text-white/70 font-sans leading-relaxed">
              Una oficina móvil requiere una configuración específica para permitir una función de trabajo confortable y eficiente.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="h-6 w-6" />, label: "Instalaciones eléctricas" },
              { icon: <Sun className="h-6 w-6" />, label: "Iluminación" },
              { icon: <Maximize className="h-6 w-6" />, label: "Ventanas" },
              { icon: <DoorOpen className="h-6 w-6" />, label: "Puertas" },
              { icon: <Wind className="h-6 w-6" />, label: "Climatización" },
              { icon: <Palette className="h-6 w-6" />, label: "Acabados" },
              { icon: <Split className="h-6 w-6" />, label: "Divisiones" }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-sm text-center group hover:border-brand-orange transition-colors">
                <div className="text-brand-orange mb-4 flex justify-center">{item.icon}</div>
                <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE — COMPRA O RENTA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-brand-petroleum md:text-4xl">
                Compra o renta según la duración del proyecto
              </h2>
              <p className="mb-8 text-lg text-slate-600 font-sans leading-relaxed">
                Adaptamos la modalidad comercial a los tiempos de tu operación en la {location?.name || 'Ciudad de México'}.
              </p>
              <div className="space-y-4 mb-10">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm flex items-start gap-4">
                  <div className="bg-brand-orange/10 p-2 rounded-full"><Clock className="h-4 w-4 text-brand-orange" /></div>
                  <div>
                    <h4 className="font-bold text-brand-petroleum">Renta de Oficinas</h4>
                    <p className="text-sm text-slate-500 font-sans">Ideal para proyectos con plazos definidos y necesidades de movilidad.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-sm flex items-start gap-4">
                  <div className="bg-brand-orange/10 p-2 rounded-full"><Building2 className="h-4 w-4 text-brand-orange" /></div>
                  <div>
                    <h4 className="font-bold text-brand-petroleum">Compra de Oficinas</h4>
                    <p className="text-sm text-slate-500 font-sans">Recomendada para activos que formarán parte de la infraestructura fija de la empresa.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-8">
                <Link to="/compra-contenedores-cdmx" className="font-bold text-brand-orange inline-flex items-center gap-2 hover:gap-3 transition-all">COMPRA <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/renta-contenedores-cdmx" className="font-bold text-brand-orange inline-flex items-center gap-2 hover:gap-3 transition-all">RENTA <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/oficina-contenedor-creativos-espacios.png" 
                alt={`Oficina móvil en ${location?.name || 'CDMX'}`} 
                className="rounded-sm shadow-2xl grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — TAMAÑO Y CONFIGURACIÓN */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-subtitle">UNIDADES BASE</span>
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
              Contenedores para habilitar como oficina móvil
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 font-sans">
              Utilizamos contenedores marítimos estructuralmente íntegros como base para el acondicionamiento de su espacio de trabajo reubicable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {purchaseOffers
              .filter(offer => useCase?.supportedProductIds.includes(offer.product.id))
              .map((offer) => (
                <ContainerOfferCard
                  key={offer.product.id}
                  offer={offer}
                  onQuote={handleQuote}
                />
              ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-sans italic max-w-2xl mx-auto">
              * Los precios corresponden a la unidad base. El costo final de la oficina móvil dependerá del nivel de acondicionamiento (aislamiento, acabados, clima, instalaciones) requerido para su operación.
            </p>
          </div>
        </div>
      </section>

      {/* BLOQUE — DIFERENCIA */}
      <section className="py-24 bg-brand-white border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto p-10 bg-brand-petroleum/5 border-l-8 border-brand-orange">
            <h2 className="text-2xl font-bold text-brand-petroleum mb-6">De contenedor a espacio de trabajo</h2>
            <p className="text-lg text-slate-700 font-sans leading-relaxed italic">
              "Un contenedor utilizado únicamente para almacenamiento resuelve una necesidad de resguardo. Una oficina móvil requiere configuración adicional para permitir una función de trabajo."
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">
            ¿Qué función debe cumplir tu oficina?
          </h2>
          <p className="mb-12 text-xl text-white/70 max-w-3xl mx-auto font-sans">
            Cuéntanos cuántas funciones debe integrar, dónde se utilizará y durante cuánto tiempo estará en operación.
          </p>
          <button 
            onClick={ctaWhatsApp}
            className="bg-brand-orange px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-orange-dark transition-all inline-flex items-center gap-3"
          >
            SOLICITAR INFORMACIÓN <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="mb-16 text-center text-3xl font-bold text-brand-petroleum md:text-4xl">
            Preguntas frecuentes sobre oficinas móviles
          </h2>
          <div className="max-w-3xl mx-auto grid gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 pb-8">
                <h3 className="text-lg font-bold text-brand-petroleum mb-4 flex gap-4">
                  <span className="text-brand-orange">?</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 font-sans pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY QUOTE DRAWER (F4.0) */}
      <DeliveryQuoteDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        offer={selectedOffer}
        whatsappNumber={org.contact.whatsapp}
      />
    </div>
  );
};

export default OficinasMovilesCDMX;
