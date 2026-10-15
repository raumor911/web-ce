import React from 'react';
import { OneTripIntentLanding } from '../components/commercial/OneTripIntentLanding';

const ContenedoresOneTripEscuelasCDMX: React.FC = () => (
  <OneTripIntentLanding
    config={{
      path: '/contenedores-one-trip-para-escuelas-cdmx',
      title: 'Contenedores One Trip para Escuelas en CDMX | Creativos Espacios',
      metaDescription: 'Contenedores One Trip para escuelas y proyectos educativos en CDMX. Base de mínimo uso para aulas, administración, atención y ampliaciones. Venta bajo cotización.',
      eyebrow: 'ONE TRIP · PROYECTOS EDUCATIVOS',
      h1: 'Contenedores One Trip para escuelas en CDMX',
      lead: 'Una base de mínimo uso para proyectos educativos donde la unidad será ocupada, visible o integrada a una ampliación que exige mayor cuidado en la condición inicial.',
      faqCategory: 'one-trip-education',
      mode: 'project',
      contextLabel: 'INTENCIÓN EDUCATIVA',
      contextTitle: 'Cuando el espacio también forma parte de la experiencia de la institución',
      contextIntro: 'Escuelas y universidades pueden requerir módulos para nuevas funciones, pero One Trip no equivale a un aula terminada. La unidad es la base física sobre la que se define el proyecto.',
      infoCards: [
        { title: 'Aulas y apoyo', text: 'Puede evaluarse como base para aulas, espacios de apoyo o ampliaciones sujetas al proyecto y acondicionamiento correspondientes.' },
        { title: 'Administración', text: 'Puede utilizarse como punto de partida para módulos administrativos o de atención institucional.' },
        { title: 'Presentación', text: 'Cuando la unidad permanecerá visible para alumnos, personal o visitantes, la condición inicial cobra mayor relevancia.' },
        { title: 'Venta', text: 'One Trip se ofrece exclusivamente para compra. Si el proyecto requiere renta, CE trabaja con contenedores usados.' }
      ],
      decisionTitle: 'Qué debe aclararse antes de elegir el formato',
      decisionIntro: 'La elección debe responder al uso educativo real, número de usuarios, sitio y nivel de acondicionamiento previsto.',
      decisionItems: [
        { label: 'Función', text: 'Definir si se busca aula, módulo administrativo, atención, cafetería u otro uso de apoyo.' },
        { label: 'Capacidad', text: 'Estimar el espacio requerido para decidir si conviene 20 FT Standard o 40 FT High Cube.' },
        { label: 'Acondicionamiento', text: 'La unidad One Trip no incluye automáticamente acabados, instalaciones o equipamiento del espacio educativo.' },
        { label: 'Sitio', text: 'Acceso, descarga, posicionamiento y condiciones de instalación deben evaluarse para cada plantel.' }
      ],
      noxTitle: 'Qué debe saber una institución antes de cotizar',
      noxIntro: 'La principal fuente de incertidumbre es confundir el contenedor base con el espacio educativo terminado. Esta página separa ambos niveles.',
      noxItems: [
        { label: 'La unidad', text: 'CE puede cotizar 20 FT Standard y 40 FT High Cube en condición One Trip.' },
        { label: 'El proyecto', text: 'La adecuación para uso educativo requiere definir alcance, acabados, instalaciones y criterios aplicables al sitio.' },
        { label: 'La renta', text: 'No existe renta One Trip. La renta de CE se realiza con unidades usadas.' },
        { label: 'La logística', text: 'Transporte y maniobras dependen de la ubicación y condiciones de acceso del plantel.' }
      ],
      finalEyebrow: 'COTIZACIÓN PARA ESCUELAS',
      finalTitle: '¿Su institución necesita una base One Trip para un nuevo espacio?',
      finalText: 'Comparta el uso previsto y la ubicación del proyecto. CE podrá orientar el formato y confirmar condiciones de suministro.',
      relatedLinks: [
        { title: '20 FT Standard One Trip', text: 'Formato compacto para funciones de menor huella.', href: '/contenedor-one-trip-20-pies-cdmx' },
        { title: '40 FT High Cube One Trip', text: 'Mayor volumen y altura interior para proyectos de mayor escala.', href: '/contenedor-one-trip-40-high-cube-cdmx' },
        { title: 'Proyectos arquitectónicos', text: 'Vea la lógica de selección cuando la unidad forma parte del diseño.', href: '/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx' }
      ]
    }}
  />
);

export default ContenedoresOneTripEscuelasCDMX;
