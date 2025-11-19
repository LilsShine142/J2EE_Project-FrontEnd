import React, { useState } from 'react';

interface MenuItem {
  image: string;
  name: string;
  price: string;
  description: string;
  badge: string | null;
  slug: string;
}

interface ProductSectionProps {
  menuItem: MenuItem;
  onAddToCart: (quantity: number) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ menuItem, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Thumbnail images
  const productImages = [
    menuItem.image,
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
  ];

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const priceNumber = parseFloat(menuItem.price.replace('$', ''));
  const originalPrice = (priceNumber * 1.33).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Product Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4 bg-gray-50 rounded-lg p-8 relative">
            <img
              src={productImages[selectedImage]}
              alt="Product"
              className="w-full h-96 object-contain"
            />
            {menuItem.badge && (
              <div className="absolute top-4 right-4 bg-amber-600 text-black text-sm font-bold px-3 py-1 rounded">
                {menuItem.badge}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`bg-gray-50 rounded-lg p-4 border-2 transition-all ${
                  selectedImage === index
                    ? 'border-amber-500'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {/* {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))} */}
            {/* <span className="text-gray-600 text-sm">(32 Review)</span> */}
          </div>

          {/* Product Name */}
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            {menuItem.name}
          </h2>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-amber-600">{menuItem.price}</span>
            <span className="text-2xl text-gray-400 line-through">${originalPrice}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {menuItem.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border-2 border-amber-600 rounded-full overflow-hidden">
              <button
                onClick={() => handleQuantityChange('decrease')}
                className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <span className="text-amber-600 text-xl">−</span>
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 transition-colors"
              >
                <span className="text-amber-600 text-xl">+</span>
              </button>
            </div>
            <button 
              onClick={() => onAddToCart(quantity)}
              className="flex-1 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded font-semibold transition-all"
            >
              Add to cart
            </button>
          </div>

          {/* Meta Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-900">Category:</span>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="text-gray-600 hover:text-amber-600">Food(05)</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Modern Life(10)</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Healthy(02)</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Dessert(04)</a>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-900">Tags:</span>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="text-gray-600 hover:text-amber-600">Dinner</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Breakfast</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Beverage</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Sea Food</a>
                <span>,</span>
                <a href="#" className="text-gray-600 hover:text-amber-600">Menu</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="mt-16">
        <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8">Item Details</h3>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-600 leading-relaxed">
            {menuItem.description} This delicious dish is prepared with the finest ingredients,
            carefully selected to ensure the best quality and taste. Our chefs use traditional
            cooking methods combined with modern techniques to create a unique culinary experience.
            Each serving is prepared fresh to order, ensuring that you receive the highest quality meal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;