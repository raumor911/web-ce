import React from 'react';
import { OneTripIntentLanding } from '../components/commercial/OneTripIntentLanding';

const ContenedoresOneTripArquitecturaCDMX: React.FC = () => (
  <OneTripIntentLanding
    config={{
      path: '/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx',
      title: 'Contenedores One Trip para Proyectos Arquitectónicos en CDMX | Creativos Espacios',
      metaDescription: 'Contenedores One Trip 20 FT Standard y 40 FT High Cube para proyectos arquitectónicos en CDMX donde importan la condición superficial, la intervención posterior y la presentación.',
      eyebrow: 'ONE TRIP · PROYECTOS ARQUITECTÓNICOS',
      h1: 'Contenedores One Trip para proyectos arquitectónicos en CDMX',
      lead: 'Una base con mínimo uso para proyectos donde el contenedor será intervenido, integrado al diseño o permanecerá visible como parte del resultado final.',
      faqCategory: 'one-trip-architecture',
      mode: 'project',
      contextLabel: 'INTENCIÓN DE PROYECTO',
      contextTitle: 'La decisión comienza en el proyecto, no en el contenedor',
      contextIntro: 'Cuando la unidad será parte visible del diseño, la condición inicial puede influir en el trabajo posterior. One Trip no sustituye la especificación arquitectónica: aporta una base con menor desgaste acumulado.',
      infoCards: [
        { title: 'Intervención visible', text: 'Adecuado cuando la unidad recibirá pintura, revestimientos, aperturas o acabados donde el estado inicial tiene peso.' },
        { title: 'Integración al diseño', text: 'La selección del formato debe responder a la composición, huella, altura y distribución previstas.' },
        { title: 'Base más predecible', text: 'Mínimo uso puede reducir la incertidumbre frente a deformaciones, reparaciones o desgaste acumulado propios de unidades usadas.' },
        { title: 'Alcance por proyecto', text: 'CE evalúa el requerimiento antes de definir el alcance de modificación, acondicionamiento o suministro.' }
      ],
      decisionTitle: 'Qué debe definir el equipo de proyecto',
      decisionIntro: 'El objetivo no es elegir One Trip por apariencia, sino comprobar que esa condición agrega valor a la solución que se va a construir.',
      decisionItems: [
        { label: 'Uso final', text: 'Definir si la unidad será oficina, módulo de atención, exhibición, espacio operativo u otra configuración.' },
        { label: 'Formato', text: 'Elegir entre 20 FT Standard y 40 FT High Cube según huella, volumen y altura requerida.' },
        { label: 'Intervención', text: 'Aclarar aperturas, acabados, integración, instalaciones y otros requerimientos antes de cotizar el alcance.' },
        { label: 'Sitio', text: 'La ubicación, acceso y maniobras condicionan la logística y deben evaluarse junto con el producto.' }
      ],
      noxTitle: 'Lo que One Trip sí resuelve y lo que todavía debe definirse',
      noxIntro: 'Separar la condición de la unidad del diseño del proyecto evita asumir que un contenedor One Trip es un módulo terminado.',
      noxItems: [
        { label: 'Sí: condición inicial', text: 'One Trip aporta una unidad de mínimo uso respecto de un contenedor usado.' },
        { label: 'No: proyecto terminado', text: 'La condición One Trip no incluye por sí sola diseño arquitectónico, instalaciones, acabados o certificaciones.' },
        { label: 'Sí: formatos concretos', text: 'CE ofrece 20 FT Standard y 40 FT High Cube One Trip para venta.' },
        { label: 'Por definir: alcance', text: 'El acondicionamiento y las modificaciones se evalúan según requerimientos específicos del proyecto.' }
      ],
      finalEyebrow: 'COTIZACIÓN PARA PROYECTO',
      finalTitle: '¿Ya tiene un concepto, plano o uso definido?',
      finalText: 'Seleccione el formato One Trip que mejor se aproxima a su proyecto y comparta el uso previsto. CE podrá confirmar suministro y evaluar el siguiente alcance.',
      relatedLinks: [
        { title: '20 FT Standard One Trip', text: 'Formato compacto para proyectos con menor huella física.', href: '/contenedor-one-trip-20-pies-cdmx' },
        { title: '40 FT High Cube One Trip', text: 'Formato de mayor volumen y altura interior para configuraciones más amplias.', href: '/contenedor-one-trip-40-high-cube-cdmx' },
        { title: 'One Trip para corporativos', text: 'Aplicaciones donde presentación e imagen de marca forman parte del requerimiento.', href: '/contenedores-one-trip-para-proyectos-corporativos-cdmx' }
      ]
    }}
  />
);

export default ContenedoresOneTripArquitecturaCDMX;
