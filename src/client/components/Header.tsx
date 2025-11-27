import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { type User } from '../../types/index';
import standaloneRoutes from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import NotificationIcon from '../../components/NotificationIcon/NotificationIcon';

// Lazy load BookingForm
const BookingForm = lazy(() => import('./BookingForm/BookingForm'));

interface MenuItem {
  label: string;
  targetId?: string;
  categoryId?: number;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; targetId?: string; categoryId?: number }[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'HOME', targetId: 'home' },
  {
    label: 'MENU',
    targetId: 'menu',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Món chính', targetId: 'menu', categoryId: 1 },
      { label: 'Khai vị', targetId: 'menu', categoryId: 2 },
      { label: 'Đồ uống', targetId: 'menu', categoryId: 3 },
      { label: 'Lẩu', targetId: 'menu', categoryId: 4 },
      { label: 'Rau', targetId: 'menu', categoryId: 5 },
      { label: 'Canh', targetId: 'menu', categoryId: 6 },
      { label: 'Tráng miệng', targetId: 'menu', categoryId: 7 },
    ],
  },
  { label: 'ABOUT', targetId: 'about' },
  { label: 'CONTACT', targetId: 'footer' },
];

const SECTION_IDS = ['home', 'menu', 'about', 'footer'];
const HEADER_OFFSET = 64;
const SCROLL_DETECT_THRESHOLD = 2;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState<string>('home');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isBookingFormReady, setIsBookingFormReady] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const scrollCheckRef = useRef<number | null>(null);
  const isHomePage = location.pathname === standaloneRoutes.client_dashboard;

  // Load user từ cookie
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error('Lỗi parse user cookie:', err);
        setUser(null);
      }
    }
  }, []);

  // Intersection Observer cho active menu
  useEffect(() => {
    if (!isHomePage || isUserScrolling) return;

    const elements = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrolling) return;

        let visibleSection: string | null = null;
        let maxRatio = 0;

        // Ưu tiên footer nếu visible
        const footerEntry = entries.find(e => e.target.id === 'footer');
        if (footerEntry?.isIntersecting) {
          visibleSection = 'footer';
        } else {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              visibleSection = entry.target.id;
            }
          });
        }

        if (visibleSection && visibleSection !== activeMenu) {
          setActiveMenu(visibleSection);
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -30% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach(el => observer.observe(el));

    if (window.scrollY < 100) setActiveMenu('home');

    return () => observer.disconnect();
  }, [isUserScrolling, activeMenu, isHomePage]);

  // Reset active menu khi chuyển trang
  useEffect(() => {
    if (!isHomePage) {
      setActiveMenu('');
    } else if (window.scrollY < 100) {
      setActiveMenu('home');
    }
  }, [isHomePage]);

  // Cleanup scroll animation
  useEffect(() => {
    return () => {
      if (scrollCheckRef.current) {
        cancelAnimationFrame(scrollCheckRef.current);
      }
    };
  }, []);

  // Smooth scroll đến section
  const scrollToSection = (targetId: string, categoryId?: number) => {
    if (!isHomePage) {
      navigate(standaloneRoutes.client_dashboard);
      setTimeout(() => performScroll(targetId, categoryId), 150);
      return;
    }
    performScroll(targetId, categoryId);
  };

  const performScroll = (targetId: string, categoryId?: number) => {
    const element = document.getElementById(targetId);
    if (!element) return;

    setActiveMenu(targetId);
    setIsUserScrolling(true);
    setOpenDropdown(null);

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

    if (scrollCheckRef.current) cancelAnimationFrame(scrollCheckRef.current);

    let lastPos = window.pageYOffset;
    const checkScroll = () => {
      const currentPos = window.pageYOffset;
      if (Math.abs(currentPos - lastPos) < SCROLL_DETECT_THRESHOLD) {
        setIsUserScrolling(false);
      } else {
        lastPos = currentPos;
        scrollCheckRef.current = requestAnimationFrame(checkScroll);
      }
    };

    setTimeout(() => {
      scrollCheckRef.current = requestAnimationFrame(checkScroll);
    }, 300);

    // Xử lý click category tab
    if (targetId === 'menu' && categoryId !== undefined) {
      setTimeout(() => {
        const tabButton = document.querySelector(
          `[data-category-id="${categoryId}"]`
        ) as HTMLButtonElement;
        tabButton?.click();
      }, 600);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    scrollToSection(item.targetId!, item.categoryId);
  };

  const handleDropdownClick = (dropItem: { label: string; targetId?: string; categoryId?: number }) => {
    scrollToSection(dropItem.targetId!, dropItem.categoryId);
  };

  const handleBookingClick = () => {
    setIsBookingLoading(true);
    // Chờ BookingForm load xong rồi mới mở modal
  };

  const handleBookingFormReady = () => {
    setIsBookingFormReady(true);
    setIsBookingLoading(false);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
  };

  const handleProfileAction = (path: string) => {
    setOpenDropdown(null);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setOpenDropdown(null);
    // navigate(standaloneRoutes.client_dashboard);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => navigate(standaloneRoutes.client_dashboard)}
              className="text-2xl font-serif font-bold text-white hover:text-amber-500 transition-colors"
            >
              Tastyes
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {MENU_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`relative text-sm font-medium tracking-wide transition-all duration-300 group py-6 ${
                    activeMenu === item.targetId
                      ? 'text-amber-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.hasDropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>

                  <span
                    className={`absolute -bottom-0 left-0 right-0 h-0.5 bg-amber-500 transition-all duration-300 origin-left ${
                      activeMenu === item.targetId ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                  />
                </button>

                {item.hasDropdown && openDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 pt-2 w-48">
                    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden animate-fadeIn">
                      {item.dropdownItems.map((dropItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleDropdownClick(dropItem)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors duration-200"
                        >
                          {dropItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* User Profile */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="max-w-[100px] truncate">{user.fullName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === 'user' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => navigate(standaloneRoutes.authPage)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* User Dropdown */}
              {user && openDropdown === 'user' && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                  onMouseEnter={() => setOpenDropdown('user')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => handleProfileAction(standaloneRoutes.profile)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Xem thông tin
                  </button>
                  <button
                    onClick={() => handleProfileAction('/client/profile/edit')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa thông tin
                  </button>
                  <hr className="border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* RESERVATION */}
            <button
              onClick={handleBookingClick}
              disabled={isBookingLoading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isBookingLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                'RESERVATION'
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate(standaloneRoutes.cart)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Notification Icon */}
            <NotificationIcon />

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PRELOAD BOOKING FORM - Ẩn để load trước */}
      {isBookingLoading && !isBookingFormReady && (
        <div className="hidden">
          <Suspense fallback={<div />}>
            <BookingFormPreloader onReady={handleBookingFormReady} />
          </Suspense>
        </div>
      )}

      {/* BOOKING MODAL - Chỉ hiện khi đã load xong */}
      {showBookingModal && isBookingFormReady && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeBookingModal}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-full m-4 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Booking Form</h3>
              <button
                onClick={closeBookingModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <BookingForm 
              visible={showBookingModal} 
              onCancel={closeBookingModal}
            />
          </div>
        </div>
      )}

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </header>
  );
};

// Component preloader để load BookingForm trước
const BookingFormPreloader: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  useEffect(() => {
    // Báo hiệu đã load xong
    onReady();
  }, [onReady]);

  return <BookingForm visible={false} onCancel={() => {}} />;
};

export default Header;