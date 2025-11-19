import React, { useState, useEffect, useRef } from 'react';
import { Card, Skeleton } from 'antd';
import { StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useMeal } from '../../hooks/useMeal';

const PopularDishesSection: React.FC<{ token: string | null }> = ({ token }) => {
  const { usePopularMeals } = useMeal(token);
  const { data: popularMeals = [], isLoading } = usePopularMeals();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // === CHIA SLIDE: 3 món/slide ===
  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const slides = chunkArray(popularMeals, 3);
  const totalSlides = slides.length;

  // === SCROLL ===
  const scrollToSlide = (slideIndex: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: 'smooth',
      });
    }
    setActiveSlide(slideIndex);
  };

  // === AUTO PLAY ===
  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;

    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % totalSlides;
      scrollToSlide(nextSlide);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide, totalSlides, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    const prevSlide = (activeSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevSlide);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const nextSlide = (activeSlide + 1) % totalSlides;
    scrollToSlide(nextSlide);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newActiveSlide = Math.round(scrollPosition / slideWidth);
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    }
  };

  // === SKELETON KHI LOADING ===
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold text-white">Top 9 Món Ăn Phổ Biến</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <Skeleton.Image className="w-full h-64" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // === KHÔNG CÓ DỮ LIỆU ===
  if (!popularMeals.length) return null;

  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80"
          alt="bg"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"
          alt="bg"
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-amber-600 text-sm tracking-wider uppercase">Món Ăn Nổi Bật</span>
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-5xl font-serif font-bold text-white">
            Top 9 Món Ăn Được Yêu Thích
          </h2>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <LeftOutlined />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <RightOutlined />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Vertical Decorative Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-64 hidden lg:block z-10">
            <div className="relative h-full">
              <div className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-full"></div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
              <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>
          <div className="lg:pl-16">
            <div
              ref={carouselRef}
              className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {slides.map((slideItems, slideIndex) => (
                <div key={slideIndex} className="flex-shrink-0 w-full snap-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {slideItems.map((item) => (
                      <div key={item.mealID} className="group relative">
                        <div className="my-2">
                          <Card
                            className="bg-gray-800 border-2 border-gray-700 hover:border-amber-600 transition-all duration-300 overflow-hidden h-full transform hover:-translate-y-2"
                            styles={{ body: { padding: 0 } }}
                          >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                              <img
                                src={item.image || '/placeholder.jpg'}
                                alt={item.mealName}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute top-4 left-4 z-10">
                                <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                                  <span className="text-amber-600 font-bold text-lg">
                                    ₫{item.price.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-white text-xl font-bold mb-3">{item.mealName}</h3>
                              <span className="text-gray-400 text-sm ml-2">
                                  {item.totalOrdered} lượt đặt
                              </span>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {item.categoryName} • Được yêu thích
                              </p>
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                scrollToSlide(index);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === index ? 'bg-amber-600 w-8' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default PopularDishesSection;