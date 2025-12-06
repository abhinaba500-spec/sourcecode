import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "How do your AI tools work?", a: "We aggregate the best-in-class models and provide a unified interface to interact with them. You can chain different tools together to create complex workflows." },
  { q: "Do I need coding experience?", a: "Not at all. Gravity AI is designed to be no-code first. However, we do offer an API for developers who want to build custom integrations." },
  { q: "Are my files secure?", a: "Yes. We use enterprise-grade encryption and are SOC2 Type II compliant. Your data is never used to train our public models without your explicit permission." },
  { q: "Is there a free tier available?", a: "Yes! You can start for free with our Basic plan which gives you access to standard models and limited daily credits." },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                {openIndex === idx ? <Minus className="w-5 h-5 text-gray-400" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.a}
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
