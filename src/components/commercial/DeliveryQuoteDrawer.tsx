import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Truck, MapPin, Package, Phone, User, MessageSquare, AlertCircle } from 'lucide-react';
import { PublicContainerOffer } from '../../types/semantic';

interface DeliveryQuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  offer: PublicContainerOffer | null;
  whatsappNumber: string;
}

export const DeliveryQuoteDrawer: React.FC<DeliveryQuoteDrawerProps> = ({ 
  isOpen, 
  onClose, 
  offer, 
  whatsappNumber 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectLocation: '',
    useCase: '',
    message: ''
  });

  if (!offer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { product, service, price, inventory } = offer;
    const mode = service.id === 'service:container-rental' ? 'renta' : 'compra';
    const amountStr = price 
      ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: price.currency }).format(price.amount)
      : 'Bajo cotización';

    const text = `Hola Creativos Espacios. Solicito cotización para ${mode}, logística y maniobras para:

📦 PRODUCTO: ${product.name}
💰 PRECIO BASE: ${amountStr}
🏗️ CONDICIÓN: ${price?.condition === 'used' ? 'Usado' : price?.condition === 'new' ? 'Nuevo' : 'One Trip'}
📍 STOCK EN: ${offer.location?.name || 'Iztapalapa'}

👤 DATOS DEL CLIENTE:
- Nombre: ${formData.name}
- Teléfono: ${formData.phone}
- Ubicación del proyecto: ${formData.projectLocation}
- Uso previsto: ${formData.useCase}

💬 MENSAJE: ${formData.message || 'Sin mensaje adicional.'}

Quedo atento a la cotización de envío y maniobras.`;

    const waLink = `https://wa.me/${whatsappNumber.replace('https://wa.me/', '')}?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-petroleum/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-brand-petroleum text-white">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight">Solicitar Cotización</h2>
                  <p className="text-xs text-white/60 font-sans tracking-widest uppercase mt-1">
                    Logística y Entrega en Sitio
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Offer Summary */}
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-slate-200 rounded-sm overflow-hidden shrink-0">
                    <img 
                      src={offer.product.id === 'product:container-20ft' ? '/images/venta-renta-contenedor-20ft.png' : '/images/venta-renta-contenedor-40ft.png'} 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-petroleum uppercase text-sm">{offer.product.name}</h3>
                    <p className="text-xs text-slate-500 font-sans mt-1">
                      {offer.service.name} · {offer.price?.condition === 'used' ? 'Usado' : 'Nuevo'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 flex-grow space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm font-sans"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Teléfono / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm font-sans"
                          placeholder="55 0000 0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Ubicación del Proyecto
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          required
                          type="text"
                          value={formData.projectLocation}
                          onChange={e => setFormData({ ...formData, projectLocation: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm font-sans"
                          placeholder="Ciudad / Estado"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Uso del Contenedor
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <select
                        required
                        value={formData.useCase}
                        onChange={e => setFormData({ ...formData, useCase: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm font-sans appearance-none"
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="Almacenamiento">Almacenamiento</option>
                        <option value="Bodega Operativa">Bodega Operativa</option>
                        <option value="Oficina / Módulo">Oficina / Módulo</option>
                        <option value="Obra / Construcción">Obra / Construcción</option>
                        <option value="Otro">Otro uso especial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Notas Adicionales (Opcional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-sm font-sans min-h-[100px]"
                        placeholder="Detalles sobre maniobras, urgencia, etc."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm flex gap-3">
                  <AlertCircle className="h-5 w-5 text-brand-orange shrink-0" />
                  <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest leading-relaxed">
                    Al enviar, se abrirá una ventana de WhatsApp para formalizar su solicitud con un asesor.
                  </p>
                </div>
              </form>

              {/* Footer CTA */}
              <div className="p-6 border-t border-slate-100">
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-brand-orange text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-orange-dark transition-all group shadow-lg"
                >
                  Enviar a WhatsApp
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
