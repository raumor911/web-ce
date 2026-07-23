export interface EspacioModular {
  id: string;
  titulo: string;
  slug: string;
  tipo: 'estandar' | 'oficina' | 'especial';
  dimensiones: '20FT' | '40FT' | 'Personalizado';
  descripcion: string;
  especificaciones: {
    area: string;
    capacidad: string;
    aislamiento?: boolean;
    climatizacion?: boolean;
    material?: string;
  };
  servicios: ('venta' | 'renta')[];
  disponibilidad: 'inmediata' | 'bajo-pedido';
  imagenes: string[];
}

export interface NavLink {
  name: string;
  href: string;
}
