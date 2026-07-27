import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Helmet } from 'react-helmet-async';
import { Facebook, Instagram, Linkedin, MapPin as GoogleIcon } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.creativosespacios.mx/#organization",
                  "name": "Creativos Espacios",
                  "url": "https://www.creativosespacios.mx/",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://www.creativosespacios.mx/#logo",
                    "url": "https://www.creativosespacios.mx/images/logo-creativos-espacios.png",
                    "contentUrl": "https://www.creativosespacios.mx/images/logo-creativos-espacios.png",
                    "caption": "Creativos Espacios"
                  },
                  "description": "Creativos Espacios desarrolla infraestructura modular para empresas, operaciones y proyectos.",
                  "areaServed": {
                    "@type": "Country",
                    "name": "México"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+52-55-5426-9941",
                    "contactType": "sales",
                    "areaServed": "MX",
                    "availableLanguage": "Spanish"
                  },
                  "sameAs": [
                    "https://wa.me/522291846751",
                    "https://www.facebook.com/creativosespaciosmx",
                    "https://www.instagram.com/creativosespaciosmx/",
                    "https://www.linkedin.com/company/creativos-espacios/",
                    "https://www.google.com/search?q=Creativos%20Espacios%20%7C%20Venta%2C%20renta%20y%20adaptación%20de%20contenedores%20marítimos"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.creativosespacios.mx/#website",
                  "url": "https://www.creativosespacios.mx/",
                  "name": "Creativos Espacios",
                  "publisher": {
                    "@id": "https://www.creativosespacios.mx/#organization"
                  },
                  "inLanguage": "es-MX"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>
      <footer className="bg-brand-gray/20 text-brand-graphite py-20 md:py-24 border-t border-brand-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          <div>
            <img 
              src="/images/logo-creativos-espacios.png" 
              alt="Creativos Espacios" 
              className="h-16 md:h-20 mb-8 md:mb-10 object-contain mix-blend-multiply" 
            />
            <p className="text-brand-graphite text-sm md:text-base max-w-xs leading-relaxed font-sans mb-8">
              Soluciones modulares para empresas, industria y proyectos.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/creativosespaciosmx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-graphite/5 flex items-center justify-center text-brand-graphite hover:bg-brand-orange hover:text-white transition-all" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/creativosespaciosmx/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-graphite/5 flex items-center justify-center text-brand-graphite hover:bg-brand-orange hover:text-white transition-all" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/creativos-espacios/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-graphite/5 flex items-center justify-center text-brand-graphite hover:bg-brand-orange hover:text-white transition-all" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.google.com/search?q=Creativos%20Espacios%20%7C%20Venta%2C%20renta%20y%20adaptación%20de%20contenedores%20marítimos" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-graphite/5 flex items-center justify-center text-brand-graphite hover:bg-brand-orange hover:text-white transition-all" aria-label="Google My Profile">
                <GoogleIcon size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 md:mb-10 text-brand-orange">Servicios</h3>
            <ul className="text-brand-graphite text-sm md:text-base space-y-4 md:space-y-5 font-sans">
              <li>
                <Link to="/soluciones/venta-renta" className="hover:text-brand-orange transition-colors">
                  Venta y Renta de Contenedores
                </Link>
              </li>
              <li>
                <Link to="/soluciones/oficinas" className="hover:text-brand-orange transition-colors">
                  Oficinas Reubicables
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="hover:text-brand-orange transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-orange transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 md:mb-10 text-brand-orange">Contacto</h3>
            <p className="text-brand-graphite text-sm md:text-base leading-relaxed font-sans">
              ventas@creativosespacios.mx
            </p>
            <p className="mt-2 text-brand-graphite text-sm md:text-base leading-relaxed font-sans">
              55 5426 9941
            </p>
            <a
              href="https://google.com/maps/place/Creativos+Espacios+%7C+Venta,+renta+y+adaptaci%C3%B3n+de+contenedores+mar%C3%ADtimos/data=!4m2!3m1!1s0x0:0xcf94e14da72b42e9?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm leading-relaxed text-brand-graphite/60 font-sans transition-colors duration-200 hover:text-brand-orange focus-visible:outline-none focus-visible:text-brand-orange"
            >
              Av. del Árbol 104-Lote 2, Lomas de San Lorenzo, Iztapalapa, 09790 Ciudad de México, CDMX
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 md:mt-24 pt-8 md:pt-10 border-t border-brand-gray flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-brand-graphite/40 text-xs uppercase tracking-widest font-sans">
            © 2026 Creativos Espacios. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
