import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import VentaRenta from './pages/VentaRenta';
import Oficinas from './pages/Oficinas';
import Proyectos from './pages/Proyectos';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="soluciones">
              <Route index element={<Navigate to="/soluciones/venta-renta" replace />} />
              <Route path="venta-renta" element={<VentaRenta />} />
              <Route path="oficinas" element={<Oficinas />} />
            </Route>
            <Route path="proyectos" element={<Proyectos />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
