import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { SemanticSelectors } from '../semantic/selectors';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';
import { getCanonicalUrl, getWebPageId, ORG_ID, WEBSITE_ID } from '../lib/canonical';

const Terminos: React.FC = () => {
  const org = SemanticSelectors.getOrganization();
  const pageUrl = getCanonicalUrl('/terminos');
  const webpageId = getWebPageId('/terminos');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": pageUrl,
        "name": "Términos y Condiciones | Creativos Espacios",
        "isPartOf": { "@id": WEBSITE_ID },
        "description": "Términos y condiciones de uso de los servicios y sitio web de Creativos Espacios."
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
            "name": "Términos y Condiciones",
            "item": pageUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Términos y Condiciones | Creativos Espacios"
        description="Términos y condiciones de uso de los servicios y sitio web de Creativos Espacios."
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
            <h1 className="text-brand-graphite mb-6">Términos y Condiciones</h1>
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
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">1. Aceptación de Términos</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Al acceder y utilizar este sitio web, usted acepta cumplir con estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestros servicios.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">2. Uso de los Servicios</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Los servicios ofrecidos por {org.name} incluyen la venta y renta de infraestructura modular, contenedores y oficinas reubicables. El uso de estos servicios está sujeto a la disponibilidad y a los acuerdos contractuales específicos firmados por ambas partes.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">3. Propiedad Intelectual</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  Todo el contenido presente en este sitio, incluyendo textos, gráficos, logotipos, iconos e imágenes, es propiedad de {org.name} o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual mexicanas e internacionales.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brand-petroleum uppercase tracking-tight">4. Limitación de Responsabilidad</h2>
                <p className="text-brand-graphite text-lg leading-relaxed font-sans text-justify">
                  {org.name} no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la incapacidad de usar nuestros servicios o sitio web.
                </p>
              </div>

              <div className="bg-brand-gray/30 p-8 md:p-12 border border-brand-gray mt-20">
                <h3 className="text-xl font-serif mb-10 text-brand-petroleum uppercase tracking-tight flex items-center gap-3">
                  <FileText className="w-6 h-6 text-brand-orange" />
                  Contacto Legal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-graphite/40">Consultas Legales</p>
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-graphite/40">Oficina Central</p>
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

export default Terminos;
