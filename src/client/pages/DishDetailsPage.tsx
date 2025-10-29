import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductSection from '../components/Orther/ProductSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MenuItem {
  image: string;
  name: string;
  price: string;
  description: string;
  badge: string | null;
  slug: string;
}

const DishDetailsPage: React.FC = () => {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Default product if no item selected
  const defaultItem: MenuItem = {
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    name: 'To Make Delicious Food Item',
    price: '$30',
    description: 'Donec bibendum enim ut elit porta ullamcorper. Vestibulum Nisi lorem, hendrerit bendum enim ut elit porta ullamcorper enim. Vestibulum Nisi weekendni iaculis vitae nulla nec bibendum enim ut elit porta ullamcor',
    badge: null,
    slug: 'delicious-food-item'
  };

  useEffect(() => {
    // Load from sessionStorage based on slug
    const storedItem = sessionStorage.getItem('selectedMenuItem');
    if (storedItem) {
      const item = JSON.parse(storedItem);
      // Verify slug matches
      if (item.slug === slug) {
        setMenuItem(item);
      } else {
        setMenuItem(defaultItem);
      }
    } else {
      setMenuItem(defaultItem);
    }

    // Listen for menu item selection events
    const handleMenuItemSelected = (event: any) => {
      setMenuItem(event.detail);
    };

    window.addEventListener('menuItemSelected', handleMenuItemSelected);
    return () => window.removeEventListener('menuItemSelected', handleMenuItemSelected);
  }, [slug]);

  const handleAddToCart = (quantity: number) => {
    if (!menuItem) return;

    // Get existing cart from sessionStorage
    const existingCart = sessionStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add item to cart
    const cartItem = {
      ...menuItem,
      quantity,
      addedAt: new Date().toISOString()
    };
    cart.push(cartItem);
    
    // Save to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`Added ${quantity} x ${menuItem.name} to cart!`);
    
    // Navigate to cart page
    navigate('/client/cart');
  };

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Breadcrumbs for hero section
  const breadcrumbs = [
    { label: 'Home', href: '/client/dashboard' },
    { label: menuItem.name, active: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection 
        title="Shop Details" 
        breadcrumbs={breadcrumbs}
      />
      
      <ProductSection 
        menuItem={menuItem}
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </div>
  );
};

export default DishDetailsPage;