import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
};

type SolutionItem = NavItem & {
  description: string;
};

const mobileMenuId = 'mobile-navigation-panel';
const desktopSolutionsId = 'desktop-solutions-menu';

const solutions: SolutionItem[] = [
  {
    name: 'Venta y renta de contenedores',
    href: '/soluciones/venta-renta',
    description: 'Disponibilidad para almacenamiento, operación y proyectos temporales.',
  },
  {
    name: 'Oficinas reubicables',
    href: '/soluciones/oficinas',
    description: 'Espacios para supervisión, administración y ampliaciones operativas.',
  },
  {
    name: 'Proyectos modulares',
    href: '/proyectos',
    description: 'Soluciones adaptadas a requerimientos técnicos y funcionales.',
  },
];

const navItems: NavItem[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Proyectos', href: '/proyectos' },
  { name: 'Nuestra Empresa', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

const isSolutionsRoute = (pathname: string) => pathname.startsWith('/soluciones');

export const Navbar: React.FC = () => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const desktopItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setIsScrolled((prev) => {
        if (prev) return scrollY > 12;
        return scrollY > 36;
      });
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsDesktopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const focusableElements = mobilePanelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    focusableElements?.[0]?.focus();

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isDesktopDropdownOpen &&
        !desktopDropdownRef.current?.contains(target) &&
        !solutionsButtonRef.current?.contains(target)
      ) {
        setIsDesktopDropdownOpen(false);
      }

      if (
        isMobileMenuOpen &&
        !mobilePanelRef.current?.contains(target) &&
        !mobileToggleRef.current?.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDesktopDropdownOpen) {
          setIsDesktopDropdownOpen(false);
          solutionsButtonRef.current?.focus();
        }

        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          mobileToggleRef.current?.focus();
        }
      }

      if (event.key === 'Tab' && isMobileMenuOpen && mobilePanelRef.current) {
        const focusable = Array.from(
          mobilePanelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktopDropdownOpen, isMobileMenuOpen]);

  const transitionClass = prefersReducedMotion ? 'duration-0' : 'duration-300';
  const dropdownTransitionClass = prefersReducedMotion ? 'duration-0' : 'duration-200';

  const navLinkClass = useMemo(
    () =>
      [
        'relative inline-flex h-full items-center px-1 text-[15px] font-medium leading-none text-brand-graphite/78',
        'transition-colors ease-out',
        transitionClass,
        'hover:text-brand-petroleum',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-sm',
        'after:absolute after:left-1/2 after:bottom-[-2px] after:h-0.5 after:w-full after:-translate-x-1/2 after:origin-center after:scale-x-0 after:bg-brand-orange after:transition-transform after:duration-200 after:ease-out',
        'hover:after:scale-x-100',
      ].join(' '),
    [transitionClass],
  );

  const getNavStateClass = (isActive: boolean) =>
    isActive ? 'text-brand-petroleum after:scale-x-100' : '';

  const handleDesktopSolutionsKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsDesktopDropdownOpen(true);

      window.requestAnimationFrame(() => {
        desktopItemRefs.current[0]?.focus();
      });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'sticky top-0 z-50 border-b transition-[background-color,border-color] ease-out pt-[env(safe-area-inset-top)] isolate',
          transitionClass,
          isScrolled
            ? 'border-[rgba(15,23,42,0.08)] bg-[rgba(255,255,255,0.88)] supports-[backdrop-filter]:backdrop-blur-[16px]'
            : 'border-transparent bg-white',
        ].join(' ')}
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-10">
          <div
            className={[
              'grid grid-cols-[1fr_auto_1fr] items-center gap-6 transition-[height] ease-out will-change-[height]',
              transitionClass,
              isScrolled ? 'h-[76px]' : 'h-[100px]',
            ].join(' ')}
          >
            <div className="flex min-w-0 items-center">
              <Link
                to="/"
                className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                aria-label="Creativos Espacios, ir a inicio"
              >
                <img
                  src="/images/logo-creativos-espacios.png"
                  alt="Creativos Espacios"
                  className={[
                    'w-auto object-contain mix-blend-multiply transition-[height] ease-out',
                    transitionClass,
                    isScrolled ? 'h-12 md:h-[52px]' : 'h-16 md:h-[84px]',
                  ].join(' ')}
                />
              </Link>
            </div>

            <nav aria-label="Navegación principal" className="hidden md:flex h-full items-center justify-center">
              <ul className="flex h-full items-center gap-8 lg:gap-10">
                <li className="h-full">
                  <Link
                    to="/"
                    aria-current={location.pathname === '/' ? 'page' : undefined}
                    className={`${navLinkClass} ${getNavStateClass(location.pathname === '/')}`}
                  >
                    Inicio
                  </Link>
                </li>

                <li
                  className="relative h-full"
                  onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                  onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                >
                  <button
                    ref={solutionsButtonRef}
                    type="button"
                    aria-expanded={isDesktopDropdownOpen}
                    aria-controls={desktopSolutionsId}
                    aria-haspopup="menu"
                    className={`${navLinkClass} ${getNavStateClass(isSolutionsRoute(location.pathname))} gap-1.5`}
                    onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
                    onKeyDown={handleDesktopSolutionsKeyDown}
                  >
                    Soluciones
                    <ChevronDown
                      className={[
                        'h-4 w-4 transition-transform ease-out',
                        dropdownTransitionClass,
                        isDesktopDropdownOpen ? 'rotate-180' : 'rotate-0',
                      ].join(' ')}
                    />
                  </button>

                  <div
                    ref={desktopDropdownRef}
                    id={desktopSolutionsId}
                    role="menu"
                    aria-label="Opciones de soluciones"
                    className={[
                      'absolute left-1/2 top-full w-[460px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-4',
                      'transition-all ease-out',
                      dropdownTransitionClass,
                      isDesktopDropdownOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-2 opacity-0',
                    ].join(' ')}
                  >
                    <div className="overflow-hidden rounded-md border border-[rgba(15,23,42,0.08)] bg-white p-2 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                      {solutions.map((item, index) => {
                        const isActive = location.pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            ref={(element) => {
                              desktopItemRefs.current[index] = element;
                            }}
                            to={item.href}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                            className="group flex items-start justify-between gap-5 rounded-[4px] px-5 py-4 text-left transition-colors duration-200 hover:bg-brand-gray/70 focus-visible:bg-brand-gray/70 focus-visible:outline-none"
                          >
                            <div className="min-w-0">
                              <span className={`block text-[15px] font-medium ${isActive ? 'text-brand-petroleum' : 'text-brand-graphite'}`}>
                                {item.name}
                              </span>
                              <span className="mt-1.5 block text-sm leading-relaxed text-brand-graphite/68">
                                {item.description}
                              </span>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-orange transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </li>

                {navItems.slice(1).map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <li key={item.href} className="h-full">
                      <Link
                        to={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`${navLinkClass} ${getNavStateClass(isActive)}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden md:flex items-center justify-end">
              <a
                href="https://wa.me/522291846751"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex min-h-11 items-center justify-center rounded-md bg-brand-petroleum px-6 py-2.5 text-[15px] font-medium text-white',
                  'transition-colors ease-out',
                  dropdownTransitionClass,
                  'hover:bg-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white',
                ].join(' ')}
              >
                Solicitar disponibilidad
              </a>
            </div>

            <div className="flex items-center justify-end md:hidden">
              <button
                ref={mobileToggleRef}
                type="button"
                aria-label={isMobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
                aria-expanded={isMobileMenuOpen}
                aria-controls={mobileMenuId}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-brand-petroleum transition-colors duration-200 hover:bg-brand-gray/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          'fixed inset-0 z-40 bg-brand-petroleum/10 transition-opacity md:hidden',
          dropdownTransitionClass,
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          ref={mobilePanelRef}
          id={mobileMenuId}
          className={[
            'ml-auto flex h-full w-[22rem] max-w-[calc(100vw-1rem)] flex-col border-l border-[rgba(15,23,42,0.08)] bg-white px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(7rem+env(safe-area-inset-top))] transition-transform ease-out',
            transitionClass,
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <nav aria-label="Navegación móvil" className="flex flex-1 flex-col">
            <div className="flex flex-col divide-y divide-brand-gray/80 border-y border-brand-gray/80">
              <Link
                to="/"
                aria-current={location.pathname === '/' ? 'page' : undefined}
                className="py-4 text-base font-medium text-brand-petroleum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              >
                Inicio
              </Link>

              <div className="py-4">
                <button
                  type="button"
                  aria-expanded={isMobileSolutionsOpen}
                  aria-controls="mobile-solutions-list"
                  className="flex w-full items-center justify-between text-left text-base font-medium text-brand-petroleum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  onClick={() => setIsMobileSolutionsOpen((prev) => !prev)}
                >
                  Soluciones
                  <ChevronDown
                    className={[
                      'h-4 w-4 transition-transform ease-out',
                      dropdownTransitionClass,
                      isMobileSolutionsOpen ? 'rotate-180' : 'rotate-0',
                    ].join(' ')}
                  />
                </button>

                <div
                  id="mobile-solutions-list"
                  className={[
                    'grid overflow-hidden transition-all ease-out',
                    dropdownTransitionClass,
                    isMobileSolutionsOpen ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  ].join(' ')}
                >
                  <div className="min-h-0">
                    <div className="space-y-2 rounded-md bg-brand-gray/35 p-2">
                      {solutions.map((item) => {
                        const isActive = location.pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className="block rounded-[4px] px-3 py-3 transition-colors duration-200 hover:bg-white focus-visible:bg-white focus-visible:outline-none"
                          >
                            <span className={`block text-sm font-medium ${isActive ? 'text-brand-petroleum' : 'text-brand-graphite'}`}>
                              {item.name}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-brand-graphite/68">
                              {item.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {navItems.slice(1).map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="py-4 text-base font-medium text-brand-petroleum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <a
                href="https://wa.me/522291846751"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-brand-petroleum px-5 py-3 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              >
                Solicitar disponibilidad
              </a>
            </div>
          </nav>
        </div>
      </div>

      <a
        href="https://wa.me/522291846751"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition-all duration-300 hover:bg-brand-petroleum hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-white md:bottom-10 md:right-10 md:h-[72px] md:w-[72px]"
      >
        <span className="sr-only">Abrir WhatsApp de Creativos Espacios</span>
        <svg className="h-8 w-8 fill-current md:h-9 md:w-9" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
};
