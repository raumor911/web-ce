import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQ: React.FC<FAQProps> = ({ 
  items, 
  title = "Preguntas Frecuentes",
  subtitle = "Información técnica y operativa para su proyecto."
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-brand-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
          <span className="section-subtitle">Soporte Técnico</span>
          <h2 className="section-title mb-6">{title}</h2>
          <p className="text-brand-graphite text-lg md:text-xl font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-4xl border-t border-brand-gray">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="border-b border-brand-gray overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 md:py-10 flex items-center justify-between text-left group transition-colors hover:text-brand-orange"
              >
                <span className="text-lg md:text-2xl font-serif text-brand-petroleum group-hover:text-brand-orange transition-colors">
                  {item.question}
                </span>
                <div className="flex-shrink-0 ml-4 p-2 rounded-full bg-brand-gray/30 group-hover:bg-brand-orange/10 transition-colors">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                  ) : (
                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="pb-10 md:pb-12 pr-12">
                      <p className="text-base md:text-lg text-brand-graphite leading-relaxed font-sans">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
