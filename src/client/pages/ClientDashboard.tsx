import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import PopularDishesSection from '../components/PopularDishesSection';
import IntroductionSection from '../components/IntroductionSection';
import Footer from '../components/Footer';

const ClientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 overflow-x-hidden">
      <Header />
      <main>
        <AboutSection />
        <IntroductionSection />
        <PopularDishesSection />
        <MenuSection />
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;