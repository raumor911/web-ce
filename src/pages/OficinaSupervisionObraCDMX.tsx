import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ArrowRight, HardHat, Building2, Clock, Truck, Maximize, Layout, CheckCircle2, Info, Users, ClipboardCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { Knowledge } from '../semantic';
import { getCanonicalUrl, getWebPageId, getEntityId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import { coverageToAreaServed } from '../lib/semantic-schema';

const OficinaSupervisionObraCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getOrganizationLocation();
  const useCase = SemanticSelectors.getUseCaseById('usecase:site-supervision');
  const config = Knowledge.configurations.find(c => c.id === 'configuration:office-supervision');
  const faqs = SemanticSelectors.getFaqByCategory('supervision-obra');
  const products = SemanticSelectors.getProductsForUseCase('usecase:site-supervision');
  const serviceOffices = SemanticSelectors.getServiceById('service:relocatable-offices');
  const coverage = SemanticSelectors.getCoverageForService('service:relocatable-offices');

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/oficina-para-supervision-de-obra-cdmx');
  const webpageId = getWebPageId('/oficina-para-supervision-de-obra-cdmx');
  const solutionId = getEntityId('/oficina-para-supervision-de-obra-cdmx', 'solution');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Oficina para Supervisión de Obra en ${location?.name || 'CDMX'} | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": `Soluciones de oficina para supervisión de obra en ${location?.name || 'Ciudad de México'}. Configuramos espacios funcionales para personal técnico y administrativo.`
      },
      {
        "@type": "Service",
        "@id": solutionId,
        "name": "Oficina para Supervisión de Obra",
        "provider": { "@id": ORG_ID },
        "description": "Espacios modulares configurados para la coordinación y supervisión de proyectos de construcción.",
        "areaServed": coverageToAreaServed(coverage)
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
            "name": "Soluciones",
            "item": getCanonicalUrl('/soluciones/oficinas')
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `Oficina para supervisión de obra en ${location?.name || 'CDMX'}`,
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
        title={`Oficina para Supervisión de Obra en ${location?.name || 'CDMX'} | Creativos Espacios`}
        description={`Soluciones de oficina para supervisión de obra en ${location?.name || 'Ciudad de México'}. Configuramos espacios funcionales para personal técnico y administrativo, disponibles en compra o renta.`}
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Oficinas para supervisión de obra en ${location?.name || 'Ciudad de México'}`}
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
            SUPERVISIÓN DE OBRA
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Oficinas para supervisión de obra en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-6 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Un espacio de trabajo dentro de la obra, cuando tu equipo lo necesita.
          </motion.p>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-base leading-relaxed text-white/80 font-sans">
            Configuramos oficinas para supervisión, coordinación y operación en proyectos de construcción. Soluciones basadas en contenedores que pueden adaptarse a las necesidades del personal en sitio.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              COTIZAR UNA OFICINA PARA OBRA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-white/60 text-xs font-bold tracking-widest uppercase ml-2">
              Compra o renta · Atención en {location?.name || 'Ciudad de México'}
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* SECCIÓN — RECONOCIMIENTO DEL PROBLEMA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <span className="section-subtitle">OPERACIÓN EN OBRA</span>
            <h2 className="mb-6 text-3xl font-bold text-brand-petroleum md:text-4xl">
              Supervisar una obra también requiere un espacio para trabajar
            </h2>
            <p className="text-lg text-slate-600 font-sans">
              Conforme una obra crece, también crece la necesidad de coordinar personal, revisar avances, almacenar documentación, realizar reuniones y mantener un punto operativo dentro del proyecto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ClipboardCheck className="h-6 w-6" />, title: "SUPERVISIÓN", desc: "Un espacio desde donde dar seguimiento a la operación." },
              { icon: <Users className="h-6 w-6" />, title: "COORDINACIÓN", desc: "Punto de trabajo para personal técnico y administrativo." },
              { icon: <Layout className="h-6 w-6" />, title: "DOCUMENTACIÓN", desc: "Área protegida para planos, reportes y equipo." },
              { icon: <MessageSquare className="h-6 w-6" />, title: "REUNIONES", desc: "Espacio para revisión y toma de decisiones en sitio." }
            ].map((item, index) => (
              <div key={index} className="p-8 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange/20 transition-colors group">
                <div className="text-brand-orange mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-sm font-bold text-brand-petroleum mb-3 tracking-widest uppercase">{item.title}</h3>
                <p className="text-slate-600 font-sans text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN — LA SOLUCIÓN */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-orange font-bold tracking-[0.2em] text-xs mb-4 block uppercase">OFICINA PARA OBRA</span>
              <h2 className="mb-8 text-3xl font-bold md:text-4xl">
                Una oficina configurada alrededor de la operación del proyecto
              </h2>
              <p className="mb-8 text-lg text-white/70 font-sans leading-relaxed">
                La oficina puede plantearse de acuerdo con el número de personas, el uso esperado, la duración del proyecto y las condiciones del sitio. Partimos de una estructura modular para convertirla en un espacio funcional para el equipo de obra.
              </p>
              {useCase && (
                <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                  <p className="text-sm text-white/60 font-sans italic leading-relaxed">
                    "{useCase.description}"
                  </p>
                </div>
              )}
            </div>
            <div className="relative">
              <img 
                src="/images/oficina-contenedor-creativos-espacios.png" 
                alt={`Oficina de supervisión en ${location?.name || 'CDMX'}`} 
                className="rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN — CONFIGURACIÓN */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="section-subtitle">CONFIGURACIÓN</span>
            <h2 className="section-title mb-6">¿Qué puede requerir una oficina de supervisión?</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {config?.features.map((feature, index) => (
              <div key={index} className="p-8 border border-slate-100 bg-white shadow-sm rounded-sm group hover:border-brand-orange transition-colors">
                <CheckCircle2 className="h-6 w-6 text-brand-orange mx-auto mb-4" />
                <span className="text-sm font-bold uppercase tracking-widest text-brand-petroleum">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN — TAMAÑO */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-subtitle">ESPACIO DISPONIBLE</span>
            <h2 className="section-title mb-6">El tamaño depende de cómo trabajará tu equipo</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="p-10 bg-white border border-slate-100 rounded-sm hover:border-brand-orange transition-colors group shadow-sm">
                <h3 className="text-2xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{product.name}</h3>
                <div className="flex flex-col gap-1 mb-6 text-xs font-bold text-brand-orange tracking-widest uppercase">
                  <span>Nominal: {product.nominalDimensions}</span>
                  <span>Exterior: {product.externalDimensions?.lengthMm}mm × {product.externalDimensions?.widthMm}mm</span>
                </div>
                <p className="text-slate-600 font-sans mb-8 text-sm leading-relaxed">
                  {product.description}
                </p>
                <Link to={product.id === 'product:container-20ft' ? '/contenedor-20-pies-cdmx' : '/contenedor-40-pies-cdmx'} className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                  VER ESPECIFICACIONES <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-slate-500 font-sans text-sm italic">
            La elección del tamaño depende del número de personas, distribución y funciones requeridas.
          </p>
        </div>
      </section>

      {/* SECCIÓN — COMPRA O RENTA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-subtitle">MODALIDAD</span>
            <h2 className="section-title mb-6">Compra o renta según la duración del proyecto</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="p-10 bg-slate-50 border border-slate-100 rounded-sm flex flex-col items-center text-center">
              <Building2 className="h-10 w-10 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-4 uppercase tracking-widest">COMPRA</h3>
              <p className="mb-8 text-sm text-slate-600 font-sans leading-relaxed">
                Para empresas que necesitan incorporar el espacio a su infraestructura o reutilizarlo posteriormente.
              </p>
              <Link to="/compra-contenedores-cdmx" className="btn-primary w-full text-[10px] tracking-widest">
                CONSULTAR COMPRA
              </Link>
            </div>
            <div className="p-10 bg-slate-50 border border-slate-100 rounded-sm flex flex-col items-center text-center">
              <Clock className="h-10 w-10 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-4 uppercase tracking-widest">RENTA</h3>
              <p className="mb-8 text-sm text-slate-600 font-sans leading-relaxed">
                Para necesidades temporales asociadas a la duración de una obra o proyecto.
              </p>
              <Link to="/renta-contenedores-cdmx" className="btn-primary w-full text-[10px] tracking-widest">
                CONSULTAR RENTA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN — PROCESO */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-brand-orange font-bold tracking-[0.2em] text-xs mb-4 block uppercase">PROCESO</span>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Del requerimiento al espacio de trabajo</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "ENTENDEMOS LA NECESIDAD", desc: "Personas, función, tiempo y ubicación." },
              { num: "02", title: "DEFINIMOS CONFIGURACIÓN", desc: "Tamaño y acondicionamiento requerido." },
              { num: "03", title: "REVISAMOS MODALIDAD", desc: "Compra o renta según el proyecto." },
              { num: "04", title: "COTIZAMOS LA SOLUCIÓN", desc: "Se define el alcance comercial y logístico." }
            ].map((step, index) => (
              <div key={index} className="relative p-8 bg-white/5 border border-white/10 rounded-sm group hover:border-brand-orange transition-colors">
                <span className="text-4xl font-bold text-white/10 absolute top-4 right-6 group-hover:text-brand-orange/20 transition-colors">{step.num}</span>
                <h3 className="text-xs font-bold text-brand-orange mb-4 tracking-[0.2em] uppercase">{step.title}</h3>
                <p className="text-sm text-white/60 font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN — OFICINA MÓVIL VS FUNCIÓN */}
      <section className="py-24 bg-brand-white border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto p-12 bg-slate-50 rounded-sm border-l-8 border-brand-orange">
            <h2 className="text-2xl font-bold text-brand-petroleum mb-6 uppercase tracking-tight">Una oficina móvil es el producto. La supervisión de obra es la función.</h2>
            <p className="text-lg text-slate-700 font-sans leading-relaxed italic mb-8">
              "Una oficina móvil puede utilizarse en distintos contextos. Cuando se configura para supervisión de obra, el punto de partida deja de ser únicamente el contenedor y pasa a ser la forma en que el equipo necesita operar dentro del proyecto."
            </p>
            <Link to="/oficinas-moviles-cdmx" className="text-brand-orange font-bold text-xs tracking-[0.2em] uppercase hover:underline">
              CONOCER MÁS SOBRE OFICINAS MÓVILES
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN LOCAL */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="section-subtitle uppercase tracking-widest">CIUDAD DE MÉXICO</span>
            <h2 className="section-title mb-6">Soluciones para proyectos en {location?.name || 'CDMX'}</h2>
            <p className="text-lg text-slate-600 font-sans mb-10">
              {org.name} opera desde {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}, desarrollando soluciones con contenedores para necesidades temporales y operativas.
            </p>
            <div className="flex justify-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-graphite">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> ATENCIÓN EN {location?.name || 'CDMX'}</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> BASE EN {baseLocation?.name || 'IZTAPALAPA'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="mb-16 text-center text-3xl font-bold text-brand-petroleum md:text-4xl uppercase tracking-tight">
            Preguntas frecuentes sobre oficinas para supervisión
          </h2>
          <div className="max-w-3xl mx-auto grid gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 pb-8 bg-white p-8 rounded-sm shadow-sm">
                <h3 className="text-lg font-bold text-brand-petroleum mb-4 flex gap-4 items-start">
                  <span className="text-brand-orange font-serif text-2xl leading-none">?</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 font-sans pl-8 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl uppercase tracking-tight">
            Cuéntanos cómo necesita trabajar tu equipo en obra
          </h2>
          <p className="mb-12 text-xl text-white/70 max-w-3xl mx-auto font-sans">
            Con el número de personas, ubicación, tiempo de uso y necesidades principales podemos comenzar a definir la solución.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={ctaWhatsApp}
              className="bg-brand-orange px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-orange-dark transition-all inline-flex items-center gap-3 uppercase shadow-lg shadow-brand-orange/20"
            >
              REVISAR MI PROYECTO <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={ctaWhatsApp}
              className="border border-white/30 bg-white/5 backdrop-blur-sm px-12 py-5 text-sm font-bold tracking-widest hover:bg-white/10 transition-all inline-flex items-center gap-3 uppercase"
            >
              HABLAR POR WHATSAPP <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER NAV LINKS */}
      <nav className="py-12 bg-brand-white border-t border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-bold tracking-widest uppercase text-slate-400">
            <Link to="/proyectos" className="hover:text-brand-orange transition-colors">PROYECTOS</Link>
            <Link to="/soluciones/oficinas" className="hover:text-brand-orange transition-colors">OFICINAS</Link>
            <Link to="/oficinas-moviles-cdmx" className="hover:text-brand-orange transition-colors">OFICINAS MÓVILES</Link>
            <Link to="/compra-contenedores-cdmx" className="hover:text-brand-orange transition-colors">COMPRA</Link>
            <Link to="/renta-contenedores-cdmx" className="hover:text-brand-orange transition-colors">RENTA</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OficinaSupervisionObraCDMX;
