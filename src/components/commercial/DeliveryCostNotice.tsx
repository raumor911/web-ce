import React from 'react';
import { Truck, Info } from 'lucide-react';

interface DeliveryCostNoticeProps {
  locationName?: string;
  className?: string;
}

export const DeliveryCostNotice: React.FC<DeliveryCostNoticeProps> = ({ locationName, className = "" }) => {
  return (
    <div className={`flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-sm ${className}`}>
      <Truck className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-xs font-bold text-brand-petroleum uppercase tracking-widest">
          Costo de Entrega en Sitio
        </p>
        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
          Las unidades se encuentran en {locationName || 'nuestro patio operativo'}. El costo de transporte y maniobras se cotiza por separado según la ubicación exacta de su proyecto.
        </p>
      </div>
    </div>
  );
};
