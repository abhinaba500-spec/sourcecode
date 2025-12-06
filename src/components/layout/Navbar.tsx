import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Atom, Bell, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAdmin } from '../../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { scrollY } = useScroll();
  const { content } = useAdmin();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navLinks = [
    { name: 'Platform', href: '#power-grid' },
    { name: 'Solutions', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Founder', href: '#founder' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-black rounded-lg text-white">
            <Atom className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-black tracking-tight">Gravity AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          {/* New Tool Link */}
          <Link 
            to="/tools/coder" 
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <Terminal className="w-4 h-4" /> Try Coder
          </Link>
        </div>

        {/* CTA & Notifications */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Notification Center */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Notifications</div>
                {content.notifications.map((notif) => (
                  <a 
                    key={notif.id} 
                    href={notif.link}
                    className="block px-3 py-3 hover:bg-gray-50 rounded-xl text-sm text-gray-700 transition-colors"
                  >
                    {notif.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="text-gray-900">Log In</Button>
          <Button variant="primary" size="sm">Start Free</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-black p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100vh' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white fixed inset-0 top-16 z-40 overflow-y-auto"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-medium text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/tools/coder"
              className="text-2xl font-medium text-indigo-600 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Terminal className="w-6 h-6" /> Try Coder
            </Link>
            <div className="h-px bg-gray-100 my-4" />
            <Button variant="outline" className="w-full justify-center">Log In</Button>
            <Button variant="primary" className="w-full justify-center">Start Free</Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
