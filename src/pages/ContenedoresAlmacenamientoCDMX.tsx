import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, Clock, ShieldCheck, Truck, HardHat, Package, Wrench, LayoutGrid, Boxes, Warehouse, Briefcase, Info } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, WEBSITE_ID } from '../lib/canonical';
import { Link } from 'react-router-dom';

const ContenedoresAlmacenamientoCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getLocationById(org.locationId);
  const useCase = SemanticSelectors.getUseCaseById('usecase:storage');
  const faqs = SemanticSelectors.getFaqByCategory('almacenamiento');
  
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/contenedores-para-almacenamiento-cdmx');
  const webpageId = getWebPageId('/contenedores-para-almacenamiento-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Contenedores para almacenamiento en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Utiliza contenedores marítimos para almacenamiento de materiales, herramientas, inventario y equipo en Ciudad de México."
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
            "name": `Contenedores para almacenamiento en ${location?.name || 'CDMX'}`,
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

  const useCases = [
    { icon: <Package className="h-6 w-6" />, title: "Materiales", desc: "Resguardo de insumos y materiales operativos." },
    { icon: <Wrench className="h-6 w-6" />, title: "Herramientas", desc: "Espacio seguro para equipo y herramientas de trabajo." },
    { icon: <Boxes className="h-6 w-6" />, title: "Inventario", desc: "Capacidad adicional para stock y mercancías." },
    { icon: <LayoutGrid className="h-6 w-6" />, title: "Mobiliario", desc: "Almacenamiento temporal de muebles y activos." },
    { icon: <HardHat className="h-6 w-6" />, title: "Equipo", desc: "Protección para maquinaria y equipo especializado." },
    { icon: <Truck className="h-6 w-6" />, title: "Insumos", desc: "Gestión de suministros para la operación diaria." }
  ];

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Contenedores para almacenamiento en CDMX"
        description="Utiliza contenedores marítimos para almacenamiento de materiales, herramientas, inventario y equipo en Ciudad de México."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/contenedor-para-almacenamiento-resguardo.jpg"
            alt={`Contenedores para almacenamiento en ${location?.name || 'Ciudad de México'}`}
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
            {useCase?.name || 'ALMACENAMIENTO EN CONTENEDORES'}
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores para almacenamiento en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Una forma de incorporar capacidad adicional para resguardar materiales, herramientas, inventario o equipamiento cerca de la operación.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              CONSULTAR OPCIÓN DE ALMACENAMIENTO
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

      {/* BLOQUE — QUÉ PUEDES ALMACENAR */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Cuando necesitas espacio adicional
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              El uso de contenedores permite una solución de resguardo robusta y flexible para diversos tipos de activos operativos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((item, index) => (
              <div key={index} className="group overflow-hidden border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={index === 3 ? "/images/oficina-contenedor-creativos-espacios.png" : "/images/contenedor-para-almacenamiento-resguardo.jpg"} 
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

          <div className="mt-12 p-6 bg-brand-petroleum/5 border-l-4 border-brand-orange flex gap-4 items-start">
            <Info className="h-6 w-6 text-brand-orange shrink-0 mt-0.5" />
            <p className="text-brand-petroleum font-sans italic text-sm">
              La compatibilidad depende del tipo de material, condiciones ambientales y requerimientos específicos de resguardo.
            </p>
          </div>
        </div>
      </section>

      {/* BLOQUE — TEMPORAL O PERMANENTE */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-brand-petroleum md:text-4xl">
                Una necesidad temporal o de mayor duración
              </h2>
              <p className="mb-8 text-lg text-slate-600 font-sans leading-relaxed">
                La modalidad ideal depende de la duración del proyecto, la frecuencia de uso, el volumen de almacenamiento requerido y la ubicación de tu operación en la Ciudad de México.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span className="text-sm font-bold text-brand-petroleum">Proyectos temporales</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span className="text-sm font-bold text-brand-petroleum">Uso permanente</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span className="text-sm font-bold text-brand-petroleum">Expansión de inventario</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span className="text-sm font-bold text-brand-petroleum">Resguardo en sitio</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/compra-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                  COMPRA DE CONTENEDORES <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/renta-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all ml-8">
                  RENTA DE CONTENEDORES <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/oficina-contenedor-creativos-espacios.png" 
                alt="Almacenamiento en contenedores" 
                className="rounded-sm shadow-2xl grayscale"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-orange p-8 text-white max-w-xs hidden md:block">
                <p className="text-sm font-bold tracking-wider mb-2 uppercase">Modalidades Flexibles</p>
                <p className="font-sans text-white/90">Adaptamos la solución a la duración y frecuencia de tu necesidad operativa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE — TAMAÑO */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Capacidad según lo que necesitas almacenar
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 font-sans">
              Desde soluciones compactas hasta gran volumen, disponemos del tamaño adecuado para tu resguardo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SemanticSelectors.getProductsForUseCase('usecase:storage').map((product) => {
              const imageMap: Record<string, string> = {
                'product:container-20ft': '/images/venta-renta-contenedor-20ft.png',
                'product:container-40ft': '/images/venta-renta-contenedor-40ft.png',
                'product:container-40hc': '/images/venta-renta-contenedor-40ft.png'
              };
              const pathMap: Record<string, string> = {
                'product:container-20ft': '/contenedor-20-pies-cdmx',
                'product:container-40ft': '/contenedor-40-pies-cdmx',
                'product:container-40hc': '/contenedor-40-high-cube-cdmx'
              };
              
              return (
                <Link 
                  key={product.id} 
                  to={pathMap[product.id]}
                  className="group p-10 border border-slate-200 text-center hover:border-brand-orange transition-colors"
                >
                  <div className="mb-6 flex justify-center overflow-hidden rounded-sm bg-slate-50">
                    <img 
                      src={imageMap[product.id]} 
                      alt={product.name} 
                      className="h-48 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-petroleum mb-4">{product.name}</h3>
                  <span className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm tracking-widest uppercase">
                    VER DETALLES <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/soluciones/venta-renta" 
              className="inline-flex items-center gap-3 bg-brand-petroleum text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-brand-petroleum-light transition-colors"
            >
              COMPARAR TAMAÑOS
            </Link>
          </div>
        </div>
      </section>

      {/* BLOQUE FINAL */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8 text-3xl font-bold md:text-5xl">
              Cuéntanos qué necesitas almacenar
            </h2>
            <p className="mb-12 text-xl text-white/70 font-sans">
              La solución depende de qué necesites resguardar, el volumen aproximado, la ubicación en {location?.name || 'CDMX'} y la duración estimada.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
              <div className="flex gap-4 p-6 bg-white/5 rounded-sm">
                <div className="bg-brand-orange h-2 w-2 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-bold mb-1">Definición de Necesidad</h4>
                  <p className="text-sm text-white/60 font-sans">Tipo de material y volumen aproximado para recomendar el tamaño ideal.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-white/5 rounded-sm">
                <div className="bg-brand-orange h-2 w-2 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-bold mb-1">Logística y Ubicación</h4>
                  <p className="text-sm text-white/60 font-sans">Consideramos el acceso y maniobra necesarios para la entrega en sitio.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={ctaWhatsApp}
              className="bg-brand-orange px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-orange-dark transition-all inline-flex items-center gap-3"
            >
              SOLICITAR INFORMACIÓN <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <FAQ 
          items={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          eyebrow="ASESORÍA TÉCNICA"
          title="Preguntas frecuentes sobre almacenamiento"
        />
      )}
    </div>
  );
};

export default ContenedoresAlmacenamientoCDMX;
