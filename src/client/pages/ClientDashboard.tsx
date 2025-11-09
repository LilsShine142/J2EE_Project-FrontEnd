import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import PopularDishesSection from '../components/PopularDishesSection';
import IntroductionSection from '../components/IntroductionSection';
import PromoBanner from '../components/PromoBanner';
import Footer from '../components/Footer';

const ClientDashboard: React.FC = () => {
  const token = Cookies.get('authToken') || null;

  // Reset scroll lock khi vào trang
  useEffect(() => {
    const resetScroll = () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };

    resetScroll();
    return resetScroll;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* HEADER */}
      <Header />

      <main className="w-full" id="home">
        {/* HOME SECTION – BẮT BUỘC CÓ CHIỀU CAO */}
        {/* <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-red-50 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-amber-600">Tastyes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Experience the finest cuisine in town
            </p>
            <button
              onClick={() => {
                const menu = document.getElementById('menu');
                if (menu) {
                  const headerOffset = 64;
                  const elementPosition = menu.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Menu
            </button>
          </div>
        </section> */}

        {/* ABOUT SECTION */}
        <section id="about">
          <ScrollReveal animation="fade-scale" delay={0} duration={1000}>
            <AboutSection />
          </ScrollReveal>
        </section>

        {/* INTRODUCTION */}
        <section id="introduction">
          <ScrollReveal animation="fade-scale" delay={100} duration={900}>
            <IntroductionSection />
          </ScrollReveal>
        </section>

        {/* POPULAR DISHES */}
        <section id="popular">
          <ScrollReveal animation="scale" delay={0} duration={1000}>
            <PopularDishesSection token={token} />
          </ScrollReveal>
        </section>

        {/* PROMO BANNER */}
        <section id="promo">
          <ScrollReveal animation="fade-scale" delay={150} duration={1100}>
            <PromoBanner />
          </ScrollReveal>
        </section>

        {/* MENU SECTION */}
        <section id="menu">
          <ScrollReveal animation="fade-scale" delay={0} duration={1000}>
            <MenuSection token={token} />
          </ScrollReveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="footer">
        <ScrollReveal animation="fade-scale" duration={800}>
          <Footer />
        </ScrollReveal>
      </footer>
    </div>
  );
};

export default ClientDashboard;