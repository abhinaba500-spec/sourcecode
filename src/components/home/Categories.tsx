import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Video, Bot, Mic, Code2, Briefcase, Terminal, Wrench } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

// Map string keys to actual Icon components
const iconMap: Record<string, any> = {
  PenTool, Video, Bot, Mic, Code2, Briefcase, Terminal, Wrench
};

export const Categories = () => {
  const { content } = useAdmin();
  // Defensive coding: Ensure categories exists before mapping
  const categories = content?.categories || [];

  return (
    <section id="power-grid" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The Power of Gravity</h2>
          <p className="text-xl text-gray-500">Everything you need to build the future.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = iconMap[cat.iconKey] || Bot;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
