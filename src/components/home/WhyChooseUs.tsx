import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, ShieldCheck, LayoutDashboard } from 'lucide-react';

const reasons = [
  {
    icon: LayoutDashboard,
    title: "One Dashboard",
    desc: "Stop switching tabs. Access 100+ AI tools from a single, unified interface."
  },
  {
    icon: Zap,
    title: "Ultra Fast",
    desc: "Powered by edge computing to ensure your agents respond in milliseconds."
  },
  {
    icon: Layers,
    title: "Model Agnostic",
    desc: "Switch between GPT-4, Claude, and Llama instantly for the best results."
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Secure",
    desc: "SOC2 compliant infrastructure keeping your proprietary data safe."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
             <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600 mb-6">
                Why Gravity AI?
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                The operating system for your AI workforce.
             </h2>
             <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                We've consolidated the fragmented AI landscape into a cohesive, powerful platform designed for builders and businesses.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                      <reason.icon className="w-5 h-5 text-black" />
                    </div>
                    <h4 className="font-bold text-gray-900">{reason.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{reason.desc}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 bg-gray-900 rounded-3xl p-2 shadow-2xl"
            >
               <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 aspect-square md:aspect-[4/3] relative">
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                  <div className="absolute top-6 left-6 right-6 bottom-6 border border-gray-700 rounded-xl bg-gray-900/50 backdrop-blur flex flex-col">
                     <div className="h-10 border-b border-gray-700 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                     </div>
                     <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                           <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                              <Zap className="w-8 h-8 text-blue-400" />
                           </div>
                           <div className="h-2 w-32 bg-gray-700 rounded-full mx-auto mb-2" />
                           <div className="h-2 w-24 bg-gray-700 rounded-full mx-auto" />
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
            {/* Decorative elements */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-100 rounded-full -z-10" />
            <div className="absolute -left-5 -top-5 w-20 h-20 bg-black/5 rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};
