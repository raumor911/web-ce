import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import BlogPost from './pages/BlogPost';
import routesConfig from './config/routes.json';
import { componentRegistry } from './config/routeRegistry';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Static Routes from Manifest */}
            {routesConfig.map((route) => {
              const Component = componentRegistry[route.component];
              if (!Component) return null;

              if (route.path === '/') {
                return <Route key={route.id} index element={<Component />} />;
              }

              return <Route key={route.id} path={route.path.replace(/^\//, '')} element={<Component />} />;
            })}

            {/* Special Redirects */}
            <Route path="soluciones" element={<Navigate to="/soluciones/venta-renta" replace />} />

            {/* Dynamic Routes */}
            <Route path="blog/:slug" element={<BlogPost />} />

            {/* Fallback */}
            <Route path="*" element={(() => {
              const NotFound = componentRegistry['NotFound'];
              return NotFound ? <NotFound /> : <div>Not Found</div>;
            })()} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
