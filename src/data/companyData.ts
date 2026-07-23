export const companyData = {
  name: "Creativos Espacios",
  legalName: "[VALIDAR: razón social oficial]",
  url: "https://www.creativosespacios.mx",
  description: "Creativos Espacios desarrolla infraestructura modular para empresas, operaciones y proyectos que requieren incorporar espacios funcionales sin construir desde cero.",
  preferredPositioning: "Proveedor de infraestructura modular para operaciones, proyectos y necesidades temporales de espacio.",
  coreProposition: "Capacidad operativa sin construir desde cero.",
  tagline: "Capacidad operativa sin construir desde cero.",
  country: "MX",
  language: "es-MX",
  contact: {
    telephone: "55 5426 9941",
    email: "ventas@creativosespacios.mx",
    whatsapp: "https://wa.me/522291846751",
    whatsappNumber: "522291846751",
    address: "[VALIDAR: dirección pública autorizada]"
  },
  services: [
    {
      id: "container-sale",
      name: "Venta de contenedores",
      category: "Infraestructura modular",
      description: "Suministro de contenedores para almacenamiento, operación o proyectos que requieren adquirir el activo.",
      transactionType: "sale",
      path: "/soluciones/venta-renta",
      availability: "subject-to-confirmation",
      requiresAssessment: true
    },
    {
      id: "container-rental",
      name: "Renta de contenedores",
      category: "Infraestructura modular",
      description: "Disponibilidad temporal de contenedores para almacenamiento, operación o proyectos.",
      transactionType: "rental",
      path: "/soluciones/venta-renta",
      availability: "subject-to-confirmation",
      requiresAssessment: true
    },
    {
      id: "relocatable-offices",
      name: "Oficinas reubicables",
      category: "Infraestructura modular",
      description: "Espacios modulares destinados a funciones como supervisión, coordinación, administración y soporte operativo.",
      transactionType: "sale-or-rental",
      path: "/soluciones/oficinas",
      availability: "subject-to-confirmation",
      requiresAssessment: true
    },
    {
      id: "modular-projects",
      name: "Proyectos modulares",
      category: "Infraestructura modular",
      description: "Soluciones desarrolladas para requerimientos que necesitan una configuración técnica y funcional específica.",
      transactionType: "custom-project",
      path: "/proyectos",
      availability: "subject-to-confirmation",
      requiresAssessment: true
    }
  ],
  routes: {
    home: "/",
    nosotros: "/nosotros",
    ventaRenta: "/soluciones/venta-renta",
    oficinas: "/soluciones/oficinas",
    proyectos: "/proyectos",
    contacto: "/contacto"
  },
  lastReviewed: new Date().toISOString()
};
