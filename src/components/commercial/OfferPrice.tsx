import React from 'react';
import { PriceBookEntry } from '../../types/semantic';

interface OfferPriceProps {
  price?: PriceBookEntry;
  className?: string;
}

export const OfferPrice: React.FC<OfferPriceProps> = ({ price, className = "" }) => {
  if (!price) {
    return (
      <div className={`text-slate-400 italic text-sm ${className}`}>
        Precio bajo cotización
      </div>
    );
  }

  const formatCurrency = (n: number) => 
    new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: price.currency, 
      minimumFractionDigits: 2 
    }).format(n);

  return (
    <div className={className}>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-brand-petroleum tracking-tight">
          {formatCurrency(price.amount)}
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {price.currency}
        </span>
      </div>
      <div className="text-[10px] text-slate-400 font-sans mt-0.5 uppercase tracking-widest leading-none">
        Precio Base · Sin IVA ni logística
      </div>
    </div>
  );
};
