import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { SemanticSelectors } from '../semantic/selectors';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';

const Privacidad: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const pageUrl = getCanonicalUrl('/privacidad');
  const webpageId = getWebPageId('/privacidad');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Aviso de Privacidad | Creativos Espacios",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Aviso de Privacidad de Creativos Espacios. Conozca cómo protegemos y tratamos sus datos personales."
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
            "name": "Aviso de Privacidad",
            "item": pageUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Aviso de Privacidad | Creativos Espacios"
        description="Aviso de Privacidad de Creativos Espacios. Conozca cómo protegemos y tratamos sus datos personales."
        jsonLd={jsonLd}
      />

      <header className="bg-brand-gray/20 py-20 border-b border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-subtitle">Legal</span>
            <h1 className="text-brand-graphite mb-6">Aviso de Privacidad</h1>
            <p className="text-brand-graphite/60 text-sm font-mono uppercase tracking-widest">
              Última actualización: 2026-10-02
            </p>
          </motion.div>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">1. Responsable del Tratamiento</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  {org.name}, con domicilio en {org.contact.address.formattedAddress}, es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">2. Finalidades del Tratamiento</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias para el servicio que solicita:
                </p>
                <ul className="space-y-6 list-none mt-8">
                  {[
                    "Proveer los servicios y productos requeridos.",
                    "Informar sobre cambios o nuevos productos o servicios.",
                    "Dar cumplimiento a obligaciones contraídas con nuestros clientes.",
                    "Evaluar la calidad del servicio.",
                    "Realizar estudios internos sobre hábitos de consumo."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-brand-graphite/80 text-base md:text-lg font-sans">
                      <div className="w-1.5 h-1.5 bg-brand-orange mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">3. Datos Personales Recabados</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar sus datos personales de distintas formas: cuando usted nos los proporciona directamente; cuando visita nuestro sitio de Internet o utiliza nuestros servicios en línea.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">4. Derechos ARCO</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
                </p>
              </div>

              <div className="bg-brand-gray/30 p-8 md:p-12 border border-brand-gray mt-20">
                <h3 className="text-xl font-serif mb-10 text-brand-petroleum uppercase tracking-tight flex items-center gap-3">
                  <Shield className="w-6 h-6 text-brand-orange" />
                  Contacto para Privacidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-graphite/40">Atención Directa</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-brand-graphite">
                        <Mail className="w-5 h-5 text-brand-orange" />
                        <span className="font-sans text-sm md:text-base">{org.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-brand-graphite">
                        <Phone className="w-5 h-5 text-brand-orange" />
                        <span className="font-sans text-sm md:text-base">{org.contact.telephone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-graphite/40">Ubicación Física</p>
                    <div className="flex items-start gap-4 text-brand-graphite">
                      <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-1" />
                      <span className="font-sans text-sm leading-relaxed">{org.contact.address.formattedAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacidad;
