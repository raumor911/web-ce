import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { CheckCircle2, Truck, ShieldCheck, Clock } from 'lucide-react';

const VentaRenta: React.FC = () => {
  const inventario = [
    {
      id: '20ft-std',
      titulo: 'Contenedor 20 FT STD',
      dimensiones: '6.06m x 2.44m x 2.59m / 2.89m',
      uso: 'Ideal para almacenamiento de herramientas, insumos y proyectos de escala media.',
      img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shipping+container+20ft+industrial+clean+white+background+technical+photography&image_size=landscape_4_3'
    },
    {
      id: '40ft-std',
      titulo: 'Contenedor 40 FT HC/STD',
      dimensiones: '12.19m x 2.44m x 2.89m',
      uso: 'Máxima capacidad para inventarios extensos, maquinaria pesada y grandes volúmenes.',
      img: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=shipping+container+40ft+industrial+grey+sober+technical+photography&image_size=landscape_4_3'
    }
  ];

  return (
    <div className="bg-brand-white min-h-screen">
      <SEO 
        title="Venta y Renta de Contenedores Industriales"
        description="Contenedores marítimos de 20 y 40 pies para almacenamiento y logística industrial en CDMX. Disponibilidad inmediata."
      />
      
      <header className="bg-brand-gray/20 py-20 md:py-32 border-b border-brand-gray">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className="text-brand-graphite mb-8 leading-tight">Venta y Renta de <br /> Contenedores.</h1>
          <p className="text-brand-graphite text-lg md:text-2xl max-w-3xl font-sans leading-relaxed">
            Unidades verificadas estructuralmente para garantizar el resguardo de activos y la continuidad operativa en cualquier entorno industrial.
          </p>
        </div>
      </header>

      <section className="py-20 md:py-32 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
          {inventario.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-industrial group !p-0 overflow-hidden shadow-xl"
            >
              <div className="aspect-video overflow-hidden">
                <img src={item.img} alt={item.titulo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="p-6 sm:p-10 md:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 md:mb-10">
                  <h2 className="text-2xl md:text-4xl font-serif text-brand-petroleum">{item.titulo}</h2>
                  <span className="bg-brand-petroleum text-white text-[10px] md:text-xs font-bold px-4 py-2 uppercase tracking-tighter">
                    En Inventario
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12 pb-8 md:pb-10 border-b border-brand-gray">
                  <div>
                    <span className="block text-[10px] md:text-xs font-bold text-brand-orange uppercase mb-2 md:mb-3 tracking-widest">Dimensiones</span>
                    <span className="text-base md:text-lg font-sans text-brand-graphite">{item.dimensiones}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] md:text-xs font-bold text-brand-orange uppercase mb-2 md:mb-3 tracking-widest">Disponibilidad</span>
                    <span className="text-base md:text-lg font-sans text-brand-graphite">Venta / Renta</span>
                  </div>
                </div>

                <p className="text-brand-graphite text-base md:text-lg mb-8 md:mb-12 leading-relaxed italic">
                  "{item.uso}"
                </p>

                <div className="space-y-4 md:space-y-5 mb-10 md:mb-12">
                  {['Acero Corten de alta resistencia', 'Pisos de madera tratada 28mm', 'Certificación CSC vigente'].map((feat) => (
                    <div key={feat} className="flex items-center gap-4 text-sm text-brand-graphite font-medium">
                      <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" /> {feat}
                    </div>
                  ))}
                </div>

                <a 
                  href="https://wa.me/522291846751" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full btn-primary block text-center"
                >
                  Solicitar Cotización
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Logistics section - Improved Legibility */}
      <section className="bg-brand-gray/20 border-t border-brand-gray py-20 md:py-32">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Truck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Logística y Posicionamiento</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Contamos con equipo especializado para la entrega y el posicionamiento preciso de unidades en sitios de difícil acceso.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <Clock className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Disponibilidad Inmediata</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Mantener un inventario constante nos permite responder a necesidades críticas de espacio en menos de 48 horas.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-brand-orange" />
            <h3 className="text-2xl md:text-3xl font-serif text-brand-petroleum">Garantía Estructural</h3>
            <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
              Cada unidad entregada pasa por un proceso de inspección técnica para asegurar su hermeticidad y estabilidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VentaRenta;
