import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';
import { FAQ } from '../FAQ';
import { DeliveryQuoteDrawer } from './DeliveryQuoteDrawer';
import { SemanticSelectors } from '../../semantic/selectors';
import { ID, PublicContainerOffer } from '../../types/semantic';
import { getCanonicalUrl, getEntityId, getWebPageId, ORG_ID, WEBSITE_ID } from '../../lib/canonical';
import { getHeroMotionConfig } from '../../lib/heroMotion';

export interface OneTripInfoCard {
  title: string;
  text: string;
}

export interface OneTripDecisionItem {
  label: string;
  text: string;
}

export interface OneTripRelatedLink {
  title: string;
  text: string;
  href: string;
}

export interface OneTripIntentLandingConfig {
  path: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  faqCategory: string;
  mode: 'product' | 'project';
  productId?: ID;
  contextLabel: string;
  contextTitle: string;
  contextIntro: string;
  infoCards: OneTripInfoCard[];
  decisionTitle: string;
  decisionIntro: string;
  decisionItems: OneTripDecisionItem[];
  noxTitle: string;
  noxIntro: string;
  noxItems: OneTripDecisionItem[];
  finalEyebrow: string;
  finalTitle: string;
  finalText: string;
  relatedLinks: OneTripRelatedLink[];
}

interface Props {
  config: OneTripIntentLandingConfig;
}

const productDetailPath: Record<string, string> = {
  'product:container-20ft': '/contenedor-one-trip-20-pies-cdmx',
  'product:container-40hc': '/contenedor-one-trip-40-high-cube-cdmx'
};

export const OneTripIntentLanding: React.FC<Props> = ({ config }) => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const faqs = SemanticSelectors.getFaqByCategory(config.faqCategory);
  const oneTripOffers = SemanticSelectors.getOneTripSaleOffers();
  const specificOffer = config.productId
    ? oneTripOffers.find(offer => offer.product.id === config.productId) || null
    : null;

  const [selectedOffer, setSelectedOffer] = useState<PublicContainerOffer | null>(specificOffer);
  const [drawerMode, setDrawerMode] = useState<'product' | 'general'>(specificOffer ? 'product' : 'general');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl(config.path);
  const webpageId = getWebPageId(config.path);
  const entityId = getEntityId(config.path, config.mode === 'product' ? 'product' : 'service');

  const openPrimaryQuote = () => {
    if (specificOffer) {
      setSelectedOffer(specificOffer);
      setDrawerMode('product');
    } else {
      setSelectedOffer(null);
      setDrawerMode('general');
    }
    setIsDrawerOpen(true);
  };

  const openOfferQuote = (offer: PublicContainerOffer) => {
    setSelectedOffer(offer);
    setDrawerMode('product');
    setIsDrawerOpen(true);
  };

  const jsonLd = useMemo(() => {
    const graph: any[] = [
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: pageUrl,
        name: config.title,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': entityId },
        description: config.metaDescription
      },
      config.mode === 'product' && specificOffer
        ? {
            '@type': 'Product',
            '@id': entityId,
            name: `${specificOffer.product.name} One Trip`,
            description: config.metaDescription,
            category: specificOffer.product.category,
            width: specificOffer.product.externalDimensions?.widthMm
              ? { '@type': 'QuantitativeValue', value: specificOffer.product.externalDimensions.widthMm, unitCode: 'MMT' }
              : undefined,
            height: specificOffer.product.externalDimensions?.heightMm
              ? { '@type': 'QuantitativeValue', value: specificOffer.product.externalDimensions.heightMm, unitCode: 'MMT' }
              : undefined,
            depth: specificOffer.product.externalDimensions?.lengthMm
              ? { '@type': 'QuantitativeValue', value: specificOffer.product.externalDimensions.lengthMm, unitCode: 'MMT' }
              : undefined
          }
        : {
            '@type': 'Service',
            '@id': entityId,
            name: config.h1,
            serviceType: 'Venta de contenedores One Trip para proyectos',
            provider: { '@id': ORG_ID },
            areaServed: location?.name || 'Ciudad de México',
            description: config.metaDescription
          },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: getCanonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Contenedores One Trip', item: getCanonicalUrl('/contenedores-nuevos-one-trip-cdmx') },
          { '@type': 'ListItem', position: 3, name: config.h1, item: pageUrl }
        ]
      }
    ];

    if (faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }, [config, entityId, faqs, location?.name, pageUrl, specificOffer, webpageId]);

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO title={config.title} description={config.metaDescription} jsonLd={jsonLd} />

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
            {config.eyebrow}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="max-w-5xl text-white leading-tight mb-8">
            {config.h1}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="max-w-3xl text-lg md:text-2xl leading-relaxed text-white/80 font-sans mb-10">
            {config.lead}
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-col sm:flex-row gap-4">
            <button onClick={openPrimaryQuote} className="btn-primary">Solicitar cotización</button>
            <Link to="/contenedores-nuevos-one-trip-cdmx" className="btn-secondary border-white/20 text-white hover:bg-white/10">
              Ver oferta One Trip
            </Link>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-6 text-sm text-white/60 font-sans">
            Venta únicamente. Precio, disponibilidad, transporte y maniobras se confirman para cada requerimiento.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 border-b border-brand-gray bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <span className="section-subtitle">{config.contextLabel}</span>
            <h2 className="section-title">{config.contextTitle}</h2>
            <p className="text-brand-graphite text-lg md:text-xl leading-relaxed font-sans">{config.contextIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">
            {config.infoCards.map(card => (
              <article key={card.title} className="bg-brand-gray/10 border border-brand-gray/40 p-8">
                <h3 className="text-xl font-serif text-brand-petroleum mb-4">{card.title}</h3>
                <p className="text-sm leading-relaxed text-brand-graphite font-sans">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {specificOffer ? (
        <section className="py-20 md:py-32 bg-brand-gray/10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
              <div>
                <span className="section-subtitle">ESPECIFICACIÓN BASE</span>
                <h2 className="section-title">{specificOffer.product.name} · One Trip</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans">
                  One Trip describe la condición comercial de la unidad. No significa perfección cosmética: pueden existir marcas menores propias del transporte, manejo o posicionamiento.
                </p>
              </div>

              <div className="bg-white border border-brand-gray p-8 md:p-10">
                <dl className="space-y-6 font-sans">
                  <div className="flex justify-between gap-8 border-b border-brand-gray/40 pb-5">
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Formato</dt>
                    <dd className="text-right font-bold text-brand-petroleum">{specificOffer.product.nominalDimensions || specificOffer.product.dimensions}</dd>
                  </div>
                  <div className="flex justify-between gap-8 border-b border-brand-gray/40 pb-5">
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Condición</dt>
                    <dd className="text-right font-bold text-brand-petroleum">One Trip</dd>
                  </div>
                  <div className="flex justify-between gap-8 border-b border-brand-gray/40 pb-5">
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Modalidad</dt>
                    <dd className="text-right font-bold text-brand-petroleum">Venta</dd>
                  </div>
                  <div className="flex justify-between gap-8">
                    <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">Precio / disponibilidad</dt>
                    <dd className="text-right font-bold text-brand-petroleum">Se confirman al cotizar</dd>
                  </div>
                </dl>
                <button onClick={openPrimaryQuote} className="btn-primary w-full mt-8">Cotizar este formato</button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 md:py-32 bg-brand-gray/10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-14">
              <span className="section-subtitle">FORMATOS ONE TRIP</span>
              <h2 className="section-title">Dos bases disponibles para definir el proyecto</h2>
              <p className="text-brand-graphite text-lg font-sans leading-relaxed">
                CE ofrece One Trip únicamente en 20 FT Standard y 40 FT High Cube. La elección depende del espacio, volumen y configuración que requiera el proyecto.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {oneTripOffers.map(offer => (
                <article key={offer.id} className="bg-white border border-brand-gray p-8 md:p-10">
                  <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em]">ONE TRIP · VENTA</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum mt-3 mb-5">{offer.product.name}</h3>
                  <p className="text-brand-orange font-bold text-sm uppercase tracking-wider mb-6">
                    {offer.product.nominalDimensions || offer.product.dimensions}
                  </p>
                  <p className="text-brand-graphite font-sans leading-relaxed mb-8">
                    {offer.product.id === 'product:container-20ft'
                      ? 'Formato compacto para necesidades donde la huella física es relevante y el proyecto requiere una base con mínimo uso.'
                      : 'Formato High Cube con mayor longitud y altura interior para proyectos que requieren más volumen y flexibilidad de configuración.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={productDetailPath[offer.product.id]} className="btn-secondary text-center">Ver detalle</Link>
                    <button onClick={() => openOfferQuote(offer)} className="btn-primary">Cotizar</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-32 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em]">CRITERIO DE DECISIÓN</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white mt-4 mb-6">{config.decisionTitle}</h2>
            <p className="text-white/70 text-lg font-sans leading-relaxed">{config.decisionIntro}</p>
          </div>
          <div className="space-y-5">
            {config.decisionItems.map(item => (
              <div key={item.label} className="border-b border-white/15 pb-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-2">{item.label}</h3>
                <p className="text-white/75 font-sans leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mb-14">
            <span className="section-subtitle">REDUCIR INCERTIDUMBRE</span>
            <h2 className="section-title">{config.noxTitle}</h2>
            <p className="text-brand-graphite text-lg font-sans leading-relaxed">{config.noxIntro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {config.noxItems.map(item => (
              <article key={item.label} className="border-t border-brand-gray pt-6">
                <h3 className="text-lg font-serif text-brand-petroleum mb-3">{item.label}</h3>
                <p className="text-brand-graphite font-sans leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <FAQ
          items={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
          title="Preguntas frecuentes"
          subtitle="Información para evaluar la condición One Trip antes de solicitar cotización."
        />
      )}

      <section className="py-20 md:py-28 bg-brand-gray/10 border-t border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-12">
            <span className="section-subtitle">EXPLORAR ONE TRIP</span>
            <h2 className="section-title">Más rutas según su necesidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {config.relatedLinks.map(link => (
              <Link key={link.href} to={link.href} className="group border border-brand-gray bg-white p-7 hover:border-brand-orange transition-colors">
                <h3 className="text-xl font-serif text-brand-petroleum mb-3 group-hover:text-brand-orange transition-colors">{link.title}</h3>
                <p className="text-sm text-brand-graphite font-sans leading-relaxed">{link.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="section-subtitle">{config.finalEyebrow}</span>
          <h2 className="section-title">{config.finalTitle}</h2>
          <p className="text-brand-graphite text-lg font-sans leading-relaxed mb-10">{config.finalText}</p>
          <button onClick={openPrimaryQuote} className="btn-primary">Solicitar cotización</button>
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

export default OneTripIntentLanding;
