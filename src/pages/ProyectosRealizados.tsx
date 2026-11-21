import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { SEO } from '../components/SEO';
import { SemanticSelectors } from '../semantic/selectors';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import {
  chapters,
  allCases,
  heroImage,
  imageSrc,
  ProjectCase,
  ProjectImage,
} from '../data/proyectosRealizados';

const PATH = '/proyectos-realizados-contenedores-modulares';
const TITLE = 'Proyectos realizados con contenedores adaptados';
const DESCRIPTION =
  'Oficinas, laboratorio, centro de capacitación móvil y un edificio construido con contenedores. Fotografías reales de espacios modulares adaptados por Creativos Espacios.';

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

interface LightboxState {
  images: ProjectImage[];
  index: number;
  title: string;
}

const Lightbox: React.FC<{
  state: LightboxState;
  onClose: () => void;
  onIndex: (i: number) => void;
}> = ({ state, onClose, onIndex }) => {
  const { images, index, title } = state;
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  const prev = useCallback(() => onIndex((index - 1 + images.length) % images.length), [index, images.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog
        const focusables = document.querySelectorAll<HTMLElement>('[data-lightbox] button');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={`Galería: ${title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-brand-petroleum/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          {title} · {index + 1}/{images.length}
        </p>
        <button
          ref={closeRef}
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Cerrar galería"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:left-6"
            aria-label="Fotografía anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <img
          key={image.file}
          src={imageSrc(image.file)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:right-6"
            aria-label="Fotografía siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <p className="px-6 py-5 text-center text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
        {image.caption || image.alt}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

const Figure: React.FC<{
  image: ProjectImage;
  onOpen: () => void;
  sizes: string;
  priority?: boolean;
}> = ({ image, onOpen, sizes, priority }) => (
  <figure className="group relative mb-4 break-inside-avoid">
    <button
      type="button"
      onClick={onOpen}
      className="relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
      aria-label={`Ampliar fotografía: ${image.caption || image.alt}`}
    >
      <img
        src={imageSrc(image.file)}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <span className="pointer-events-none absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-petroleum opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <ZoomIn className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
    {image.caption && (
      <figcaption className="px-1 pb-0 pt-2 text-xs leading-snug text-slate-500">{image.caption}</figcaption>
    )}
  </figure>
);

const CaseGallery: React.FC<{ item: ProjectCase; onOpen: (i: number) => void }> = ({ item, onOpen }) => {
  const count = item.images.length;
  const layout =
    count === 1 ? 'columns-1' : count === 2 ? 'columns-2 gap-4' : 'columns-2 gap-4';
  const sizes = count === 1 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 29vw, 50vw';
  return (
    <div className={layout}>
      {item.images.map((img, i) => (
        <Figure key={img.file} image={img} onOpen={() => onOpen(i)} sizes={sizes} />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Case                                                                */
/* ------------------------------------------------------------------ */

const CaseSection: React.FC<{
  item: ProjectCase;
  reverse: boolean;
  onOpen: (images: ProjectImage[], index: number, title: string) => void;
}> = ({ item, reverse, onOpen }) => (
  <article id={item.id} className="scroll-mt-28 border-t border-slate-200 py-16 first:border-t-0 md:py-20">
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={`lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}>
        <div className="lg:sticky lg:top-32">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-orange">{item.category}</p>
          <h3 className="mb-6 !text-2xl leading-tight text-brand-petroleum md:!text-3xl lg:!text-4xl">{item.title}</h3>
          <div className="space-y-4 font-sans text-base leading-relaxed text-slate-700 md:text-[1.0625rem]">
            {item.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {item.documented.length > 0 && (
            <div className="mt-8 border-l-2 border-brand-orange pl-5">
              <h4 className="mb-3 !text-xs font-sans font-bold uppercase tracking-[0.2em] text-slate-500">
                Datos del proyecto
              </h4>
              <ul className="space-y-2 font-sans text-sm leading-relaxed text-slate-800">
                {item.documented.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {item.visible && item.visible.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 !text-xs font-sans font-bold uppercase tracking-[0.2em] text-slate-500">
                Lo que se aprecia en las fotografías
              </h4>
              <ul className="space-y-2 font-sans text-sm leading-relaxed text-slate-600">
                {item.visible.map((v) => (
                  <li key={v} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={`lg:col-span-7 ${reverse ? 'lg:order-1' : ''}`}>
        <CaseGallery item={item} onOpen={(i) => onOpen(item.images, i, item.title)} />
      </div>
    </div>
  </article>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const offerLinks = [
  {
    to: '/oficinas-moviles-cdmx/',
    title: 'Oficinas móviles',
    desc: 'Espacios de trabajo en contenedor, reubicables, como los del capítulo 03.',
  },
  {
    to: '/proyectos/',
    title: 'Proyectos modulares especiales',
    desc: 'Cuando la necesidad no cabe en un formato estándar: laboratorios, aulas, edificaciones.',
  },
  {
    to: '/soluciones/venta-renta/',
    title: 'Venta y renta de contenedores',
    desc: 'Contenedores de 20 y 40 pies como punto de partida para tu proyecto.',
  },
  {
    to: '/contenedor-40-pies-cdmx/',
    title: 'Contenedor de 40 pies',
    desc: 'El formato de varias de las oficinas, del laboratorio y del aula móvil mostrados.',
  },
  {
    to: '/contenedor-20-pies-cdmx/',
    title: 'Contenedor de 20 pies',
    desc: 'La opción compacta de las oficinas de 20 pies.',
  },
  {
    to: '/contenedores-usados-cdmx/',
    title: 'Contenedores usados',
    desc: 'Como los tres contenedores usados que se unieron para formar un solo espacio.',
  },
];

const ProyectosRealizados: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = (images: ProjectImage[], index: number, title: string) => {
    openerRef.current = document.activeElement as HTMLElement;
    setLightbox({ images, index, title });
  };
  const close = useCallback(() => {
    setLightbox(null);
    openerRef.current?.focus();
  }, []);

  const ctaWhatsApp = () => window.open(org.contact.whatsapp, '_blank', 'noopener,noreferrer');

  const pageUrl = getCanonicalUrl(PATH);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': getWebPageId(PATH),
        url: pageUrl,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          contentUrl: `https://creativosespacios.mx${imageSrc(heroImage.file)}`,
          description: heroImage.alt,
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: allCases.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.title,
            url: `${pageUrl}#${c.id}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: getCanonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Proyectos realizados', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-white">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        ogImage={imageSrc(heroImage.file)}
        jsonLd={jsonLd}
      />

      {/* 1. APERTURA */}
      <header className="relative overflow-hidden bg-brand-petroleum pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container relative z-10 mx-auto grid items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <motion.div
            className="lg:col-span-6"
            variants={heroMotion.container}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={heroMotion.eyebrow}
              className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-brand-orange"
            >
              De contenedor a espacio
            </motion.p>
            <motion.h1
              variants={heroMotion.title}
              className="mb-8 !text-4xl leading-[1.05] text-white md:!text-5xl lg:!text-6xl"
            >
              Proyectos realizados con contenedores adaptados
            </motion.h1>
            <motion.p
              variants={heroMotion.body}
              className="mb-10 max-w-xl font-sans text-lg leading-relaxed text-white/80 md:text-xl"
            >
              Un contenedor puede convertirse en oficina, laboratorio, aula o parte de un edificio. Aquí lo
              mostramos con fotografías reales de espacios que ya existen.
            </motion.p>
            <motion.div variants={heroMotion.body} className="flex flex-wrap items-center gap-4">
              <a
                href="#proyectos"
                className="inline-flex items-center gap-3 rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-brand-petroleum"
              >
                VER LOS PROYECTOS
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <button
                onClick={ctaWhatsApp}
                className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-8 py-4 text-sm font-bold tracking-wider text-white transition-colors hover:bg-white/10"
              >
                COMENTAR MI NECESIDAD
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <figure>
              <img
                src={imageSrc(heroImage.file)}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                loading="eager"
                // @ts-expect-error fetchpriority is valid HTML but missing from React 18 typings
                fetchpriority="high"
                decoding="async"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="mx-auto h-auto w-full max-w-xl rounded-sm shadow-2xl lg:ml-auto"
              />
              <figcaption className="mx-auto mt-3 max-w-xl text-xs text-white/60 lg:ml-auto">
                MakerSpace, Santa Cruz Meyehualco.
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </header>

      {/* 2. INTRODUCCIÓN EDITORIAL */}
      <section className="container mx-auto px-6 py-20 lg:px-12 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 !text-3xl leading-tight text-brand-petroleum md:!text-4xl lg:!text-5xl">
            Cada operación necesita su propio tipo de espacio
          </h2>
          <div className="space-y-5 font-sans text-lg leading-relaxed text-slate-700">
            <p>
              Una oficina para el equipo en campo no se parece a un laboratorio, ni a un aula, ni a un inmueble
              de varios niveles. Lo que comparten es el punto de partida: una estructura resistente, fácil de
              trasladar y lista para adaptarse.
            </p>
            <p>
              Las fotografías de esta página muestran esa adaptación en distintos formatos: de 20 y 40 pies,
              nuevos y usados, solos o unidos entre sí. Algunos casos tienen nombre y ubicación; otros se
              presentan por tipo de solución, y en cada uno indicamos qué dato proviene de nuestro archivo y qué
              simplemente se aprecia en la imagen.
            </p>
          </div>

          <nav aria-label="Índice de proyectos" className="mt-12 border-t border-slate-200 pt-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">En esta página</p>
            <ul className="grid gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <a
                    href={`#${ch.id}`}
                    className="inline-block py-1 font-medium text-brand-petroleum underline decoration-brand-orange decoration-2 underline-offset-4 transition-colors hover:text-brand-orange"
                  >
                    {ch.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 3. CAPÍTULOS Y PROYECTOS */}
      <div id="proyectos" className="scroll-mt-28">
        {chapters.map((chapter, ci) => (
          <section
            key={chapter.id}
            id={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
            className={`scroll-mt-28 py-16 md:py-24 ${ci % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="container mx-auto px-6 lg:px-12">
              <header className="mb-6 max-w-3xl">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-brand-orange">
                  {chapter.eyebrow}
                </p>
                <h2
                  id={`${chapter.id}-title`}
                  className="mb-6 !text-3xl leading-tight text-brand-petroleum md:!text-4xl lg:!text-5xl"
                >
                  {chapter.title}
                </h2>
                <p className="font-sans text-lg leading-relaxed text-slate-600">{chapter.intro}</p>
              </header>

              {chapter.cases.map((item, i) => (
                <CaseSection key={item.id} item={item} reverse={i % 2 === 1} onOpen={open} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 4. RELACIÓN CON LA OFERTA */}
      <section className="container mx-auto px-6 py-20 lg:px-12 md:py-28" aria-labelledby="oferta-title">
        <div className="mb-12 max-w-3xl">
          <h2
            id="oferta-title"
            className="mb-5 !text-3xl leading-tight text-brand-petroleum md:!text-4xl lg:!text-5xl"
          >
            Si algo de esto se parece a lo que necesitas
          </h2>
          <p className="font-sans text-lg leading-relaxed text-slate-600">
            Estas son las páginas donde puedes revisar con más detalle cada tipo de solución.
          </p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-sm border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {offerLinks.map((l) => (
            <li key={l.to} className="bg-white">
              <Link
                to={l.to}
                className="group flex h-full flex-col justify-between p-7 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-orange"
              >
                <div>
                  <h3 className="mb-3 !font-sans !text-lg !font-bold text-brand-petroleum">{l.title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-slate-600">{l.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-petroleum transition-colors group-hover:text-brand-orange">
                  Ver más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. CIERRE COMERCIAL */}
      <section className="bg-brand-petroleum py-20 text-white md:py-28" aria-labelledby="cta-title">
        <div className="container mx-auto px-6 text-center lg:px-12">
          <h2 id="cta-title" className="mx-auto mb-6 max-w-3xl !text-3xl leading-tight md:!text-4xl lg:!text-5xl">
            Cuéntanos qué espacio necesitas
          </h2>
          <p className="mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-white/75">
            Para orientarte, nos ayuda saber para qué lo usarás, cuántas personas lo ocuparán y dónde estará.
            A partir de ahí revisamos contigo las opciones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={ctaWhatsApp}
              className="inline-flex items-center gap-3 rounded-sm bg-brand-orange px-10 py-4 text-sm font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-brand-petroleum"
            >
              ESCRIBIR POR WHATSAPP
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              to="/contacto/"
              className="inline-flex items-center rounded-sm border border-white/30 px-10 py-4 text-sm font-bold tracking-wider text-white transition-colors hover:bg-white/10"
            >
              IR A CONTACTO
            </Link>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          state={lightbox}
          onClose={close}
          onIndex={(i) => setLightbox({ ...lightbox, index: i })}
        />
      )}
    </div>
  );
};

export default ProyectosRealizados;
