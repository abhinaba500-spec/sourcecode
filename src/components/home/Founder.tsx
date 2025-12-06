import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { motion } from 'framer-motion';

export const Founder = () => {
  const { content } = useAdmin();
  const { founder } = content;

  return (
    <section id="founder" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl"
        >
          
          {/* Abstract Background Art */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-gray-800 to-black rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            {/* Image Container */}
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-white/10 overflow-hidden bg-gray-800 relative shadow-2xl ring-1 ring-white/20 group">
               {founder.image ? (
                 <img 
                   src={founder.image} 
                   alt={founder.name} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 text-sm">
                   No Image
                 </div>
               )}
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Builders, for Builders.</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl italic">
                "{founder.bio}"
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div className="font-bold text-xl text-white">{founder.name}</div>
                  <div className="text-gray-500 font-medium">{founder.role}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
