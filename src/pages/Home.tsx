import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, CheckCircle2, Zap, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  return (
    <div className="bg-brand-white">
      <SEO 
        title="Infraestructura Modular y Contenedores"
        description="Soluciones de infraestructura modular, venta y renta de contenedores marítimos en México. Capacidad operativa sin construir desde cero."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.creativosespacios.mx/#webpage",
            "url": "https://www.creativosespacios.mx/",
            "name": "Creativos Espacios | Infraestructura Modular",
            "isPartOf": { "@id": "https://www.creativosespacios.mx/#website" },
            "about": { "@id": "https://www.creativosespacios.mx/#organization" },
            "description": "Soluciones de infraestructura modular, venta y renta de contenedores marítimos en México."
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.creativosespacios.mx/#localbusiness",
            "name": "Creativos Espacios",
            "image": "https://www.creativosespacios.mx/images/logo-creativos-espacios.png",
            "url": "https://www.creativosespacios.mx",
            "telephone": "+525554269941",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Av. del Árbol 104-Lote 2, Lomas de San Lorenzo",
              "addressLocality": "Iztapalapa",
              "addressRegion": "CDMX",
              "postalCode": "09790",
              "addressCountry": "MX"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 19.3243,
              "longitude": -99.0621
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
          }
        ]}
      />

      {/* Hero Section - Executive focus with High Legibility */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden bg-brand-gray/20">
        <div className="absolute inset-0 z-0 opacity-20 grayscale mix-blend-multiply pointer-events-none">
          <img 
            src="/images/home-hero-modular-infra.png" 
            alt="Infraestructura Modular" 
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/home-hero-modular-infra.svg';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <span className="section-subtitle !text-brand-graphite">Infraestructura Modular</span>
            <h1 className="text-brand-graphite leading-[1.1] mb-6 md:mb-8">
              Capacidad operativa <br className="hidden md:block" />
              <span className="text-brand-orange">sin construir desde cero.</span>
            </h1>
            <p className="text-brand-graphite text-lg md:text-2xl font-sans mb-10 md:mb-12 max-w-3xl leading-relaxed">
                Venta y renta de contenedores, oficinas reubicables y espacios modulares para empresas, industria y proyectos con cobertura nacional.
              </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <a href="https://wa.me/522291846751" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Solicitar Cotización
              </a>
              <Link to="/soluciones" className="btn-outline">
                Ver Soluciones
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Need Section - Narrative start */}
      <section className="py-20 md:py-32 bg-brand-white border-b border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="section-subtitle">Necesidad Operativa</span>
              <h2 className="section-title">Cuando el espacio limita su ejecución, nosotros habilitamos su operación.</h2>
              <p className="text-brand-graphite text-lg md:text-xl leading-relaxed mb-8">
                Entendemos que la infraestructura tradicional es lenta y costosa. Nuestra propuesta modular permite a las empresas expandirse, supervisar obras y almacenar activos de forma inmediata.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[
                { title: "Ampliación Rápida", desc: "Incorporación de espacio en plazos definidos por proyecto." },
                { title: "Supervisión de Obra", desc: "Oficinas reubicables para supervisión y coordinación en sitio." },
                { title: "Resguardo Seguro", desc: "Espacio resistente para resguardo de materiales." },
                { title: "Flexibilidad Total", desc: "Renta por proyecto o adquisición permanente." }
              ].map((item, i) => (
                <div key={i} className="p-6 md:p-8 border-l-4 border-brand-orange bg-brand-gray/30">
                  <h4 className="font-bold text-sm md:text-base uppercase tracking-wider mb-2 md:mb-3 text-brand-petroleum">{item.title}</h4>
                  <p className="text-xs md:text-sm text-brand-graphite font-sans leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid - The "How" */}
      <section className="py-20 md:py-32 bg-brand-gray/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
            <span className="section-subtitle">Portafolio de soluciones</span>
            <h2 className="section-title">Espacios para operar, ampliar y ejecutar proyectos.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                title: "Venta y Renta de Contenedores",
                desc: "Unidades estándar de 20 y 40 pies para almacenamiento y logística.",
                href: "/soluciones/venta-renta",
                img: "/images/home-solution-containers.png",
                fallbackImg: "/images/home-solution-containers.svg"
              },
              {
                title: "Oficinas Reubicables",
                desc: "Módulos administrativos equipados para uso inmediato en campo.",
                href: "/soluciones/oficinas",
                img: "/images/home-solution-offices.png",
                fallbackImg: "/images/home-solution-offices.svg"
              },
              {
                title: "Soluciones a la medida",
                desc: "Ingeniería modular para necesidades técnicas, operativas y funcionales específicas.",
                href: "/proyectos",
                img: "/images/home-solution-projects.png",
                fallbackImg: "/images/home-solution-projects.svg"
              }
            ].map((sol, i) => (
              <Link 
                key={i} 
                to={sol.href}
                className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-white p-8 transition-all duration-700 shadow-xl md:min-h-[500px] md:p-10 xl:aspect-[4/5] xl:min-h-0"
              >
                <div className="absolute inset-0 z-0 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000">
                  <img
                    src={sol.img}
                    alt={sol.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = sol.fallbackImg;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite via-brand-graphite/40 to-transparent opacity-80 group-hover:opacity-90"></div>
                </div>
                <div className="relative z-10 text-white">
                  <h3 className="mb-4 text-2xl leading-[1.08] text-white md:text-3xl font-serif [text-wrap:balance]">{sol.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-white/90 opacity-100 transition-opacity duration-500 md:text-base xl:opacity-0 xl:group-hover:opacity-100">
                    {sol.desc}
                  </p>
                  <span className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-orange">
                    Explorar <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - B2B Confidence */}
      <section className="py-20 md:py-32 bg-brand-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
            <div className="lg:col-span-1">
              <span className="section-subtitle">Nuestro Método</span>
              <h2 className="section-title">Definimos cada proyecto antes de llevarlo a producción.</h2>
                <p className="text-brand-graphite text-base md:text-lg leading-relaxed mt-6 md:mt-8 text-justify">
                  Aclaramos el uso, el alcance y los requerimientos técnicos para preparar una solución alineada con la operación.
                </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-12 md:gap-y-20">
              {[
                { num: "01", title: "Entendimiento", desc: "Análisis de necesidades operativas y restricciones de sitio." },
                { num: "02", title: "Definición", desc: "Selección de unidades y especificaciones de habilitación." },
                { num: "03", title: "Preparación", desc: "Acondicionamiento técnico en nuestro centro operativo." },
                { num: "04", title: "Coordinación", desc: "Logística especializada y posicionamiento final." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 md:gap-8">
                  <span className="font-serif text-4xl md:text-6xl text-brand-orange/20 leading-none">{step.num}</span>
                  <div>
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3 md:mb-4 text-brand-petroleum">{step.title}</h4>
                    <p className="text-sm md:text-base text-brand-graphite leading-relaxed font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Markers - High Legibility */}
      <section className="py-16 md:py-24 bg-brand-gray/20 border-y border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="flex flex-col items-center text-center gap-4 md:gap-6">
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-brand-orange" />
            <h5 className="font-bold text-[10px] uppercase tracking-[0.2em] text-brand-petroleum">Disponibilidad sujeta a inventario y ubicación</h5>
          </div>
          <div className="flex flex-col items-center text-center gap-4 md:gap-6">
            <Truck className="w-10 h-10 md:w-12 md:h-12 text-brand-orange" />
            <h5 className="font-bold text-[10px] uppercase tracking-[0.2em] text-brand-petroleum">Coordinación de transporte y posicionamiento</h5>
          </div>
          <div className="flex flex-col items-center text-center gap-4 md:gap-6">
            <Box className="w-10 h-10 md:w-12 md:h-12 text-brand-orange" />
            <h5 className="font-bold text-[10px] uppercase tracking-[0.2em] text-brand-petroleum">Calidad Estructural</h5>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-40 bg-brand-white text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <h2 className="mb-10 md:mb-16 leading-tight">
            ¿Listo para incorporar capacidad <br />
            operativa en su proyecto?
          </h2>
          <a href="https://wa.me/522291846751" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Solicitar Cotización
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
