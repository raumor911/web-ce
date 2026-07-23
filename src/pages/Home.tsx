import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, CheckCircle2, ShieldCheck, Zap, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  return (
    <div className="bg-brand-white">
      <SEO 
        title="Capacidad Operativa Inmediata"
        description="Infraestructura modular para empresas y proyectos industriales en CDMX. Venta y renta de contenedores y oficinas reubicables."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.creativosespacios.mx/#webpage",
          "url": "https://www.creativosespacios.mx/",
          "name": "Creativos Espacios | Capacidad Operativa Inmediata",
          "isPartOf": { "@id": "https://www.creativosespacios.mx/#website" },
          "about": { "@id": "https://www.creativosespacios.mx/#organization" },
          "description": "Infraestructura modular para empresas y proyectos industriales en CDMX. Venta y renta de contenedores y oficinas reubicables."
        }}
      />

      {/* Hero Section - Executive focus with High Legibility */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden bg-brand-gray/20">
        <div className="absolute inset-0 z-0 opacity-20 grayscale mix-blend-multiply pointer-events-none">
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=industrial+shipping+container+complex+modern+architectural+lighting+sober+technical+photography+high+quality&image_size=landscape_16_9" 
            alt="Infraestructura Modular" 
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
                { title: "Supervisión de Obra", desc: "Oficinas habitables en el frente de trabajo." },
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Venta y Renta de Contenedores",
                desc: "Unidades estándar de 20 y 40 pies para almacenamiento y logística.",
                href: "/soluciones/venta-renta",
                img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=industrial+shipping+container+yard+clean+technical+photography+high+quality&image_size=square"
              },
              {
                title: "Oficinas Reubicables",
                desc: "Módulos administrativos equipados para uso inmediato en campo.",
                href: "/soluciones/oficinas",
                img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=interior+modern+container+office+industrial+clean+sober+photography&image_size=square"
              },
              {
                title: "Soluciones a la medida",
                desc: "Ingeniería modular para necesidades técnicas, operativas y funcionales específicas.",
                href: "/proyectos",
                img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=custom+modified+industrial+container+project+architectural+photography+clean+technical&image_size=square"
              }
            ].map((sol, i) => (
              <Link 
                key={i} 
                to={sol.href}
                className="group relative overflow-hidden bg-white aspect-[4/5] md:aspect-[4/5] flex flex-col justify-end p-8 md:p-10 transition-all duration-700 shadow-xl"
              >
                <div className="absolute inset-0 z-0 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000">
                  <img src={sol.img} alt={sol.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite via-brand-graphite/40 to-transparent opacity-80 group-hover:opacity-90"></div>
                </div>
                <div className="relative z-10 text-white">
                  <h3 className="text-2xl md:text-3xl font-serif mb-4 text-white">{sol.title}</h3>
                  <p className="text-sm md:text-base font-sans text-white/90 mb-6 leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
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
                <p className="text-brand-graphite text-base md:text-lg leading-relaxed mt-6 md:mt-8">
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
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <div className="flex flex-col items-center text-center gap-4 md:gap-6">
            <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-brand-orange" />
            <h5 className="font-bold text-[10px] uppercase tracking-[0.2em] text-brand-petroleum">Seguridad Industrial</h5>
          </div>
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
