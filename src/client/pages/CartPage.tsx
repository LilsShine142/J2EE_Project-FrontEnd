import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CartContent from '../components/Orther/CartContent';
import Footer from '../components/Footer';
import Header from '../components/Header';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/client/dashboard');
  };

  const handleCheckout = () => {
    navigate('/client/checkout');
  };

  // Breadcrumbs for hero section
  const breadcrumbs = [
    { label: 'Home', href: '/client/dashboard' },
    { label: 'Cart', active: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection 
        title="Cart" 
        breadcrumbs={breadcrumbs}
      />
      
      <CartContent 
        onContinueShopping={handleContinueShopping}
        onCheckout={handleCheckout}
      />
      <Footer />
    </div>
  );
};

export default CartPage;