import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeal } from '../../hooks/useMeal';
import { useCategory } from '../../hooks/useCategory';
import { Skeleton } from 'antd';

interface MenuItem {
  mealID: number;
  image?: string;
  name: string;
  price: string;
  description?: string;
  badge?: string;
  slug: string;
}

const MenuSection: React.FC<{ token: string | null }> = ({ token }) => {
  const navigate = useNavigate();
  const { useCategories } = useCategory(token);
  const { useMealsByCategory } = useMeal(token);

  // === DATA ===
  const { data: categoryPage, isLoading: loadingCats } = useCategories(0, 100);
  const categories = categoryPage?.content ?? [];

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: paginatedMeals, isLoading: loadingMeals } = useMealsByCategory(
    activeCategoryId!,
    { offset: 0, limit: 100 },
    { enabled: !!activeCategoryId }
  );

  const allMeals = paginatedMeals?.items ?? [];
  const displayedMeals = isExpanded ? allMeals : allMeals.slice(0, 4);

  // === TỰ ĐỘNG CHỌN CATEGORY ĐẦU ===
  useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].categoryID);
    }
  }, [categories]);

  // === XỬ LÝ HEADER SCROLL: TỰ ĐỘNG MỞ TAB + XEM THÊM ===
  useEffect(() => {
    const handleHeaderScroll = (e: CustomEvent) => {
      const { categoryId, expand } = e.detail;
      if (categoryId) {
        setActiveCategoryId(categoryId);
        if (expand) {
          setTimeout(() => setIsExpanded(true), 100);
        }
      }
    };

    window.addEventListener('header-scroll-to-menu', handleHeaderScroll as EventListener);
    return () => window.removeEventListener('header-scroll-to-menu', handleHeaderScroll as EventListener);
  }, []);

  const handleItemClick = (item: MenuItem) => {
    sessionStorage.setItem('selectedMenuItem', JSON.stringify(item));
    navigate(`/client/dish/${item.slug}`);
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  // === SKELETON ===
  const CategorySkeleton = () => (
    <div className="flex gap-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton.Button key={i} active size="small" style={{ width: 120, height: 40 }} />
      ))}
    </div>
  );

  const MealSkeleton = () => (
    <div className="flex gap-6 animate-pulse">
      <div className="w-24 h-24 bg-gray-700 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <section id="menu" className="relative py-20 px-4 bg-gray-900 overflow-hidden mt-[-32px]">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-amber-600">
              <path d="M10 20L5 10L10 5L15 10L10 20Z" fill="currentColor" />
              <path d="M30 20L25 10L30 5L35 10L30 20Z" fill="currentColor" />
              <path d="M50 20L45 10L50 5L55 10L50 20Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">
            Delicious Menu
          </h2>
          {loadingCats ? (
            <Skeleton.Input active size="small" style={{ width: 200 }} className="mx-auto" />
          ) : (
            <p className="text-gray-400 text-sm">{categoryPage?.totalElements} danh mục món ăn</p>
          )}
        </div>

        {/* TABS: DANH MỤC – CÓ data-category-id */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          {loadingCats ? (
            <CategorySkeleton />
          ) : (
            <div className="inline-flex border-t border-b border-amber-600 divide-x divide-amber-600 min-w-full md:min-w-0">
              {categories.map((cat) => (
                <button
                  key={cat.categoryID}
                  data-category-id={cat.categoryID} // ← BẮT BUỘC CHO HEADER
                  onClick={() => {
                    setActiveCategoryId(cat.categoryID);
                    setIsExpanded(false);
                  }}
                  className={`px-6 py-4 text-sm tracking-wider font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeCategoryId === cat.categoryID
                      ? 'bg-amber-600 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {cat.categoryName.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DANH SÁCH MÓN */}
        <div className="max-w-6xl mx-auto mb-12">
          {loadingMeals ? (
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <MealSkeleton key={i} />
              ))}
            </div>
          ) : displayedMeals.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Chưa có món ăn trong danh mục này.</p>
          ) : (
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 transition-all duration-500 ease-in-out ${
                isExpanded ? 'pb-8' : ''
              }`}
            >
              {displayedMeals.map((meal, index) => {
                const item: MenuItem = {
                  mealID: meal.mealID,
                  image: meal.image || 'https://via.placeholder.com/300?text=No+Image',
                  name: meal.mealName,
                  price: `$${meal.price.toFixed(2)}`,
                  description: meal.categoryName,
                  badge: meal.statusId === 2 ? 'HẾT MÓN' : undefined,
                  slug: generateSlug(meal.mealName),
                };

                return (
                  <div
                    key={meal.mealID}
                    className="transform transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      animation: isExpanded ? `fadeIn 0.3s ease-out ${index * 0.05}s both` : 'none',
                      animationFillMode: 'backwards',
                    }}
                  >
                    <button
                      onClick={() => handleItemClick(item)}
                      className="flex gap-6 group text-left w-full cursor-pointer"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-amber-600 transition-all duration-300">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        {item.badge && (
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {item.badge}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent min-w-[40px]"></div>
                            <span className="text-amber-500 font-bold text-lg whitespace-nowrap">
                              {item.price}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* NÚT XEM THÊM / THU GỌN – CÓ class load-more-btn */}
        {allMeals.length > 4 && (
          <div className="text-center mt-8">
            <button
              className="load-more-btn px-8 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 mx-auto"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>THU GỌN</>
              ) : (
                <>
                  XEM THÊM ({allMeals.length - 4} món nữa)
                </>
              )}
            </button>
          </div>
        )}

        {/* Giờ mở cửa */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            During winter daily from <span className="text-amber-500 font-semibold">7:00 pm</span> to{' '}
            <span className="text-amber-500 font-semibold">9:00 pm</span>
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default MenuSection;