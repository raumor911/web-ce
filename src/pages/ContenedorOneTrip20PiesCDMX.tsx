import React from 'react';
import { OneTripIntentLanding } from '../components/commercial/OneTripIntentLanding';

const ContenedorOneTrip20PiesCDMX: React.FC = () => (
  <OneTripIntentLanding
    config={{
      path: '/contenedor-one-trip-20-pies-cdmx',
      title: 'Contenedor One Trip 20 Pies en CDMX | Venta | Creativos Espacios',
      metaDescription: 'Venta de contenedor One Trip 20 FT Standard en CDMX para proyectos donde importan la condición superficial, el mínimo uso y una base predecible. Solicita cotización.',
      eyebrow: '20 FT STANDARD · ONE TRIP · VENTA',
      h1: 'Contenedor One Trip 20 pies en CDMX',
      lead: 'Formato compacto para proyectos que requieren una unidad con mínimo uso, buena condición superficial y una base más predecible para acondicionamiento o integración.',
      faqCategory: 'one-trip-20ft',
      mode: 'product',
      productId: 'product:container-20ft',
      contextLabel: 'INTENCIÓN DE PRODUCTO',
      contextTitle: 'Cuando ya sabes que necesitas un 20 FT One Trip',
      contextIntro: 'Esta página concentra la información necesaria para evaluar el formato 20 FT Standard sin mezclarlo con inventario usado ni con opciones de renta.',
      infoCards: [
        { title: 'Huella compacta', text: 'Su longitud de 20 pies facilita evaluar proyectos donde el espacio disponible es una restricción relevante.' },
        { title: 'Mínimo uso', text: 'La condición One Trip reduce la exposición acumulada frente a una unidad usada, aunque puede conservar marcas menores de manejo.' },
        { title: 'Base para intervenir', text: 'Puede funcionar como punto de partida cuando la unidad será acondicionada, pintada o integrada a un proyecto visible.' },
        { title: 'Venta únicamente', text: 'CE no ofrece unidades One Trip en renta. La renta de contenedores corresponde a unidades usadas.' }
      ],
      decisionTitle: 'Qué debe justificar elegir 20 FT One Trip',
      decisionIntro: 'One Trip tiene sentido cuando la condición de la unidad aporta valor al proyecto; no simplemente por buscar el contenedor más nuevo posible.',
      decisionItems: [
        { label: 'Espacio disponible', text: 'El proyecto necesita una huella más compacta que la de un 40 FT.' },
        { label: 'Presentación', text: 'La unidad permanecerá visible o recibirá un acabado donde la condición inicial importa.' },
        { label: 'Intervención posterior', text: 'Se prevén aperturas, pintura, revestimientos o integración arquitectónica y se busca partir de una base con menor desgaste.' },
        { label: 'Compra', text: 'El requerimiento es de adquisición. One Trip no forma parte de la oferta de renta de CE.' }
      ],
      noxTitle: 'Qué se confirma antes de cerrar la compra',
      noxIntro: 'La página reduce incertidumbre sobre el producto, pero la cotización final depende de variables que CE debe validar para cada requerimiento.',
      noxItems: [
        { label: 'Disponibilidad', text: 'La existencia del 20 FT Standard One Trip se confirma al momento de cotizar; no se publica un stock ficticio.' },
        { label: 'Precio', text: 'No existe un precio público fijo en esta página. CE confirma la condición comercial vigente para la unidad solicitada.' },
        { label: 'Logística', text: 'Transporte, descarga y maniobras dependen de la ubicación y condiciones del sitio.' },
        { label: 'Condición real', text: 'One Trip implica mínimo uso, no perfección cosmética absoluta. Puede haber marcas menores de transporte o manipulación.' }
      ],
      finalEyebrow: 'COTIZACIÓN 20 FT ONE TRIP',
      finalTitle: '¿Necesita un 20 FT Standard One Trip?',
      finalText: 'Comparta la ubicación del proyecto y el uso previsto. CE confirmará disponibilidad, precio y condiciones de suministro para esta unidad.',
      relatedLinks: [
        { title: '40 FT High Cube One Trip', text: 'Alternativa para proyectos que necesitan mayor volumen y altura interior.', href: '/contenedor-one-trip-40-high-cube-cdmx' },
        { title: 'Proyectos arquitectónicos', text: 'Vea cómo se evalúa One Trip cuando la unidad forma parte del diseño.', href: '/contenedores-one-trip-para-proyectos-arquitectonicos-cdmx' },
        { title: 'Hub One Trip', text: 'Regrese a la oferta general de contenedores One Trip de CE.', href: '/contenedores-nuevos-one-trip-cdmx' }
      ]
    }}
  />
);

export default ContenedorOneTrip20PiesCDMX;
