import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Database } from 'lucide-react';
import { InventoryEntry } from '../../types/semantic';

interface InventoryStatusProps {
  status?: InventoryEntry['stockStatus'];
  hint?: string;
  className?: string;
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ status, hint, className = "" }) => {
  if (!status) return null;

  const config = {
    in_stock: {
      icon: CheckCircle2,
      text: 'En Stock',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100'
    },
    low_stock: {
      icon: AlertCircle,
      text: 'Bajo Stock',
      color: 'text-brand-orange',
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    },
    out_of_stock: {
      icon: AlertCircle,
      text: 'Agotado',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    on_request: {
      icon: Clock,
      text: 'Bajo Pedido',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    }
  }[status];

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.color} ${config.border} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-bold uppercase tracking-widest">
        {config.text} {hint && <span className="opacity-70 ml-1">({hint})</span>}
      </span>
    </div>
  );
};
