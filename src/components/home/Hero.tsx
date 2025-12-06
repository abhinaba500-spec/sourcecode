import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { InteractiveWidget } from './InteractiveWidget';
import { useAdmin } from '../../context/AdminContext';

export const Hero = () => {
  const { content } = useAdmin();
  const { hero } = content;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-purple-50 opacity-70" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-[100%] blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-20">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-xs font-medium text-gray-900 mb-8 shadow-sm"
          >
            <Sparkles className="w-3 h-3 fill-yellow-400 text-yellow-600" />
            <span>{hero.badge}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8 whitespace-pre-line"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-black to-gray-800 hover:to-gray-900 shadow-xl shadow-black/10">
              Start Free
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg group rounded-2xl bg-white/80 backdrop-blur-sm">
              View All AI Tools <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-6xl mx-auto"
        >
           <InteractiveWidget />
           
           {/* Enhanced Glow effects */}
           <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" />
           <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000" />
        </motion.div>
      </div>
    </section>
  );
};
