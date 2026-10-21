import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, GraduationCap, Landmark, Ruler, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { DeliveryQuoteDrawer } from '../components/commercial/DeliveryQuoteDrawer';
import { SemanticSelectors } from '../semantic/selectors';
import { PublicContainerOffer } from '../types/semantic';
import { getCanonicalUrl, getEntityId, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import { getHeroMotionConfig } from '../lib/heroMotion';

const ContenedoresOneTripCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const faqs = SemanticSelectors.getFaqByCategory('one-trip');
  const oneTripOffers = SemanticSelectors.getOneTripSaleOffers();

  const [selectedOffer, setSelectedOffer] = useState<PublicContainerOffer | null>(null);
  const [drawerMode, setDrawerMode] = useState<'product' | 'general'>('general');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const openGeneralQuote = () => {
    setSelectedOffer(null);
    setDrawerMode('general');
    setIsDrawerOpen(true);
  };

  const openProductQuote = (offer: PublicContainerOffer) => {
    setSelectedOffer(offer);
    setDrawerMode('product');
    setIsDrawerOpen(true);
  };

  const pageUrl = getCanonicalUrl('/contenedores-nuevos-one-trip-cdmx');
  const webpageId = getWebPageId('/contenedores-nuevos-one-trip-cdmx');
  const serviceId = getEntityId('/contenedores-nuevos-one-trip-cdmx', 'service');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: 'Contenedores Nuevos One Trip en CDMX | Venta | Creativos Espacios',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': serviceId },
        description: 'Venta de contenedores nuevos One Trip en CDMX en formatos 20 FT Standard y 40 FT High Cube para proyectos arquitectónicos, educativos, corporativos y comerciales.'
      },
      {
        '@type': 'Service',
        '@id': serviceId,
        name: 'Venta de contenedores One Trip',
        provider: { '@id': ORG_ID },
        areaServed: location?.name || 'Ciudad de México',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Contenedores One Trip disponibles para cotización',
          itemListElement: oneTripOffers.map(offer => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: offer.product.name,
              description: offer.product.description
            }
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: getCanonicalUrl('/')
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Compra de contenedores',
            item: getCanonicalUrl('/compra-contenedores-cdmx')
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Contenedores One Trip',
            item: pageUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  const useCases = [
    {
      icon: Landmark,
      title: 'Proyectos arquitectónicos',
      text: 'Para proyectos donde el contenedor será intervenido, integrado al diseño o permanecerá visible como parte de la solución.',
      href: '/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx'
    },
    {
      icon: GraduationCap,
      title: 'Proyectos educativos',
      text: 'Para aulas, módulos administrativos, espacios de atención y ampliaciones donde también importa la presentación del espacio.',
      href: '/contenedores-one-trip-para-escuelas-cdmx'
    },
    {
      icon: Building2,
      title: 'Proyectos corporativos',
      text: 'Para oficinas, recepciones, showrooms, centros de ventas y espacios de representación.',
      href: '/contenedores-one-trip-para-proyectos-corporativos-cdmx'
    },
    {
      icon: ShoppingBag,
      title: 'Proyectos comerciales',
      text: 'Para puntos de venta, cafeterías, módulos de atención, exhibición o conceptos donde la superficie exterior forma parte de la experiencia.',
      href: null
    }
  ];

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO
        title="Contenedores Nuevos One Trip en CDMX | Venta"
        description="Venta de contenedores nuevos One Trip en CDMX en formatos 20 FT Standard y 40 FT High Cube para proyectos arquitectónicos, educativos, corporativos y comerciales. Solicita disponibilidad y cotización."
        jsonLd={jsonLd}
      />

      <header className="relative overflow-hidden bg-brand-petroleum py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute right-10 top-12 h-56 w-56 rounded-full border border-brand-orange/20" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full border border-white/10" />
        </div>
        <motion.div
          className="container relative z-10 mx-auto px-6 lg:px-12"
          variants={heroMotion.container}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={heroMotion.eyebrow} className="mb-4 block text-sm font-bold tracking-[0.2em] text-brand-orange uppercase">
            CONTENEDORES ONE TRIP · VENTA EN CDMX
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="max-w-5xl text-white leading-tight mb-8">
            Contenedores nuevos One Trip en CDMX
          </motion.h1>
          <motion.p variants={heroMotion.body} className="max-w-3xl text-lg md:text-2xl leading-relaxed text-white/80 font-sans mb-10">
            Unidades de fabricación reciente para proyectos donde la presentación, el estado superficial y una base con mínimo uso son parte del resultado final.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-col sm:flex-row gap-4">
            <button onClick={openGeneralQuote} className="btn-primary">
              Solicitar cotización
            </button>
            <button onClick={openGeneralQuote} className="btn-secondary border-white/20 text-white hover:bg-white/10">
              Cotizar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-6 text-sm text-white/60 font-sans">
            Disponibilidad, precio y condiciones de suministro se confirman al momento de cotizar. Venta únicamente.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 border-b border-brand-gray bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <span className="section-subtitle">CONDICIÓN DE SUMINISTRO</span>
            <h2 className="section-title">¿Qué es un contenedor One Trip?</h2>
          </div>
          <div className="space-y-6 text-brand-graphite text-lg leading-relaxed font-sans">
            <p>
              Un contenedor One Trip es una unidad de fabricación reciente que normalmente ha realizado un único viaje de posicionamiento. Por ello presenta un nivel de uso considerablemente menor que un contenedor usado y constituye una base especialmente adecuada para proyectos donde importan la apariencia, la condición de la superficie y la intervención posterior.
            </p>
            <p className="border-l-4 border-brand-orange pl-6 text-base">
              Puede presentar marcas menores propias del transporte, manejo o posicionamiento.
            </p>
            <p className="text-base">
              No todos los proyectos requieren One Trip. Su valor aparece cuando la condición de la unidad también forma parte del resultado esperado.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-gray/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mb-14 md:mb-20">
            <span className="section-subtitle">SELECCIÓN POR PROYECTO</span>
            <h2 className="section-title">Cuando el estado del contenedor forma parte del proyecto</h2>
            <p className="text-brand-graphite text-lg font-sans leading-relaxed">
              En proyectos donde la unidad permanecerá visible, recibirá acabados de mayor exigencia o formará parte de una solución arquitectónica, comenzar con una base de mínimo uso puede facilitar el desarrollo posterior.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {useCases.map(({ icon: Icon, title, text, href }) => {
              const content = (
                <>
                  <Icon className="h-9 w-9 text-brand-orange mb-6" />
                  <h3 className="text-xl font-serif text-brand-petroleum mb-4">{title}</h3>
                  <p className="text-sm leading-relaxed text-brand-graphite font-sans">{text}</p>
                  {href && (
                    <span className="mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                      Ver intención específica
                    </span>
                  )}
                </>
              );

              return href ? (
                <Link key={title} to={href} className="bg-white border border-brand-gray/40 p-8 hover:border-brand-orange transition-colors">
                  {content}
                </Link>
              ) : (
                <article key={title} className="bg-white border border-brand-gray/40 p-8">
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-subtitle">OFERTA ONE TRIP</span>
            <h2 className="section-title">Contenedores One Trip que ofrecemos</h2>
            <p className="text-brand-graphite text-lg font-sans">
              Creativos Espacios comercializa actualmente dos formatos One Trip para proyectos donde se requiere una unidad con mínimo uso.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {oneTripOffers.map(offer => (
              <article key={offer.id} className="border border-slate-200 bg-white p-8 md:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div>
                    <span className="inline-flex px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                      One Trip · Venta
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">
                      {offer.product.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-brand-orange mb-6">
                  <Ruler className="h-4 w-4" />
                  {offer.product.nominalDimensions || offer.product.dimensions}
                </div>

                <p className="text-brand-graphite font-sans leading-relaxed mb-8">
                  {offer.product.id === 'product:container-20ft'
                    ? 'Una alternativa compacta para proyectos donde se requiere una unidad con mínimo uso, buena condición superficial y una base adecuada para acondicionamiento o integración arquitectónica.'
                    : 'Mayor longitud y altura interior para proyectos que requieren más volumen, mayores posibilidades de configuración y una base con mínimo uso.'}
                </p>

                <div className="mt-auto pt-6 border-t border-brand-gray/30">
                  <p className="text-xs text-slate-500 font-sans mb-6">
                    Precio y disponibilidad se confirman al momento de cotizar.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      to={offer.product.id === 'product:container-20ft'
                        ? '/contenedor-one-trip-20-pies-cdmx'
                        : '/contenedor-one-trip-40-high-cube-cdmx'}
                      className="btn-secondary text-center"
                    >
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => openProductQuote(offer)}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-orange text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-orange-dark transition-all group"
                    >
                      Cotizar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="max-w-3xl mx-auto mt-10 text-center text-sm text-brand-graphite font-sans">
            Creativos Espacios comercializa actualmente contenedores One Trip en formatos 20 FT Standard y 40 FT High Cube. La disponibilidad y precio se confirman al momento de cotizar.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-14">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em]">CRITERIO DE SELECCIÓN</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white mt-4 mb-6">¿One Trip o usado?</h2>
            <p className="text-white/70 text-lg font-sans leading-relaxed">
              La elección depende del proyecto. Una unidad usada puede ser la mejor alternativa cuando predomina la función y el costo; One Trip cobra mayor relevancia cuando la condición de la unidad forma parte del resultado final.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-white/15 p-8 md:p-10">
              <h3 className="text-2xl font-serif text-white mb-6">One Trip</h3>
              <ul className="space-y-4 text-white/75 font-sans">
                {[
                  'Mínimo uso.',
                  'Mayor uniformidad visual esperada.',
                  'Menor desgaste acumulado.',
                  'Base adecuada para intervenciones de mayor exigencia.',
                  'Orientado a proyectos donde importa la presentación.',
                  'Disponible únicamente para venta.'
                ].map(item => <li key={item}>— {item}</li>)}
              </ul>
            </div>
            <div className="border border-white/15 p-8 md:p-10">
              <h3 className="text-2xl font-serif text-white mb-6">Usado</h3>
              <ul className="space-y-4 text-white/75 font-sans">
                {[
                  'Ha tenido uso operativo previo.',
                  'Puede presentar marcas, desgaste o reparaciones.',
                  'Buena alternativa cuando predominan funcionalidad y costo.',
                  'Adecuado para almacenamiento, obra y necesidades operativas.',
                  'Disponible para venta y renta según inventario.'
                ].map(item => <li key={item}>— {item}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-10 p-6 border-l-4 border-brand-orange bg-white/5">
            <p className="text-white font-sans">
              Creativos Espacios no ofrece contenedores One Trip en renta. La renta se realiza con unidades usadas y está sujeta a disponibilidad.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/compra-contenedores-cdmx" className="btn-primary">Ver contenedores usados en venta</Link>
            <Link to="/renta-contenedores-cdmx" className="btn-secondary border-white/20 text-white hover:bg-white/10">Ver contenedores en renta</Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="section-subtitle">BASE PARA DESARROLLO</span>
            <h2 className="section-title">Una mejor base para desarrollar su proyecto</h2>
          </div>
          <div>
            <p className="text-brand-graphite text-lg font-sans leading-relaxed">
              Cuando el contenedor será modificado, revestido, pintado, integrado a una composición arquitectónica o utilizado como espacio visible para usuarios y clientes, la condición de la unidad de origen puede influir en el trabajo posterior. Creativos Espacios puede partir de una unidad One Trip y evaluar los requerimientos del proyecto para definir el alcance correspondiente.
            </p>
          </div>
        </div>
      </section>

      <FAQ
        items={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        title="Preguntas frecuentes sobre contenedores One Trip"
        subtitle="Información para decidir si una unidad One Trip corresponde a las exigencias de su proyecto."
      />

      <section className="py-24 md:py-36 bg-brand-gray/10 border-t border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="section-subtitle">COTIZACIÓN SEGÚN SU PROYECTO</span>
          <h2 className="section-title">¿Su proyecto requiere una unidad One Trip?</h2>
          <p className="text-brand-graphite text-lg font-sans leading-relaxed mb-10">
            Comparta el formato que necesita, la ubicación del proyecto y el uso previsto. Creativos Espacios confirmará disponibilidad, precio y condiciones de suministro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={openGeneralQuote} className="btn-primary">Solicitar cotización</button>
            <button onClick={openGeneralQuote} className="btn-secondary">Cotizar por WhatsApp</button>
          </div>
        </div>
      </section>

      <DeliveryQuoteDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        offer={selectedOffer}
        whatsappNumber={org.contact.whatsapp}
        mode={drawerMode}
        availableOffers={oneTripOffers}
      />
    </div>
  );
};

export default ContenedoresOneTripCDMX;
