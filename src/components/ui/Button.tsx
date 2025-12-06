import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20 border border-transparent',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent',
    outline: 'bg-white text-gray-900 border border-gray-200 hover:border-gray-400 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:text-black hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 text-base rounded-full',
    lg: 'px-8 py-4 text-lg font-medium rounded-full',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'transition-all duration-200 flex items-center justify-center gap-2 font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
