import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que reinicia el scroll a la posición superior (0,0)
 * cada vez que cambia la ruta de navegación.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzar el scroll al inicio de la página sin animación para una respuesta inmediata
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
