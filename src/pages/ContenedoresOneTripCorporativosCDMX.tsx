import React from 'react';
import { OneTripIntentLanding } from '../components/commercial/OneTripIntentLanding';

const ContenedoresOneTripCorporativosCDMX: React.FC = () => (
  <OneTripIntentLanding
    config={{
      path: '/contenedores-one-trip-para-proyectos-corporativos-cdmx',
      title: 'Contenedores One Trip para Proyectos Corporativos en CDMX | Creativos Espacios',
      metaDescription: 'Contenedores One Trip para proyectos corporativos en CDMX: oficinas, recepciones, showrooms, centros de ventas y módulos visibles. Venta bajo cotización.',
      eyebrow: 'ONE TRIP · PROYECTOS CORPORATIVOS',
      h1: 'Contenedores One Trip para proyectos corporativos en CDMX',
      lead: 'Una base con mínimo uso para oficinas, recepciones, showrooms, centros de ventas y módulos donde la condición de la unidad también participa en la percepción del proyecto.',
      faqCategory: 'one-trip-corporate',
      mode: 'project',
      contextLabel: 'INTENCIÓN CORPORATIVA',
      contextTitle: 'Cuando el módulo también representa a la empresa',
      contextIntro: 'En proyectos visibles para clientes, colaboradores o visitantes, el estado de la unidad de origen puede ser parte de la percepción final. One Trip permite partir de una base con menor desgaste acumulado.',
      infoCards: [
        { title: 'Recepción y atención', text: 'Puede evaluarse como base para módulos visibles donde la presentación del espacio tiene relevancia.' },
        { title: 'Oficinas', text: 'La condición One Trip puede ser útil cuando el módulo será acondicionado para funciones administrativas o ejecutivas.' },
        { title: 'Showroom y ventas', text: 'Cuando la unidad forma parte de la experiencia comercial, la superficie inicial puede reducir trabajo correctivo posterior.' },
        { title: 'Proyecto bajo especificación', text: 'El suministro debe alinearse al formato, alcance y condiciones definidos para cada proyecto corporativo.' }
      ],
      decisionTitle: 'Qué debe resolver un comprador corporativo',
      decisionIntro: 'La selección One Trip es sólo una parte de la decisión. El comprador debe vincular producto, uso, imagen, sitio y logística.',
      decisionItems: [
        { label: 'Uso y visibilidad', text: 'Determinar si el módulo será visible para clientes, empleados o visitantes y qué nivel de presentación requiere.' },
        { label: 'Formato', text: 'Elegir entre 20 FT Standard y 40 FT High Cube según espacio, capacidad y configuración.' },
        { label: 'Identidad de marca', text: 'Definir si existirán pintura, recubrimientos, gráfica, iluminación u otros elementos que condicionen la intervención.' },
        { label: 'Logística', text: 'Confirmar acceso, posicionamiento y maniobras en la ubicación corporativa o sitio del proyecto.' }
      ],
      noxTitle: 'Qué se confirma antes de convertir la intención en compra',
      noxIntro: 'El objetivo es evitar que el comprador confunda una unidad One Trip con una solución corporativa terminada o con un stock inmediato garantizado.',
      noxItems: [
        { label: 'Formato disponible', text: 'CE ofrece One Trip únicamente en 20 FT Standard y 40 FT High Cube.' },
        { label: 'Disponibilidad real', text: 'Se confirma al cotizar; no se publica una existencia ficticia.' },
        { label: 'Alcance corporativo', text: 'Acondicionamiento, acabados y branding deben definirse como parte del proyecto, no asumirse incluidos en la unidad.' },
        { label: 'Modalidad', text: 'One Trip se comercializa sólo para venta. La renta corresponde a unidades usadas.' }
      ],
      finalEyebrow: 'COTIZACIÓN CORPORATIVA',
      finalTitle: '¿El proyecto requiere una unidad One Trip como base?',
      finalText: 'Comparta el uso previsto, ubicación y formato de interés. CE confirmará suministro y podrá evaluar el alcance requerido para el proyecto.',
      relatedLinks: [
        { title: '20 FT Standard One Trip', text: 'Formato compacto para módulos de menor huella.', href: '/contenedor-one-trip-20-pies-cdmx' },
        { title: '40 FT High Cube One Trip', text: 'Mayor volumen y altura para configuraciones corporativas más amplias.', href: '/contenedor-one-trip-40-high-cube-cdmx' },
        { title: 'Proyectos arquitectónicos', text: 'Profundice en la lógica de selección para unidades integradas al diseño.', href: '/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx' }
      ]
    }}
  />
);

export default ContenedoresOneTripCorporativosCDMX;
