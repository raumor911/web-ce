import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, MapPin, Truck, ShieldCheck, Clock, MessageSquare, ArrowRight, Package, HardHat, LayoutGrid, Settings } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';

const CompraContenedoresCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const products = SemanticSelectors.getProductsForService('service:container-sale');
  const generalFaq = SemanticSelectors.getGeneralFaq();

  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/compra-contenedores-cdmx');
  const webpageId = getWebPageId('/compra-contenedores-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Compra de contenedores en CDMX | Creativos Espacios",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Compra contenedores marítimos de 20 y 40 pies en Ciudad de México. Soluciones para almacenamiento, obra y operación empresarial con atención desde Iztapalapa."
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
            "name": "Compra de contenedores en CDMX",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué tamaño de contenedor necesito?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La elección depende del volumen que necesitas almacenar, el espacio disponible en tu sitio y el acceso para las maniobras de entrega. Un contenedor de 20 pies es ideal para espacios limitados, mientras que uno de 40 pies ofrece el doble de capacidad para inventarios mayores."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo comprar un contenedor usado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, en Creativos Espacios suministramos unidades verificadas estructuralmente para garantizar su hermeticidad y estabilidad, asegurando que sean aptas para almacenamiento u operación industrial."
            }
          },
          {
            "@type": "Question",
            "name": "¿La entrega está incluida?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El transporte, las maniobras y las condiciones de entrega dependen de la complejidad de cada proyecto y la ubicación exacta. Realizamos una evaluación para preparar una propuesta que incluya la logística necesaria hasta tu sitio en CDMX o zona metropolitana."
            }
          }
        ]
      }
    ]
  };

  const ctaWhatsApp = () => {
    window.open(org.contact.whatsapp, '_blank');
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Compra de contenedores en CDMX"
        description="Compra contenedores marítimos de 20 y 40 pies en Ciudad de México. Soluciones para almacenamiento, obra y operación empresarial con atención desde Iztapalapa."
        jsonLd={jsonLd}
      />
      
      {/* HERO */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt="Venta de contenedores en Ciudad de México"
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
            CONTENEDORES EN CIUDAD DE MÉXICO
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Compra contenedores marítimos en CDMX
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Contenedores de 20 y 40 pies para almacenamiento, obra, operación empresarial y proyectos que requieren espacio adicional.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Solicitar información</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención desde nuestro centro operativo en Iztapalapa, Ciudad de México.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE 2 — QUÉ PUEDES COMPRAR */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum">Contenedores según tu necesidad</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 20 pies */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-industrial group flex flex-col h-full !p-0 overflow-hidden shadow-lg border border-brand-gray/30"
          >
            <div className="aspect-video bg-brand-gray/10 p-8 flex items-center justify-center overflow-hidden border-b border-brand-gray/20">
              <img src="/images/venta-renta-contenedor-20ft.png" alt="Contenedor 20 pies" className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-serif text-brand-petroleum mb-4">Contenedor de 20 pies</h3>
              <p className="text-brand-graphite leading-relaxed mb-8 flex-1">
                Una opción compacta para almacenamiento de materiales, herramientas, inventario o equipamiento cuando el espacio disponible es limitado.
              </p>
              <a href="/contacto" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                Consultar 20 pies <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* 40 pies */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-industrial group flex flex-col h-full !p-0 overflow-hidden shadow-lg border border-brand-gray/30"
          >
            <div className="aspect-video bg-brand-gray/10 p-8 flex items-center justify-center overflow-hidden border-b border-brand-gray/20">
              <img src="/images/venta-renta-contenedor-40ft.png" alt="Contenedor 40 pies" className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-serif text-brand-petroleum mb-4">Contenedor de 40 pies</h3>
              <p className="text-brand-graphite leading-relaxed mb-8 flex-1">
                Mayor capacidad para operaciones que requieren ampliar almacenamiento o concentrar materiales y equipos en un solo espacio.
              </p>
              <a href="/contacto" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                Consultar 40 pies <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Acondicionados */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-industrial group flex flex-col h-full !p-0 overflow-hidden shadow-lg border border-brand-gray/30"
          >
            <div className="aspect-video bg-brand-gray/10 p-8 flex items-center justify-center overflow-hidden border-b border-brand-gray/20">
              <img src="/images/soluciones-oficinas.png" alt="Soluciones acondicionadas" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-serif text-brand-petroleum mb-4">Contenedores acondicionados</h3>
              <p className="text-brand-graphite leading-relaxed mb-8 flex-1">
                Cuando el proyecto requiere algo más que almacenamiento, un contenedor puede convertirse en oficina, área operativa u otra solución acondicionada.
              </p>
              <a href="/soluciones/oficinas" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all">
                Ver soluciones <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BLOQUE 3 — COMPRA POR PROBLEMA */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 md:mb-24 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">¿Para qué necesitas el contenedor?</h2>
            <p className="text-white/70 text-lg">Entendemos que la compra de un contenedor es una solución a una necesidad operativa específica.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Package, title: "Almacenamiento", text: "Amplía capacidad sin construir infraestructura permanente." },
              { icon: HardHat, title: "Obra", text: "Resguarda herramientas, materiales o equipamiento cerca del punto de operación." },
              { icon: LayoutGrid, title: "Inventario", text: "Crea capacidad adicional cuando el espacio existente ya no es suficiente." },
              { icon: Settings, title: "Proyecto especial", text: "Parte de una solución que puede requerir acondicionamiento o configuración adicional." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="h-1 w-12 bg-brand-orange group-hover:w-20 transition-all duration-500"></div>
                <item.icon className="w-10 h-10 text-brand-orange/80 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-serif">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 md:mt-24">
            <a href="/contacto" className="btn-primary inline-block">Cuéntanos qué necesitas resolver</a>
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — 20 O 40 PIES */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">¿20 o 40 pies?</h2>
            <p className="text-brand-graphite text-lg mb-10 font-sans">
              La elección depende del volumen que necesitas almacenar, espacio disponible, acceso al sitio y uso previsto.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold">20</div>
                <div>
                  <h4 className="text-xl font-serif text-brand-petroleum mb-2">20 pies</h4>
                  <ul className="space-y-2 text-brand-graphite/80">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> menor espacio requerido</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> necesidades de almacenamiento moderadas</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> proyectos con restricciones de ubicación</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold">40</div>
                <div>
                  <h4 className="text-xl font-serif text-brand-petroleum mb-2">40 pies</h4>
                  <ul className="space-y-2 text-brand-graphite/80">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> mayor volumen</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> inventario o materiales de mayor escala</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> operaciones que requieren más capacidad</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <a href="/contacto" className="btn-primary">Ayúdame a elegir</a>
            </div>
          </div>
          
          <div className="lg:w-1/2 bg-brand-gray/10 p-12 rounded-lg border border-brand-gray/30">
            <div className="aspect-[4/3] relative">
              <img src="/images/venta-renta-hero.png" alt="Comparativa de contenedores" className="h-full w-full object-cover grayscale rounded shadow-2xl" />
              <div className="absolute inset-0 bg-brand-petroleum/20 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 5 — COMPRA EN CDMX */}
      <section className="bg-brand-gray/20 border-y border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-brand-orange mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">Contenedores con atención desde Ciudad de México</h2>
            <p className="text-lg md:text-xl text-brand-graphite leading-relaxed mb-10 font-sans">
              Creativos Espacios opera desde Iztapalapa, Ciudad de México. Desde este punto coordinamos proyectos de compra, acondicionamiento y logística de contenedores para empresas y proyectos en la Ciudad de México y zona metropolitana.
            </p>
            <a href="/contacto" className="btn-secondary">Contactar con un asesor</a>
          </div>
        </div>
      </section>

      {/* BLOQUE 6 — CÓMO FUNCIONA */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum">De la necesidad al contenedor</h2>
          <p className="mt-4 text-brand-graphite/60">Nuestro proceso asegura que la solución responda a tu contexto real.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            { step: 1, title: "Consulta", text: "Cuéntanos qué necesitas almacenar o resolver" },
            { step: 2, title: "Definición", text: "Definimos capacidad y configuración" },
            { step: 3, title: "Sitio", text: "Revisamos las condiciones del sitio" },
            { step: 4, title: "Propuesta", text: "Preparamos una propuesta según el alcance" },
            { step: 5, title: "Logística", text: "Coordinamos logística y siguientes pasos" }
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-petroleum text-white font-serif text-xl">
                {item.step}
              </div>
              <h4 className="text-lg font-bold text-brand-petroleum mb-3">{item.title}</h4>
              <p className="text-sm text-brand-graphite/70 leading-relaxed">{item.text}</p>
              {idx < 4 && (
                <div className="hidden md:block absolute top-6 left-12 w-full h-[1px] bg-brand-gray -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BLOQUE 7 — FAQ COMPRA */}
      <FAQ 
        items={[
          {
            question: "¿Qué tamaño de contenedor necesito?",
            answer: "La elección depende del volumen que necesitas almacenar, espacio disponible, acceso al sitio y uso previsto. Un contenedor de 20 pies es ideal para espacios compactos, mientras que uno de 40 pies duplica la capacidad."
          },
          {
            question: "¿Puedo comprar un contenedor usado?",
            answer: "Sí, suministramos unidades verificadas estructuralmente para garantizar su hermeticidad y estabilidad estructural."
          },
          {
            question: "¿Qué diferencia hay entre un contenedor de 20 y 40 pies?",
            answer: "Principalmente el volumen de carga y el espacio que ocupan en sitio. El de 20 pies mide aproximadamente 6 metros de largo, mientras que el de 40 pies mide 12 metros."
          },
          {
            question: "¿Un contenedor puede utilizarse como bodega?",
            answer: "Es uno de sus usos más comunes. Su estructura de acero corten los hace extremadamente resistentes y seguros para el resguardo de materiales, herramientas e inventario."
          },
          {
            question: "¿Pueden acondicionar el contenedor?",
            answer: "Sí, podemos transformar contenedores en oficinas, talleres o áreas operativas personalizadas según los requerimientos de tu proyecto."
          },
          {
            question: "¿La entrega está incluida?",
            answer: "El transporte, las maniobras y las condiciones de entrega dependen del proyecto y la ubicación exacta. Cada caso se evalúa individualmente para garantizar una logística exitosa."
          }
        ]} 
        title="Preguntas frecuentes sobre compra"
        subtitle="Información clave para orientar tu decisión de compra en CDMX."
      />

      {/* BLOQUE FINAL */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Buscas comprar un contenedor en CDMX?</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-12 font-sans">
            Cuéntanos qué necesitas almacenar, dónde estará el contenedor y qué uso tendrá. Con esa información podemos orientarte hacia una solución adecuada.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/contacto" className="btn-primary">Solicitar información</a>
            <button onClick={ctaWhatsApp} className="flex items-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-bold hover:bg-white/10 transition-all rounded">
              <MessageSquare className="w-5 h-5 text-brand-orange" />
              Hablar por WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompraContenedoresCDMX;
