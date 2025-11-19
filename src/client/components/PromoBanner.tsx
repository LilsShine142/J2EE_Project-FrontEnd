import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

interface RestaurantBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onReserveClick?: () => void;
}

const PromoBanner: React.FC<RestaurantBannerProps> = ({
  title = "Nhà Hàng Delicious",
  subtitle = "Trải nghiệm ẩm thực đẳng cấp trong không gian sang trọng",
  buttonText = "Đặt Bàn Ngay",
  onReserveClick
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hiệu ứng xuất hiện khi component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-8 group">
      {/* Background Image với hiệu ứng parallax */}
      <div className="absolute inset-0 transform transition-transform duration-700 group-hover:scale-110">
        <img 
          src="https://res.cloudinary.com/ddlso6ofq/image/upload/v1761933540/Pngtree_variety_of_indian_food_in_3419900_1_rkhppj.jpg" 
          alt="Nhà hàng sang trọng"
          className="w-full h-full object-cover transition-all duration-1000 group-hover:brightness-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Nội dung với hiệu ứng animation */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 md:px-16 lg:px-24">
        {/* Badge đặc biệt */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-amber-500 text-white text-sm font-semibold py-2 px-4 rounded-full inline-flex items-center mb-6">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Mở cửa từ 10:00 - 22:00
          </div>
        </div>

        {/* Tiêu đề chính với hiệu ứng typewriter */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-2xl leading-tight transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {title.split('').map((char, index) => (
            <span 
              key={index}
              className="inline-block transform transition-all duration-500 hover:scale-110 hover:text-amber-200 cursor-default"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animation: isVisible ? 'typewriter 0.5s forwards' : 'none'
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Phụ đề với hiệu ứng fade in */}
        <p className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-xl leading-relaxed transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {subtitle}
        </p>

        {/* Nút đặt bàn với hiệu ứng pulse và hover */}
        <div className={`transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* <button 
            onClick={onReserveClick}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg animate-pulse hover:animate-none group/btn"
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg">{buttonText}</span>
              <svg 
                className="w-5 h-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button> */}
          {/* Order Button */}
          <Button
            type="primary"
            size="large"
            className="!bg-lime-400 !border-lime-400 !text-black font-bold hover:!bg-lime-500"
            icon={<ArrowRightOutlined />}
            onClick={onReserveClick}
          >
            ORDER NOW
          </Button>
        </div>

        {/* Thông tin phụ với hiệu ứng */}
        <div className={`mt-8 flex flex-wrap gap-6 text-white/80 transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-amber-400">★</span>
            <span>4.9/5 (2.5k+ đánh giá)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-amber-400">🍽️</span>
            <span>Ẩm thực Việt - Âu</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-amber-400">📍</span>
            <span>Trung tâm thành phố</span>
          </div>
        </div>
      </div>

      {/* Hiệu ứng particles background */}
      <div className="absolute inset-0 z-10 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* CSS animations inline */}
      <style>{`
        @keyframes typewriter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default PromoBanner;
