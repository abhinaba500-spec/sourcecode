import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { TokenProvider } from './context/TokenContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { Categories } from './components/home/Categories';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { Features } from './components/home/Features';
import { Pricing } from './components/home/Pricing';
import { Testimonials } from './components/home/Testimonials';
import { FAQ } from './components/home/FAQ';
import { Founder } from './components/home/Founder';
import { LoginPage } from './components/admin/LoginPage';
import { EnterpriseAdmin } from './components/admin/EnterpriseAdmin';
import { GravityStudio } from './components/tools/GravityStudio';

// Landing Page Component
const LandingPage = () => (
  <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white font-sans antialiased">
    <Navbar />
    <main>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <Features />
      <Pricing />
      <Testimonials />
      <Founder />
      <FAQ />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <TokenProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* New Gravity Studio (Lovable Style) */}
              <Route path="/tools/coder" element={<GravityStudio />} />
              
              {/* Admin Routes - Secret Path */}
              <Route path="/admin8240152131" element={<LoginPage />} />
              
              {/* Enterprise Admin Dashboard */}
              <Route path="/admin/dashboard" element={<EnterpriseAdmin />} />
            </Routes>
          </BrowserRouter>
        </TokenProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
