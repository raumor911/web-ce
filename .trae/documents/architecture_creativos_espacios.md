# Arquitectura Técnica - Creativos Espacios (v3)

## 1. Stack Tecnológico & Estándares
- **Core**: React 18 (TypeScript).
- **Styling**: Tailwind CSS 3 (Custom Config para Palette B2B).
- **Icons**: Lucide React.
- **Motion**: Framer Motion (Transiciones de opacidad y desplazamientos sutiles).
- **Typography**: Google Fonts (DM Serif Display + Inter).

## 2. Sistema de Diseño (Tailwind Config)
```javascript
{
  colors: {
    brand: {
      white: '#FDFDFD',
      gray: '#F4F4F5',
      graphite: '#1A1C23',
      petroleum: '#0F172A',
      orange: '#F97316', // Action
      blue: '#2563EB', // Secondary Accent (Brand)
      green: '#10B981', // Secondary Accent (Brand)
    }
  },
  fontFamily: {
    serif: ['DM Serif Display', 'serif'], // Arquitectura
    sans: ['Inter', 'sans-serif'], // Ingeniería
  }
}
```

## 3. Componentes UX Core
- **`Layout`**: Contenedor con `Navbar` ejecutivo y `Footer` de alta densidad informativa.
- **`SEO`**: Wrapper de `react-helmet-async` para inyección de `JSON-LD` especializado en servicios industriales.
- **`ModularCard`**: Componente para presentar soluciones con enfoque técnico.
- **`ProcessTimeline`**: Visualización clara del flujo de trabajo B2B.

## 4. Estrategia de IA & Visibilidad
- **Semantic HTML**: Uso de `section`, `article`, `aside` y `nav` para máxima legibilidad por rastreadores.
- **llms.txt**: Documento descriptivo en lenguaje natural técnico para agentes de IA.
- **Metadata**: Atributos `aria-label` y `alt` descriptivos para accesibilidad y SEO.

## 5. Mapa de Rutas
- `/` (Home)
- `/soluciones/venta-renta`
- `/soluciones/oficinas`
- `/soluciones/proyectos-adaptados`
- `/proyectos` (Portafolio real)
- `/nosotros` (Capacidad B2B)
- `/contacto` (Formulario técnico)
