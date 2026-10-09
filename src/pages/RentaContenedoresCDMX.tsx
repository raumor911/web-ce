import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, MapPin, MessageSquare, ArrowRight, Clock, ShieldCheck, Truck, HardHat, Package, Wrench, Maximize } from 'lucide-react';
import { getHeroMotionConfig } from '../lib/heroMotion';
import { FAQ } from '../components/FAQ';
import { SemanticSelectors } from '../semantic/selectors';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';

const RentaContenedoresCDMX: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const reducedMotion = useReducedMotion();
  const heroMotion = getHeroMotionConfig(Boolean(reducedMotion));

  const pageUrl = getCanonicalUrl('/renta-contenedores-cdmx');
  const webpageId = getWebPageId('/renta-contenedores-cdmx');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Renta de contenedores en CDMX | Creativos Espacios",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Renta contenedores para almacenamiento, obra y necesidades temporales en Ciudad de México. Soluciones de 20 y 40 pies según el alcance del proyecto."
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
            "name": "Renta de contenedores en CDMX",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Por cuánto tiempo puedo rentar un contenedor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La duración de la renta es flexible y se adapta a la etapa o periodo operativo de tu proyecto. Evaluamos cada caso para ofrecerte una solución que cubra tu necesidad temporal de almacenamiento."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué tamaño puedo rentar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contamos con unidades de 20 y 40 pies disponibles para renta. La elección depende del volumen de materiales o inventario que necesites resguardar y del espacio disponible en tu ubicación."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué condiciones debe tener el lugar donde se colocará?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El sitio debe contar con terreno firme y nivelado, además de espacio suficiente para las maniobras del camión que realizará la entrega y el posicionamiento de la unidad."
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
        title="Renta de contenedores en CDMX"
        description="Renta contenedores para almacenamiento, obra y necesidades temporales en Ciudad de México. Soluciones de 20 y 40 pies según el alcance del proyecto."
        jsonLd={jsonLd}
      />
      
      {/* HERO RENTA */}
      <header className="group relative overflow-hidden border-b border-[rgba(255,255,255,0.12)] bg-brand-petroleum py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src="/images/venta-renta-hero.png"
            alt="Renta de contenedores en Ciudad de México"
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
            ALMACENAMIENTO TEMPORAL EN CDMX
          </motion.span>
          <motion.h1 variants={heroMotion.title} className="mb-8 leading-tight text-white max-w-4xl">
            Renta contenedores en CDMX
          </motion.h1>
          <motion.p variants={heroMotion.body} className="mb-10 max-w-2xl text-lg leading-relaxed text-white md:text-xl font-sans">
            Obtén espacio adicional para materiales, inventario, herramientas o proyectos sin convertir una necesidad temporal en infraestructura permanente.
          </motion.p>
          <motion.div variants={heroMotion.body} className="flex flex-wrap gap-4">
            <a href="/contacto" className="btn-primary">Cotizar renta</a>
            <button onClick={ctaWhatsApp} className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
              Hablar por WhatsApp
            </button>
          </motion.div>
          <motion.p variants={heroMotion.body} className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-brand-orange" />
            Atención desde Iztapalapa, Ciudad de México.
          </motion.p>
        </motion.div>
      </header>

      {/* BLOQUE 2 — POR QUÉ RENTAR */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum max-w-3xl">Cuando necesitas espacio, pero no necesariamente comprarlo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum">Temporalidad</h3>
            <p className="text-brand-graphite leading-relaxed">Útil para necesidades vinculadas a una etapa, proyecto o periodo operativo.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum">Flexibilidad</h3>
            <p className="text-brand-graphite leading-relaxed">La capacidad puede responder a una necesidad temporal sin construir espacio permanente.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum">Proximidad operativa</h3>
            <p className="text-brand-graphite leading-relaxed">Permite disponer de almacenamiento donde se desarrolla el trabajo.</p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-brand-orange"></div>
            <h3 className="text-xl font-serif text-brand-petroleum">Escalabilidad</h3>
            <p className="text-brand-graphite leading-relaxed">Puede complementar infraestructura existente durante picos de operación.</p>
          </div>
        </div>
      </section>

      {/* BLOQUE 3 — CASOS DE USO */}
      <section className="bg-brand-gray/20 border-y border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 md:mb-24 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum">¿Dónde puede ayudarte un contenedor rentado?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HardHat, title: "Obra", text: "Herramientas, materiales y equipamiento cerca del proyecto." },
              { icon: Package, title: "Inventario temporal", text: "Capacidad adicional durante temporadas, proyectos o cambios operativos." },
              { icon: Wrench, title: "Equipamiento", text: "Resguardo de activos y materiales en el punto donde se necesitan." },
              { icon: Maximize, title: "Expansión temporal", text: "Espacio adicional mientras una necesidad permanece activa." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 border border-brand-gray shadow-sm hover:shadow-md transition-shadow group">
                <item.icon className="w-10 h-10 text-brand-orange mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-serif text-brand-petroleum mb-4">{item.title}</h4>
                <p className="text-brand-graphite leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — 20 Y 40 PIES */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum mb-8">Capacidad según tu operación</h2>
            <p className="text-brand-graphite text-lg mb-12 font-sans leading-relaxed">
              Ofrecemos opciones de renta que se adaptan al volumen de carga y espacio disponible en tu sitio operativo.
            </p>
            
            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-brand-gray/30 flex items-center justify-center rounded">
                  <img src="/images/venta-renta-contenedor-20ft.png" alt="20 pies" className="h-12 w-auto grayscale" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-petroleum mb-3">Contenedor de 20 pies</h4>
                  <p className="text-brand-graphite/70 text-sm leading-relaxed">
                    Ideal para proyectos con restricciones de espacio o necesidades de almacenamiento moderadas. Fácil de posicionar en entornos urbanos o sitios de obra compactos.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-brand-gray/30 flex items-center justify-center rounded">
                  <img src="/images/venta-renta-contenedor-40ft.png" alt="40 pies" className="h-12 w-auto grayscale" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-petroleum mb-3">Contenedor de 40 pies</h4>
                  <p className="text-brand-graphite/70 text-sm leading-relaxed">
                    Maximiza la capacidad de almacenamiento en una sola unidad. Recomendado para inventarios a gran escala o proyectos que requieren concentrar gran volumen de materiales.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-petroleum p-1 px-1 rounded-lg">
            <div className="bg-brand-white p-8 md:p-12 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-serif text-brand-petroleum mb-6">Evaluación de sitio</h3>
              <p className="text-brand-graphite mb-8 leading-relaxed italic">
                "La elección de la unidad depende no solo del volumen, sino de la accesibilidad para el transporte y las maniobras de descarga."
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="h-5 w-5 text-brand-orange" /> Terreno firme y nivelado</li>
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="h-5 w-5 text-brand-orange" /> Espacio para radio de giro de grúa o camión</li>
                <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="h-5 w-5 text-brand-orange" /> Ausencia de cables de baja altura</li>
              </ul>
              <a href="/contacto" className="btn-primary w-full text-center">Solicitar evaluación</a>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 5 — RENTA EN CDMX */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif mb-8">Renta de contenedores desde Ciudad de México</h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-sans">
              Nuestra operación se encuentra en Iztapalapa, desde donde atendemos necesidades de infraestructura temporal y almacenamiento para proyectos en Ciudad de México y otras zonas según su alcance.
            </p>
            <div className="h-1 w-20 bg-brand-orange mx-auto"></div>
          </div>
        </div>
      </section>

      {/* BLOQUE 6 — QUÉ NECESITAMOS SABER */}
      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-petroleum mb-6">Para cotizar necesitamos entender el proyecto</h2>
            <p className="text-brand-graphite leading-relaxed">Esta información nos permite preparar una propuesta comercial precisa y viable logísticamente.</p>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            {[
              "Uso del contenedor",
              "Tamaño aproximado (20 o 40 pies)",
              "Ubicación exacta de entrega",
              "Duración estimada de la renta",
              "Condiciones de acceso al sitio",
              "Necesidad de maniobra especial",
              "Requerimientos adicionales"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4 border-b border-brand-gray/30">
                <div className="h-2 w-2 bg-brand-orange rounded-full"></div>
                <span className="text-brand-petroleum font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 7 — PROCESO */}
      <section className="bg-brand-gray/20 border-t border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 md:mb-24 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-petroleum">Cómo funciona la renta</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {[
              { step: "01", title: "Necesidad", text: "Describe la necesidad operativa" },
              { step: "02", title: "Definición", text: "Definimos tamaño y configuración" },
              { step: "03", title: "Viabilidad", text: "Revisamos ubicación y acceso" },
              { step: "04", title: "Logística", text: "Establecemos alcance y logística" },
              { step: "05", title: "Propuesta", text: "Preparamos propuesta formal" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <span className="text-4xl font-serif text-brand-orange/30 block">{item.step}</span>
                <h4 className="text-lg font-bold text-brand-petroleum">{item.title}</h4>
                <p className="text-sm text-brand-graphite/60 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ RENTA */}
      <FAQ 
        items={[
          {
            question: "¿Por cuánto tiempo puedo rentar un contenedor?",
            answer: "La duración es flexible y se define según las etapas de tu proyecto o necesidades operativas temporales."
          },
          {
            question: "¿Qué tamaño puedo rentar?",
            answer: "Disponemos de unidades de 20 y 40 pies. Evaluamos cuál se adapta mejor a tu volumen de carga y espacio disponible."
          },
          {
            question: "¿Puedo utilizarlo como bodega temporal?",
            answer: "Sí, es una de las aplicaciones principales para resguardo seguro de activos en sitios sin infraestructura permanente."
          },
          {
            question: "¿Sirve para almacenar materiales de obra?",
            answer: "Totalmente. Su estructura de acero proporciona seguridad contra intemperie y robos en entornos de construcción."
          },
          {
            question: "¿El transporte está incluido?",
            answer: "La logística se cotiza de forma independiente según la ubicación y complejidad de las maniobras requeridas."
          },
          {
            question: "¿Qué condiciones debe tener el lugar donde se colocará?",
            answer: "Se requiere un suelo firme, nivelado y espacio libre para el despliegue del equipo de transporte y descarga."
          }
        ]} 
        title="Preguntas frecuentes sobre renta"
        subtitle="Todo lo que necesitas saber para gestionar infraestructura temporal en CDMX."
      />

      {/* BLOQUE FINAL RENTA */}
      <section className="bg-brand-petroleum py-20 md:py-32 text-white border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Necesitas espacio temporal en CDMX?</h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-12 font-sans">
            Dinos qué necesitas almacenar, dónde estará el contenedor y durante cuánto tiempo lo necesitas.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/contacto" className="btn-primary">Solicitar cotización</a>
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

export default RentaContenedoresCDMX;
