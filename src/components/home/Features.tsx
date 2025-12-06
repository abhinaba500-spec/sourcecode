import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Mic2, Network, ShieldCheck, Wand2, Layers } from 'lucide-react';

const features = [
  {
    title: "Autonomous Agents",
    description: "Deploy agents that can browse the web, use tools, and execute complex workflows without supervision.",
    icon: Bot,
    colSpan: "lg:col-span-2",
    bg: "bg-gray-50"
  },
  {
    title: "Voice Synthesis",
    description: "Ultra-realistic voice generation with emotional intelligence.",
    icon: Mic2,
    colSpan: "lg:col-span-1",
    bg: "bg-white border border-gray-100"
  },
  {
    title: "Neural Networks",
    description: "Advanced reasoning capabilities powered by our proprietary Gravity-1 model.",
    icon: Network,
    colSpan: "lg:col-span-1",
    bg: "bg-white border border-gray-100"
  },
  {
    title: "Enterprise Security",
    description: "SOC2 Type II certified with end-to-end encryption for all agent interactions.",
    icon: ShieldCheck,
    colSpan: "lg:col-span-2",
    bg: "bg-gray-50"
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-black"></span>
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Everything you need to build.</h2>
            <p className="text-xl text-gray-500">
              From simple chatbots to complex autonomous swarms, GravityLabs provides the infrastructure for the next generation of AI.
            </p>
          </div>
          <div className="flex gap-2">
             {/* Optional Navigation Controls could go here */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${feature.colSpan} group relative overflow-hidden rounded-3xl p-10 hover:shadow-xl transition-all duration-500 ${feature.bg}`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    {React.createElement(feature.icon, { className: "w-7 h-7 text-black" })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
                
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-sm font-semibold text-black flex items-center gap-2">
                    Learn more <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
