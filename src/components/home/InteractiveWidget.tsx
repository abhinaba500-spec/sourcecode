import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, BarChart3, Cpu, Globe, Zap, Pause, CheckCircle2, Atom } from 'lucide-react';

export const InteractiveWidget = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: Mic, label: "Generating engaging script", color: "bg-blue-500" },
    { icon: Cpu, label: "Converting script into voiceovers", color: "bg-purple-500" },
    { icon: Globe, label: "Turning text & audio into video", color: "bg-orange-500" },
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsProcessing(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleStart = () => {
    setIsProcessing(true);
    setActiveStep(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        {/* Window Controls */}
        <div className="h-12 border-b border-gray-100 flex items-center px-6 justify-between bg-gray-50/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-gray-200" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <Atom className="w-3 h-3" /> Gravity Workflow
          </div>
          <div className="w-12" /> {/* Spacer for centering */}
        </div>

        {/* Workflow Visualizer */}
        <div className="p-8 md:p-12 bg-white relative min-h-[400px] flex flex-col items-center justify-center">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          <div className="relative z-10 w-full max-w-md space-y-4">
            {steps.map((step, index) => {
              const isActive = isProcessing && index === activeStep;
              const isCompleted = isProcessing && index < activeStep;
              const isPending = !isProcessing && index !== 0 && !isCompleted;

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isPending ? 0.5 : 1,
                    y: isActive ? 0 : 0,
                  }}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'bg-white border-black/10 shadow-xl shadow-black/5' 
                      : 'bg-white/50 border-gray-100'
                  }`}
                >
                  {/* Connector Line */}
                  {index !== steps.length - 1 && (
                    <div className={`absolute left-[2rem] top-14 w-0.5 h-6 -mb-2 z-0 ${
                      index < activeStep ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}

                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isActive ? 'bg-black text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      React.createElement(step.icon, { className: "w-6 h-6" })
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold text-sm ${isActive ? 'text-black' : 'text-gray-500'}`}>
                        {index + 1}. {step.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="w-2 h-2 rounded-full bg-black animate-pulse"
                        />
                      )}
                    </div>
                    {isActive && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                        className="h-1 bg-gray-100 rounded-full overflow-hidden"
                      >
                        <div className="h-full bg-black rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Button */}
          <motion.div 
            className="mt-12 relative z-20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleStart}
              disabled={isProcessing}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-medium shadow-xl shadow-black/20 hover:bg-gray-900 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Pause className="w-5 h-5" /> Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Run Workflow
                </>
              )}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
