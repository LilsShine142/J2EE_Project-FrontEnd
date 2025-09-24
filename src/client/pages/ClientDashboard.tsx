import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import ReservationSection from '../components/ReservationSection';
import Footer from '../components/Footer';

const ClientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 overflow-x-hidden">
      <Header />
      <main>
        <AboutSection />
        <MenuSection />
        <ReservationSection />
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;