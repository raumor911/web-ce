import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Maximize2, ShieldCheck, Zap } from 'lucide-react';
import { PublicContainerOffer } from '../../types/semantic';
import { InventoryStatus } from './InventoryStatus';
import { OfferPrice } from './OfferPrice';
import { DeliveryCostNotice } from './DeliveryCostNotice';

interface ContainerOfferCardProps {
  offer: PublicContainerOffer;
  onQuote: (offer: PublicContainerOffer) => void;
}

export const ContainerOfferCard: React.FC<ContainerOfferCardProps> = ({ offer, onQuote }) => {
  const { product, inventory, price, location } = offer;

  // Image mapping for containers (consistent with previous implementations)
  const imageSrc = product.id === 'product:container-20ft' 
    ? '/images/venta-renta-contenedor-20ft.png'
    : '/images/venta-renta-contenedor-40ft.png';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 overflow-hidden flex flex-col h-full group hover:shadow-2xl transition-all duration-500"
    >
      {/* Header / Status */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <InventoryStatus status={inventory?.stockStatus} hint={inventory?.quantityHint} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Ref: {product.isoSizeTypeCode || 'STD'}
        </span>
      </div>

      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-petroleum/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 flex-grow space-y-4">
        <div>
          <h3 className="text-xl font-bold text-brand-petroleum mb-1 uppercase tracking-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-widest">
            <Maximize2 className="h-3.5 w-3.5" />
            {product.nominalDimensions || product.dimensions}
          </div>
        </div>

        <ul className="space-y-2">
          {product.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
              <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-slate-100">
          <OfferPrice price={price} />
        </div>

        <DeliveryCostNotice locationName={location?.name} />
      </div>

      {/* Footer / CTA */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button
          onClick={() => onQuote(offer)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-orange text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-orange-dark transition-all group"
        >
          Solicitar Cotización
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>
    </motion.div>
  );
};
