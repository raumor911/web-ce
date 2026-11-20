/**
 * Contenido de la página de evidencia "Proyectos realizados".
 * Fuente: PROYECTOS_De Contenedor a Espacio_CE.pdf (23 páginas).
 * Cada imagen indica la página de origen y la certeza de su agrupación.
 * Ver docs/proyectos-realizados-evidencia.md para los datos pendientes de validar.
 */

const BASE = '/images/proyectos-realizados';

export interface ProjectImage {
  file: string; // nombre sin extensión dentro de BASE
  width: number;
  height: number;
  alt: string;
  caption?: string;
  pdfPage: number;
}

export interface ProjectCase {
  id: string;
  category: string;
  title: string;
  /** Un párrafo corto que contextualiza el caso (voz editorial, sin afirmar lo no documentado). */
  story: string[];
  /** Datos expresamente indicados en el PDF. */
  documented: string[];
  /** Observaciones visibles en las fotografías (no son especificaciones técnicas). */
  visible?: string[];
  images: ProjectImage[];
}

export interface ProjectChapter {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  cases: ProjectCase[];
}

export const imageSrc = (file: string) => `${BASE}/${file}.webp`;

export const heroImage: ProjectImage = {
  file: 'makerspace-santa-cruz-meyehualco-edificio-terminado',
  width: 800,
  height: 800,
  alt: 'Edificio de varios niveles construido con contenedores de colores amarillo, verde claro y blanco, con barandales rojos y estructura de acero, en el MakerSpace de Santa Cruz Meyehualco',
  pdfPage: 1,
};

export const chapters: ProjectChapter[] = [
  {
    id: 'construccion',
    eyebrow: 'Capítulo 01',
    title: 'Cuando el contenedor se convierte en edificio',
    intro:
      'Un contenedor puede ser la unidad de una construcción mayor. Este proyecto muestra el recorrido completo: desde las piezas con aberturas en patio hasta un inmueble terminado.',
    cases: [
      {
        id: 'makerspace-santa-cruz-meyehualco',
        category: 'Construcción con contenedores',
        title: 'MakerSpace, Santa Cruz Meyehualco',
        story: [
          'Las fotografías documentan el proceso de transformación: contenedores a los que se les practicaron aberturas para puertas y ventanas, trabajos de pintura en patio, estructura de acero para apilar volúmenes y, finalmente, un edificio de varios niveles con barandales y escaleras.',
          'Es una buena referencia para quien se pregunta hasta dónde puede llegar un contenedor: aquí no es una caja aislada, sino parte de una composición arquitectónica.',
        ],
        documented: [
          'Nombre y ubicación del proyecto: MakerSpace, Santa Cruz Meyehualco.',
        ],
        visible: [
          'Construcción de tres niveles con contenedores apilados.',
          'Estructura de acero y columnas que sostienen los volúmenes superiores.',
          'Aberturas para ventanas y puertas, barandales y escalera de acceso.',
          'Interiores en obra, con instalaciones visibles y muros en proceso.',
        ],
        images: [
          {
            file: 'makerspace-santa-cruz-meyehualco-edificio-terminado',
            width: 800,
            height: 800,
            alt: 'Fachada terminada del MakerSpace en Santa Cruz Meyehualco: tres niveles de contenedores amarillo, verde claro y blanco con barandales rojos',
            caption: 'El edificio terminado.',
            pdfPage: 1,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-contenedores-con-aberturas',
            width: 800,
            height: 600,
            alt: 'Dos contenedores blancos con aberturas grandes para ventanas y puertas, alineados en un patio de trabajo',
            caption: 'Contenedores con aberturas en patio.',
            pdfPage: 3,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-contenedor-pintura-en-patio',
            width: 800,
            height: 600,
            alt: 'Contenedor blanco con múltiples aberturas mientras una persona con traje de protección aplica pintura junto a una grúa',
            caption: 'Aplicación de pintura antes del montaje.',
            pdfPage: 3,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-estructura-tres-niveles',
            width: 800,
            height: 600,
            alt: 'Estructura de tres niveles de contenedores blancos con aberturas aún sin ventanas, en etapa de obra',
            caption: 'Tres niveles en etapa de obra.',
            pdfPage: 2,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-estructura-sobre-columnas',
            width: 799,
            height: 449,
            alt: 'Volúmenes de contenedores blancos elevados sobre columnas de acero inclinadas, con escalones de acceso al frente',
            caption: 'Volúmenes elevados sobre columnas de acero.',
            pdfPage: 6,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-interior-estructura-ventanas',
            width: 800,
            height: 600,
            alt: 'Interior de un contenedor con estructura metálica pintada de rojo alrededor de los vanos de ventana',
            caption: 'Interior: refuerzos metálicos alrededor de los vanos.',
            pdfPage: 4,
          },
          {
            file: 'makerspace-santa-cruz-meyehualco-interior-instalaciones-muros',
            width: 800,
            height: 450,
            alt: 'Interior amplio en obra con ductos de instalaciones al techo, muros de tablero y trabajadores con chaleco reflectante',
            caption: 'Interior: instalaciones y muros en proceso.',
            pdfPage: 5,
          },
        ],
      },
    ],
  },
  {
    id: 'laboratorio',
    eyebrow: 'Capítulo 02',
    title: 'Espacios para investigar y trabajar con precisión',
    intro:
      'Algunas operaciones necesitan un entorno controlado y transportable. Aquí, el contenedor se vuelve laboratorio o recinto técnico.',
    cases: [
      {
        id: 'laboratorio-icaycc-unam',
        category: 'Laboratorio en contenedor',
        title: 'Laboratorio para el Instituto de Ciencias de la Atmósfera y Cambio Climático, UNAM',
        story: [
          'El contenedor viaja sobre una plataforma con grúa articulada y lleva rotulado el nombre del Observatorio Mexicano del Clima y la Composición Atmosférica (OMECCA). Es un ejemplo de infraestructura que se fabrica en un sitio y se entrega en otro.',
        ],
        documented: [
          'Proyecto: laboratorio para el Instituto de Ciencias de la Atmósfera y Cambio Climático, UNAM.',
        ],
        visible: [
          'Rotulación visible: «Observatorio Mexicano del Clima y la Composición Atmosférica, OMECCA».',
          'Traslado nocturno sobre plataforma con grúa.',
        ],
        images: [
          {
            file: 'laboratorio-unam-omecca-contenedor-en-traslado',
            width: 800,
            height: 600,
            alt: 'Contenedor rotulado con el nombre del Observatorio Mexicano del Clima y la Composición Atmosférica (OMECCA), transportado de noche sobre una plataforma con grúa',
            caption: 'Traslado del contenedor del laboratorio.',
            pdfPage: 7,
          },
        ],
      },
      {
        id: 'interiores-acondicionados',
        category: 'Interiores acondicionados',
        title: 'Un contenedor por dentro: piso, muros y clima',
        story: [
          'Estas tres vistas muestran cómo luce un contenedor ya acondicionado: muros y techo forrados en blanco, piso metálico antiderrapante, iluminación y aire acondicionado tipo minisplit.',
          'El material de origen no identifica a qué proyecto pertenecen, por lo que las presentamos como ejemplo de interiores y no como parte de un caso específico.',
        ],
        documented: [],
        visible: [
          'Muros y techo forrados en blanco, con iluminación.',
          'Piso metálico antiderrapante.',
          'Aire acondicionado tipo minisplit y puerta de acceso.',
        ],
        images: [
          {
            file: 'contenedor-acondicionado-puerta-abierta-exterior',
            width: 800,
            height: 619,
            alt: 'Contenedor blanco con una puerta abierta que deja ver un interior acondicionado y limpio',
            caption: 'Exterior con puerta abierta.',
            pdfPage: 8,
          },
          {
            file: 'contenedor-acondicionado-interior-piso-antiderrapante-minisplit',
            width: 379,
            height: 800,
            alt: 'Interior largo de un contenedor con muros blancos, luminarias, minisplit al fondo y piso metálico antiderrapante',
            caption: 'Interior con piso antiderrapante y minisplit.',
            pdfPage: 8,
          },
          {
            file: 'contenedor-acondicionado-puerta-de-acceso-interior',
            width: 379,
            height: 800,
            alt: 'Vista interior hacia una puerta de acceso con luminaria en el techo y piso metálico',
            caption: 'Puerta de acceso vista desde dentro.',
            pdfPage: 8,
          },
        ],
      },
    ],
  },
  {
    id: 'oficinas',
    eyebrow: 'Capítulo 03',
    title: 'Oficinas en contenedor, de 20 y 40 pies',
    intro:
      'La oficina es el uso más frecuente del archivo: un espacio de trabajo listo para instalarse donde la operación lo necesita. Cada unidad cambia en tamaño, acabados y nivel de instalación.',
    cases: [
      {
        id: 'oficinas-proveedor-gas-natural',
        category: 'Oficinas · Contenedor 40′ DC',
        title: 'Oficinas para un proveedor de gas natural industrial',
        story: [
          'Un contenedor de 40 pies blanco, con ventanas, puerta de acceso y una plataforma con barandal en uno de sus extremos, apoyado sobre bases.',
        ],
        documented: [
          'Uso: oficinas para un proveedor de gas natural industrial.',
          'Dimensiones: contenedor 40′ DC.',
          'Acabados: aislamiento térmico, piso vinílico y clima integrado.',
        ],
        images: [
          {
            file: 'oficinas-40-dc-proveedor-gas-natural-exterior',
            width: 800,
            height: 800,
            alt: 'Contenedor de 40 pies pintado de blanco con cuatro ventanas, una puerta y una plataforma con barandal en un extremo, apoyado sobre bases',
            caption: 'Oficinas en contenedor de 40 pies.',
            pdfPage: 9,
          },
        ],
      },
      {
        id: 'oficina-20-dc-azul',
        category: 'Oficinas · Contenedor 20′ DC',
        title: 'Oficina compacta en contenedor azul de 20 pies',
        story: [
          'Un contenedor de 20 pies pintado en azul, con puerta y ventanas protegidas por rejas de diseño geométrico y equipo de clima en un soporte exterior. Por dentro, los muros conservan el perfil del contenedor en blanco y gris, con piso vinílico tipo madera y mesas de trabajo corridas a lo largo de ambos muros.',
        ],
        documented: [
          'Dimensiones: contenedor de 20′ DC.',
          'Acabados: aislante térmico y plafón, piso vinílico SPC, instalación eléctrica y minisplit.',
        ],
        visible: [
          'Rejas de diseño geométrico en puerta y ventanas, coincidentes entre el exterior y el interior.',
          'Superficies de trabajo continuas en ambos muros.',
        ],
        images: [
          {
            file: 'oficina-contenedor-20-dc-azul-exterior',
            width: 800,
            height: 553,
            alt: 'Contenedor de 20 pies pintado de azul, con puerta y ventanas con reja decorativa y un equipo de aire acondicionado en un soporte exterior',
            caption: 'Exterior.',
            pdfPage: 11,
          },
          {
            file: 'oficina-contenedor-20-dc-interior-piso-spc-a',
            width: 600,
            height: 800,
            alt: 'Interior de una oficina en contenedor con piso vinílico tipo madera, mesas de trabajo blancas a ambos lados y luminarias empotradas',
            caption: 'Interior con mesas de trabajo corridas.',
            pdfPage: 12,
          },
          {
            file: 'oficina-contenedor-20-dc-interior-piso-spc-b',
            width: 600,
            height: 800,
            alt: 'Otra vista del interior de la oficina con ventanas con reja, puerta blanca y minisplit al fondo',
            caption: 'Vista hacia la puerta y el minisplit.',
            pdfPage: 12,
          },
          {
            file: 'oficina-contenedor-20-dc-interior-minisplit-puerta',
            width: 600,
            height: 800,
            alt: 'Detalle del interior: minisplit sobre la puerta, tablero eléctrico en el muro y canalización aparente',
            caption: 'Detalle de clima e instalación eléctrica.',
            pdfPage: 12,
          },
        ],
      },
      {
        id: 'oficinas-tres-contenedores-40-hc',
        category: 'Oficinas · Tres contenedores 40′ HC usados',
        title: 'Un solo espacio a partir de tres contenedores usados',
        story: [
          'Tres contenedores de 40 pies High Cube usados se unen para formar un conjunto de oficinas con puertas abatibles y un módulo central con puerta corrediza de vidrio. Las vistas interiores muestran la etapa de trabajo: muros metálicos al descubierto, columnas de acero y la canalización eléctrica a la vista.',
        ],
        documented: [
          'Composición: unión de tres contenedores de 40′ HC usados.',
          'Acabados: instalación eléctrica aparente.',
        ],
        visible: [
          'Puerta corrediza de vidrio en el módulo central.',
          'Interiores en proceso, con canalización eléctrica visible.',
        ],
        images: [
          {
            file: 'oficinas-tres-contenedores-40-hc-usados-exterior',
            width: 600,
            height: 800,
            alt: 'Conjunto de tres contenedores usados unidos con las puertas abiertas y un módulo central con puerta corrediza de vidrio; al fondo se ven escritorios',
            caption: 'Tres contenedores unidos en un solo conjunto.',
            pdfPage: 13,
          },
          {
            file: 'oficinas-tres-contenedores-40-hc-usados-interior-a',
            width: 800,
            height: 600,
            alt: 'Interior de contenedores usados unidos, con columna de acero, canalización eléctrica aparente en el muro y piso de madera',
            caption: 'Interior con instalación eléctrica aparente.',
            pdfPage: 14,
          },
          {
            file: 'oficinas-tres-contenedores-40-hc-usados-interior-b',
            width: 600,
            height: 800,
            alt: 'Interior de un contenedor usado visto hacia las puertas de carga, con techo corrugado y piso de madera',
            caption: 'Vista hacia el interior del módulo.',
            pdfPage: 14,
          },
          {
            file: 'oficinas-tres-contenedores-40-hc-usados-trabajos-a',
            width: 800,
            height: 600,
            alt: 'Interior en obra con muros de contenedor, columna de acero y trabajadores aplicando pintura junto a un muro rojo',
            caption: 'Trabajos en el interior.',
            pdfPage: 15,
          },
          {
            file: 'oficinas-tres-contenedores-40-hc-usados-trabajos-b',
            width: 600,
            height: 800,
            alt: 'Interior de varios contenedores unidos con columnas de acero y equipo de soldadura al fondo',
            caption: 'Unión de módulos y estructura interior.',
            pdfPage: 15,
          },
        ],
      },
      {
        id: 'oficina-20-dc-exterior-gris',
        category: 'Oficinas · Contenedor 20′ DC',
        title: 'Oficina de 20 pies con ventanas protegidas',
        story: [
          'Un contenedor de 20 pies pintado en franjas blancas y grises, con puerta de vidrio y dos ventanas con reja cuadriculada. Se muestra junto a otras unidades apiladas, en un patio de contenedores.',
        ],
        documented: ['Dimensiones: contenedor de 20′ DC.', 'Uso: oficinas.'],
        images: [
          {
            file: 'oficina-contenedor-20-dc-exterior-ventanas-con-reja',
            width: 800,
            height: 600,
            alt: 'Contenedor de 20 pies pintado en franjas blancas y grises, con puerta de vidrio y dos ventanas con reja cuadriculada, frente a otros contenedores',
            caption: 'Oficina en contenedor de 20 pies.',
            pdfPage: 17,
          },
        ],
      },
      {
        id: 'oficina-40-hc-protecciones-proyectables',
        category: 'Oficinas · Contenedor 40′ HC',
        title: 'Oficina de 40 pies con protecciones proyectables en ventanas',
        story: [
          'Las ventanas llevan protecciones que se proyectan hacia afuera, y la puerta de acceso cuenta con una hoja de reja. Se aprecia el contenedor siendo maniobrado con grúa en un patio.',
        ],
        documented: [
          'Dimensiones: contenedor de 40′ HC.',
          'Detalle: protecciones proyectables en ventanas.',
        ],
        images: [
          {
            file: 'oficina-contenedor-40-hc-ventanas-proyectables-exterior',
            width: 800,
            height: 600,
            alt: 'Contenedor gris de 40 pies con ventanas que tienen protecciones proyectables y una puerta de acceso con reja, suspendido en un patio de contenedores',
            caption: 'Ventanas con protecciones proyectables.',
            pdfPage: 19,
          },
        ],
      },
      {
        id: 'contenedor-40-dc-unidades-en-serie',
        category: 'Oficinas · Contenedor 40′ DC',
        title: 'Unidades de 40 pies en serie, con acceso individual',
        story: [
          'Una hilera de contenedores blancos, cada uno con su propia puerta y ventanas, y un interior con piso vinílico tipo madera, minisplit y ventanas corredizas.',
        ],
        documented: ['Dimensiones: contenedor de 40′ DC.'],
        visible: [
          'Varias unidades alineadas, cada una con puerta propia.',
          'Interior con piso vinílico tipo madera y minisplit.',
        ],
        images: [
          {
            file: 'contenedores-40-dc-hilera-de-unidades-con-puertas',
            width: 800,
            height: 600,
            alt: 'Hilera de contenedores blancos con puertas individuales y ventanas pequeñas sobre un patio de grava',
            caption: 'Unidades alineadas, cada una con acceso propio.',
            pdfPage: 16,
          },
          {
            file: 'contenedor-40-dc-interior-piso-vinilico-minisplit',
            width: 583,
            height: 800,
            alt: 'Interior largo de un contenedor con muros blancos, ventanas corredizas, minisplit al fondo y piso vinílico tipo madera',
            caption: 'Interior terminado.',
            pdfPage: 16,
          },
        ],
      },
      {
        id: 'acabados-interiores',
        category: 'Acabados interiores',
        title: 'Tres formas de resolver el interior',
        story: [
          'El acabado cambia por completo la sensación del espacio. Estos ejemplos, tomados del archivo, muestran combinaciones distintas. Los acabados indicados corresponden a cada página del documento; no se presentan como parte de un mismo proyecto.',
        ],
        documented: [
          'Tablaroca, piso de azulejo, aislamiento térmico y clima integrado.',
          'Aislante térmico, plafón, lambrín, piso PVC antiderrapante, instalación eléctrica y minisplit.',
          'Aislante térmico, plafón, lambrín, piso cerámico, instalación eléctrica y minisplit, además de un privado.',
        ],
        images: [
          {
            file: 'oficina-contenedor-tablaroca-piso-azulejo-interior-a',
            width: 600,
            height: 800,
            alt: 'Interior de un contenedor con muros de tablaroca blanca, ventana corrediza, minisplit al fondo y piso de azulejo gris',
            caption: 'Tablaroca y piso de azulejo.',
            pdfPage: 10,
          },
          {
            file: 'oficina-contenedor-tablaroca-piso-azulejo-interior-b',
            width: 600,
            height: 800,
            alt: 'Pasillo interior largo con ventanas, piso de azulejo y una puerta corrediza tipo granero al fondo',
            caption: 'Puerta corrediza al fondo.',
            pdfPage: 10,
          },
          {
            file: 'oficina-contenedor-20-dc-interior-lambrin-piso-pvc',
            width: 600,
            height: 800,
            alt: 'Interior de un contenedor con muros blancos, lámparas lineales, ventanas corredizas y piso PVC antiderrapante gris oscuro',
            caption: 'Lambrín y piso PVC antiderrapante.',
            pdfPage: 18,
          },
          {
            file: 'oficina-contenedor-20-dc-interior-cocineta',
            width: 800,
            height: 600,
            alt: 'Zona de cocineta dentro de un contenedor, con tarja, gabinete de madera, ventanas y minisplit',
            caption: 'Cocineta integrada.',
            pdfPage: 18,
          },
          {
            file: 'oficina-contenedor-40-hc-interior-plafon-iluminado',
            width: 800,
            height: 450,
            alt: 'Interior de una oficina con plafón con iluminación perimetral, repisa de madera corrida y piso cerámico',
            caption: 'Plafón con iluminación perimetral y piso cerámico.',
            pdfPage: 20,
          },
          {
            file: 'oficina-contenedor-40-hc-interior-privado',
            width: 450,
            height: 800,
            alt: 'Vista hacia un privado separado con puerta de vidrio y madera, con escritorios y piso cerámico al fondo',
            caption: 'Privado al fondo del espacio.',
            pdfPage: 20,
          },
        ],
      },
    ],
  },
  {
    id: 'capacitacion',
    eyebrow: 'Capítulo 04',
    title: 'Un aula que viaja',
    intro:
      'Cuando la capacitación debe ir a donde están las personas, el contenedor puede montarse sobre un remolque y convertirse en un centro de aprendizaje móvil.',
    cases: [
      {
        id: 'centro-capacitacion-modular-movil',
        category: 'Centro de capacitación modular / móvil · Contenedor 40′ DC',
        title: 'Centro de capacitación modular móvil',
        story: [
          'Un contenedor de 40 pies sobre remolque, con escalera de acceso, rotulación gráfica y una plataforma con reja en un extremo. Dentro, muros y techo forrados en madera, butacas en gradas, un área de trabajo con mobiliario fijo y luminarias de riel.',
        ],
        documented: [
          'Uso: centro de capacitación modular / móvil.',
          'Dimensiones: contenedor de 40′ DC.',
        ],
        visible: [
          'Montado sobre remolque, con escalera de acceso.',
          'Butacas en gradas y mobiliario fijo.',
          'Interior forrado en madera, con luminarias de riel, minisplit y piso metálico antiderrapante.',
        ],
        images: [
          {
            file: 'centro-capacitacion-movil-40-dc-exterior-remolque',
            width: 800,
            height: 600,
            alt: 'Contenedor blanco de 40 pies con franjas roja y negra montado sobre un remolque, con escalera de acceso y una plataforma con reja en un extremo',
            caption: 'Contenedor montado sobre remolque.',
            pdfPage: 21,
          },
          {
            file: 'centro-capacitacion-movil-40-dc-aula-butacas',
            width: 570,
            height: 754,
            alt: 'Aula interior forrada en madera con butacas rojas en gradas y ventanas pequeñas',
            caption: 'Aula con butacas en gradas.',
            pdfPage: 22,
          },
          {
            file: 'centro-capacitacion-movil-40-dc-mobiliario-y-minisplit',
            width: 483,
            height: 753,
            alt: 'Mobiliario fijo en tonos naranja y gris oscuro bajo un minisplit, con muros de madera y escalera',
            caption: 'Mobiliario fijo y clima.',
            pdfPage: 22,
          },
          {
            file: 'centro-capacitacion-movil-40-dc-interior-iluminacion-riel',
            width: 572,
            height: 755,
            alt: 'Interior largo del contenedor con luminarias de riel en el techo, repisa de trabajo y piso metálico',
            caption: 'Interior con iluminación de riel.',
            pdfPage: 22,
          },
        ],
      },
    ],
  },
];

export const allCases = chapters.flatMap((c) => c.cases);
