import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { FAQ } from '../components/FAQ';
import { 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Truck, 
  Boxes, 
  HardHat, 
  ShoppingCart, 
  Clock, 
  Layout, 
  MessageSquare,
  Briefcase,
  Store,
  Factory,
  Compass,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { SemanticSelectors } from '../semantic/selectors';
import { Knowledge } from '../semantic';
import { getCanonicalUrl, getWebPageId, getEntityId, ORG_ID, WEBSITE_ID } from '../lib/canonical';
import { coverageToAreaServed } from '../lib/semantic-schema';

const ProveedorContenedoresCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const location = SemanticSelectors.getLocationById('loc:cdmx');
  const baseLocation = SemanticSelectors.getOrganizationLocation();
  const faqs = SemanticSelectors.getFaqByCategory('proveedor-contenedores');
  
  // Products
  const product20ft = SemanticSelectors.getProductById('product:container-20ft');
  const product40ft = SemanticSelectors.getProductById('product:container-40ft');
  const product40hc = SemanticSelectors.getProductById('product:container-40hc');
  const products = [product20ft, product40ft, product40hc].filter(Boolean);

  // Industries from Core
  const indConstruction = Knowledge.industries.find(i => i.id === 'industry:construction');
  const indLogistics = Knowledge.industries.find(i => i.id === 'industry:logistics');
  const indManufacturing = Knowledge.industries.find(i => i.id === 'industry:manufacturing');
  const indIndustrial = Knowledge.industries.find(i => i.id === 'industry:industrial');
  const indCommerce = Knowledge.industries.find(i => i.id === 'industry:commerce');
  const indTemp = Knowledge.industries.find(i => i.id === 'industry:temporary-projects');

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/proveedor-de-contenedores-cdmx');
  const webpageId = getWebPageId('/proveedor-de-contenedores-cdmx');
  const providerServiceId = getEntityId('/proveedor-de-contenedores-cdmx', 'provider-service');

  // Coverage for services
  const saleCoverage = SemanticSelectors.getCoverageForService('service:container-sale');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": `Proveedor de Contenedores en CDMX | Venta y Renta | Creativos Espacios`,
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Venta y renta de contenedores para almacenamiento, obra, inventario, operación y proyectos en Ciudad de México. Encuentra la alternativa adecuada según lo que necesita tu empresa."
      },
      {
        "@type": "Service",
        "@id": providerServiceId,
        "name": "Proveedor de Contenedores para Empresas y Proyectos",
        "provider": { "@id": ORG_ID },
        "description": "Suministro de contenedores marítimos para diversas industrias en la Ciudad de México.",
        "areaServed": coverageToAreaServed(saleCoverage)
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
            "item": getCanonicalUrl('/soluciones/venta-renta')
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Proveedor de contenedores en CDMX",
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
        title="Proveedor de Contenedores en CDMX | Venta y Renta | Creativos Espacios"
        description="Venta y renta de contenedores para almacenamiento, obra, inventario, operación y proyectos en Ciudad de México. Encuentra la alternativa adecuada según lo que necesita tu empresa."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt={`Proveedor de contenedores en ${location?.name || 'Ciudad de México'}`}
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
            VENTA Y RENTA DE CONTENEDORES
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Contenedores para empresas y proyectos en {location?.name || 'CDMX'}
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Desde almacenar materiales e inventario hasta habilitar espacios temporales dentro de una operación. Cuéntanos qué necesita resolver tu empresa y revisamos qué tipo de contenedor puede funcionar.
          </motion.p>
          
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={ctaWhatsApp}
              className="group relative flex items-center gap-3 overflow-hidden rounded-sm bg-brand-orange px-8 py-4 text-sm font-bold tracking-wider text-white transition-all hover:bg-brand-orange-dark"
            >
              SOLICITAR COTIZACIÓN
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={ctaWhatsApp}
              className="flex items-center gap-3 rounded-sm border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              HABLAR POR WHATSAPP
            </button>
          </motion.div>
          
          <motion.div variants={heroMotion.body} className="mt-12 flex flex-wrap gap-6 text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase">
            {products.map(p => (
              <span key={p?.id} className="flex items-center gap-2">
                <div className="h-1 w-1 bg-brand-orange"></div>
                {p?.nominalDimensions.split(' × ')[0]}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </header>

      {/* SECCIÓN — PARA QUÉ SIRVE */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-20 max-w-3xl">
            <span className="section-subtitle">¿PARA QUÉ LOS NECESITAS?</span>
            <h2 className="section-title mb-6">Un contenedor puede resolver necesidades muy diferentes</h2>
            <p className="text-lg text-slate-600 font-sans">
              La versatilidad de los contenedores marítimos permite integrarlos en diversos contextos operativos, proporcionando una solución robusta y rápida de implementar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CONSTRUCCIÓN */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <HardHat className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{indConstruction?.name || 'Construcción'}</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Materiales e insumos cerca de la obra</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                Un contenedor puede utilizarse para resguardar herramienta, materiales, consumibles y otros insumos que necesitan permanecer disponibles durante el desarrollo del proyecto.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/contenedores-para-obra-cdmx" className="text-[10px] font-bold tracking-widest text-brand-petroleum hover:text-brand-orange flex items-center gap-2 transition-colors uppercase">
                  VER SOLUCIONES PARA OBRA <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/contenedores-para-almacenamiento-cdmx" className="text-[10px] font-bold tracking-widest text-brand-petroleum hover:text-brand-orange flex items-center gap-2 transition-colors uppercase">
                  VER ALMACENAMIENTO <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* RETAIL */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <Store className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{indCommerce?.name || 'Tiendas y cadenas comerciales'}</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Inventario temporal y capacidad adicional</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                Una tienda, centro de distribución o cadena comercial puede necesitar espacio adicional para inventario durante temporadas de alta demanda, remodelaciones, aperturas o movimientos temporales de mercancía.
              </p>
            </div>

            {/* MANUFACTURA */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <Factory className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{indManufacturing?.name || 'Manufactura e industria'}</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Inventario, refacciones y espacio auxiliar</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                Una planta puede requerir capacidad adicional para resguardar materia prima, refacciones, herramientas, producto terminado o materiales durante una ampliación, mantenimiento o reorganización interna.
              </p>
            </div>

            {/* MINERÍA */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <Compass className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">Minería</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Herramientas, refacciones e insumos en sitio</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                En operaciones mineras o industriales alejadas de centros urbanos, un contenedor puede utilizarse como espacio de resguardo para herramientas, refacciones, consumibles y equipo requerido en sitio.
              </p>
            </div>

            {/* LOGÍSTICA */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <Truck className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{indLogistics?.name || 'Logística y distribución'}</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Capacidad adicional operativa</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                Los contenedores pueden utilizarse como espacio auxiliar para mercancía, inventario o materiales durante movimientos y necesidades temporales de la operación.
              </p>
            </div>

            {/* PROYECTOS TEMPORALES */}
            <div className="p-10 border border-slate-100 bg-slate-50/50 rounded-sm hover:border-brand-orange transition-colors group">
              <Clock className="h-8 w-8 text-brand-orange mb-6" />
              <h3 className="text-xl font-bold text-brand-petroleum mb-2 uppercase tracking-tight">{indTemp?.name || 'Proyectos temporales'}</h3>
              <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-4">Espacio disponible por periodo determinado</p>
              <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
                Cuando una operación o proyecto necesita espacio sólo durante un periodo determinado, la renta permite incorporar capacidad sin convertirla necesariamente en infraestructura permanente.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/renta-contenedores-cdmx" className="text-[10px] font-bold tracking-widest text-brand-petroleum hover:text-brand-orange flex items-center gap-2 transition-colors uppercase">
                  VER RENTA DE CONTENEDORES <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/proyectos" className="text-[10px] font-bold tracking-widest text-brand-petroleum hover:text-brand-orange flex items-center gap-2 transition-colors uppercase">
                  VER PROYECTOS <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN — PRIMERO LA NECESIDAD */}
      <section className="py-24 bg-brand-petroleum text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <span className="text-brand-orange font-bold tracking-[0.2em] text-xs mb-4 block uppercase">ELEGIR EL CONTENEDOR</span>
            <h2 className="mb-8 text-3xl font-bold md:text-5xl leading-tight">Primero la necesidad. Después el contenedor.</h2>
            <p className="mb-12 text-lg text-white/70 font-sans leading-relaxed max-w-3xl">
              El tamaño adecuado depende de qué vas a almacenar, cuánto espacio necesitas, dónde se utilizará y durante cuánto tiempo. Por eso una cotización no debería comenzar únicamente preguntando si buscas un contenedor de 20 o 40 pies.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((p) => (
                <div key={p?.id} className="p-8 bg-white/5 border border-white/10 rounded-sm group hover:border-brand-orange transition-colors">
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{p?.name.replace('Contenedor marítimo ', '')}</h3>
                  <p className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-6">{p?.nominalDimensions}</p>
                  <ul className="space-y-3 mb-8">
                    {p?.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs text-white/50 font-sans flex items-center gap-2 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3 text-brand-orange/40" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={p?.id === 'product:container-20ft' ? '/contenedor-20-pies-cdmx' : (p?.id === 'product:container-40ft' ? '/contenedor-40-pies-cdmx' : '/contenedor-40-high-cube-cdmx')} className="text-[10px] font-bold tracking-widest text-white hover:text-brand-orange transition-colors uppercase flex items-center gap-2">
                    ESPECIFICACIONES <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN — NECESIDAD CONCRETA */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-subtitle">¿QUÉ NECESITA TU EMPRESA?</span>
            <h2 className="section-title mb-6">Encuentra la alternativa según lo que necesitas resolver</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: "NECESITO ALMACENAR", desc: "Inventario, materiales, herramientas, refacciones o insumos.", link: "/contenedores-para-almacenamiento-cdmx", label: "VER ALMACENAMIENTO", icon: <Boxes className="h-6 w-6" /> },
              { title: "NECESITO UNA BODEGA", desc: "Capacidad adicional cuando no quieres construir una instalación permanente.", link: "/contenedores-para-bodega-cdmx", label: "VER BODEGAS", icon: <Building2 className="h-6 w-6" /> },
              { title: "NECESITO PARA OBRA", desc: "Espacio para materiales, herramienta o necesidades temporales.", link: "/contenedores-para-obra-cdmx", label: "VER SOLUCIONES OBRA", icon: <HardHat className="h-6 w-6" /> },
              { title: "ESPACIO DE TRABAJO", desc: "Espacios móviles o acondicionados para necesidades operativas.", link: "/oficinas-moviles-cdmx", label: "VER OFICINAS MÓVILES", icon: <Layout className="h-6 w-6" /> }
            ].map((item, index) => (
              <div key={index} className="p-8 bg-slate-50 border border-slate-100 rounded-sm flex flex-col items-center text-center group hover:border-brand-orange transition-colors">
                <div className="text-brand-orange mb-6">{item.icon}</div>
                <h3 className="text-sm font-bold text-brand-petroleum mb-4 uppercase tracking-widest">{item.title}</h3>
                <p className="text-slate-600 font-sans text-xs leading-relaxed mb-8 flex-grow">{item.desc}</p>
                <Link to={item.link} className="btn-primary w-full text-[9px] tracking-widest uppercase">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN — COMPRA O RENTA */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-subtitle">MODALIDAD</span>
            <h2 className="section-title mb-6">¿Comprar o rentar?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="p-10 bg-white border border-slate-100 rounded-sm group hover:border-brand-orange transition-colors">
              <ShoppingCart className="h-10 w-10 text-brand-orange mb-6" />
              <h3 className="text-2xl font-bold text-brand-petroleum mb-4 uppercase tracking-tight">COMPRA</h3>
              <p className="text-slate-600 font-sans mb-8 text-sm leading-relaxed">
                Cuando la empresa quiere incorporar el contenedor a su infraestructura, reutilizarlo o mantenerlo disponible para necesidades recurrentes.
              </p>
              <Link to="/compra-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                VER COMPRA <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-10 bg-white border border-slate-100 rounded-sm group hover:border-brand-orange transition-colors">
              <Clock className="h-10 w-10 text-brand-orange mb-6" />
              <h3 className="text-2xl font-bold text-brand-petroleum mb-4 uppercase tracking-tight">RENTA</h3>
              <p className="text-slate-600 font-sans mb-8 text-sm leading-relaxed">
                Cuando la necesidad está asociada a un proyecto, temporada o periodo determinado de tiempo.
              </p>
              <Link to="/renta-contenedores-cdmx" className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                VER RENTA <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN — REQUERIMIENTOS EMPRESARIALES */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto p-12 bg-brand-petroleum text-white rounded-sm">
            <span className="text-brand-orange font-bold tracking-[0.2em] text-xs mb-4 block uppercase">REQUERIMIENTOS EMPRESARIALES</span>
            <h2 className="text-3xl font-bold mb-8 md:text-4xl leading-tight">Cuando el requerimiento va más allá de un solo contenedor</h2>
            <p className="text-lg text-white/70 font-sans mb-10 leading-relaxed max-w-2xl mx-auto">
              Algunas necesidades implican varias unidades, diferentes tamaños, compra o renta, acondicionamiento o una combinación de soluciones. Podemos revisar el requerimiento completo antes de definir la alternativa.
            </p>
            <Link to="/proyectos" className="bg-brand-orange px-10 py-4 text-xs font-bold tracking-widest hover:bg-brand-orange-dark transition-all inline-flex items-center gap-3 uppercase">
              REVISAR UN REQUERIMIENTO <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN — MENSAJE CENTRAL */}
      <section className="py-24 bg-brand-white border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <Zap className="h-12 w-12 text-brand-orange mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-brand-petroleum mb-8 uppercase tracking-tight">No necesitas llegar sabiendo qué contenedor comprar</h2>
            <p className="text-xl text-slate-600 font-sans leading-relaxed italic">
              "Puedes decirnos qué necesitas almacenar, cuántas unidades requieres, dónde serán utilizadas y durante cuánto tiempo. A partir de ahí podemos revisar el tamaño, modalidad y configuración adecuada."
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN LOCAL */}
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="section-subtitle">CIUDAD DE MÉXICO</span>
            <h2 className="section-title mb-6">Contenedores para empresas y proyectos en CDMX</h2>
            <p className="text-lg text-slate-600 font-sans mb-10">
              {org.name} opera desde {baseLocation?.name || 'Iztapalapa'}, {location?.name || 'Ciudad de México'}, atendiendo requerimientos de venta, renta y proyectos con contenedores para diversas industrias.
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
            Preguntas frecuentes sobre suministro de contenedores
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
          <span className="text-brand-orange font-bold tracking-[0.2em] text-xs mb-4 block uppercase">COTIZACIÓN</span>
          <h2 className="mb-8 text-3xl font-bold md:text-5xl uppercase tracking-tight">
            ¿Qué necesita resolver tu empresa?
          </h2>
          <p className="mb-12 text-xl text-white/70 max-w-3xl mx-auto font-sans leading-relaxed">
            Comparte el uso, cantidad, ubicación y tiempo durante el que necesitas los contenedores. Con esa información podemos comenzar a revisar tu requerimiento.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={ctaWhatsApp}
              className="bg-brand-orange px-12 py-5 text-sm font-bold tracking-widest hover:bg-brand-orange-dark transition-all inline-flex items-center gap-3 uppercase shadow-lg shadow-brand-orange/20"
            >
              SOLICITAR COTIZACIÓN <ArrowRight className="h-4 w-4" />
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
            <Link to="/compra-contenedores-cdmx" className="hover:text-brand-orange transition-colors">COMPRA</Link>
            <Link to="/renta-contenedores-cdmx" className="hover:text-brand-orange transition-colors">RENTA</Link>
            <Link to="/contenedores-usados-cdmx" className="hover:text-brand-orange transition-colors">USADOS</Link>
            <Link to="/proyectos" className="hover:text-brand-orange transition-colors">PROYECTOS</Link>
            <Link to="/oficinas-moviles-cdmx" className="hover:text-brand-orange transition-colors">OFICINAS</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProveedorContenedoresCDMX;
