import React, { useState } from "react";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Mail, MapPin, Phone, ArrowRight, Loader2 } from "lucide-react";

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    interes: "Venta / Renta de Contenedores",
    mensaje: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const params = new URLSearchParams();
      params.append("nombre", formData.nombre);
      params.append("empresa", formData.empresa);
      params.append("email", formData.email);
      params.append("interes", formData.interes);
      params.append("mensaje", formData.mensaje);
      params.append("website", formData.website);

      const response = await fetch("/formulario-creativosespacios.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok && result.success) {
          setFeedback({ type: "success", message: result.message });
          setFormData({
            nombre: "",
            empresa: "",
            email: "",
            interes: "Venta / Renta de Contenedores",
            mensaje: "",
            website: "",
          });
        } else {
          setFeedback({
            type: "error",
            message: result.message || "Error al procesar la solicitud.",
          });
        }
      } else {
        setFeedback({
          type: "error",
          message: `El servidor bloqueó la solicitud (Estado ${response.status}). Verifique la configuración en cPanel.`,
        });
      }
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "No se pudo conectar con el servidor. Intente más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO
        title="Contacto y Cotización Técnica"
        description="Inicie su proyecto de infraestructura modular. Solicite una cotización técnica para venta o renta de contenedores en CDMX."
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://www.creativosespacios.mx/contacto/#webpage",
              url: "https://www.creativosespacios.mx/contacto",
              name: "Contacto y Cotización Técnica",
              isPartOf: { "@id": "https://www.creativosespacios.mx/#website" },
              description:
                "Página de contacto de Creativos Espacios para cotizaciones técnicas.",
            },
            {
              "@type": "ContactPage",
              "@id": "https://www.creativosespacios.mx/contacto/#contact",
              url: "https://www.creativosespacios.mx/contacto",
              mainEntity: {
                "@id": "https://www.creativosespacios.mx/#organization",
              },
            },
          ],
        }}
      />

      <header className="bg-brand-gray/50 py-20 md:py-32 border-b border-brand-gray">
        <div className="container px-6 lg:px-12">
          <h1 className="section-title">Inicie su Conversación.</h1>
          <p className="text-brand-graphite/70 text-base md:text-lg max-w-2xl font-sans leading-relaxed">
            Nuestro equipo de especialistas le proporcionará una estimación
            detallada basada en sus necesidades operativas y logística de sitio.
          </p>
        </div>
      </header>

      <section className="container px-6 lg:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 sm:p-12 border border-brand-gray shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">
                    Empresa / Cargo
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">
                  Línea de Interés
                </label>
                <select
                  name="interes"
                  value={formData.interes}
                  onChange={handleChange}
                  className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm focus:outline-none focus:border-brand-orange transition-colors appearance-none cursor-pointer"
                >
                  <option value="Venta / Renta de Contenedores">
                    Venta / Renta de Contenedores
                  </option>
                  <option value="Oficinas Reubicables">
                    Oficinas Reubicables
                  </option>
                  <option value="Proyectos">Proyectos</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-graphite/40 mb-3">
                  Descripción del Requerimiento Técnico *
                </label>
                <textarea
                  name="mensaje"
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-gray/30 border-b-2 border-brand-gray p-4 text-sm text-justify focus:outline-none focus:border-brand-orange transition-colors"
                ></textarea>
              </div>

              <div
                className="hidden"
                aria-hidden="true"
                style={{ display: "none" }}
              >
                <label htmlFor="website">No rellenar este campo</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {feedback && (
                <div
                  className={`p-4 text-xs font-semibold ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    Procesando <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Enviar Solicitud <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <div className="flex flex-col justify-between py-6">
            <div className="space-y-12 md:space-y-16">
              <div>
                <h3 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 text-brand-petroleum">
                  Contacto Directo
                </h3>
                <div className="space-y-6 md:space-y-8">
                  <a
                    href="tel:5554269941"
                    className="flex items-center gap-6 md:gap-8 group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                      <Phone size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">
                        TELÉFONO
                      </h4>
                      <p className="text-sm text-brand-graphite/60 font-sans mt-1">
                        55 5426 9941
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-graphite/30">
                      <Mail size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">
                        EMAIL
                      </h4>
                      <p className="text-sm text-brand-graphite/60 font-sans mt-1">
                        ventas@creativosespacios.mx
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 text-brand-petroleum">
                  Ubicación y Cobertura
                </h3>
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-gray flex items-center justify-center text-brand-graphite/30">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">
                      Centro Operativo
                    </h4>
                    <a
                      href="https://google.com/maps/place/Creativos+Espacios+%7C+Venta,+renta+y+adaptaci%C3%B3n+de+contenedores+mar%C3%ADtimos/data=!4m2!3m1!1s0x0:0xcf94e14da72b42e9?sa=X&ved=1t:2428&ictx=111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm leading-relaxed text-brand-graphite/60 font-sans transition-colors duration-200 hover:text-brand-orange focus-visible:outline-none focus-visible:text-brand-orange"
                    >
                      Av. del Arbol 104-Lote 2, Lomas de San Lorenzo,
                      Iztapalapa, 09790 Ciudad de Mexico, CDMX
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 md:pt-12 border-t border-brand-gray mt-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-graphite/30">
                Horario de atención técnica: <br />
                Lunes a Viernes 08:00 - 18:00 hrs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
