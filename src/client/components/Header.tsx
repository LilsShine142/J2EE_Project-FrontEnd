// import React, { useState, useEffect } from 'react';
// import BookingForm from './BookingForm/BookingForm';
// import { useNavigate } from 'react-router-dom';
// import standaloneRoutes from '../../config/routes';
// import { type User } from '../../service/authService';
// import Cookies from 'js-cookie';

// interface MenuItem {
//   label: string;
//   path: string;
//   hasDropdown?: boolean;
//   dropdownItems?: { label: string; path: string }[];
// }

// // interface User {
// //   name: string;
// //   email: string;
// //   phone?: string;
// // }

// const Header: React.FC = () => {
//   const [activeMenu, setActiveMenu] = useState('home');
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   // Lấy user từ cookie khi component mount
//   useEffect(() => {
//     const userCookie = Cookies.get('user');
//     if (userCookie) {
//       try {
//         const parsedUser = JSON.parse(userCookie);
//         console.log('User từ cookie:', parsedUser);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error('Lỗi parse user cookie:', err);
//       }
//     }
//   }, []);

//   // Cập nhật active menu dựa trên URL hiện tại
//   useEffect(() => {
//     const currentPath = window.location.pathname;
//     const activeItem = menuItems.find(item =>
//       item.path === currentPath ||
//       (item.dropdownItems?.some(drop => drop.path === currentPath))
//     );
//     if (activeItem) {
//       setActiveMenu(activeItem.label.toLowerCase());
//     }
//   }, []);

//   const menuItems: MenuItem[] = [
//     { label: 'HOME', path: '/client/dashboard', hasDropdown: true, dropdownItems: [
//       { label: 'Home One', path: '/client/home-1' },
//       { label: 'Home Two', path: '/client/home-2' },
//       { label: 'Home Three', path: '/client/home-3' }
//     ]},
//     { label: 'ABOUT', path: '/client/about', hasDropdown: true, dropdownItems: [
//       { label: 'About Us', path: '/client/about' },
//       { label: 'Our Team', path: '/client/team' },
//       { label: 'Our Story', path: '/client/story' }
//     ]},
//     { label: 'MENU', path: '/client/menu', hasDropdown: true, dropdownItems: [
//       { label: 'All Menu', path: '/client/menu' },
//       { label: 'Breakfast', path: '/client/menu/breakfast' },
//       { label: 'Lunch', path: '/client/menu/lunch' },
//       { label: 'Dinner', path: '/client/menu/dinner' }
//     ]},
//     { label: 'BLOG', path: '/client/blog', hasDropdown: true, dropdownItems: [
//       { label: 'Blog Grid', path: '/client/blog' },
//       { label: 'Blog List', path: '/client/blog/list' },
//       { label: 'Blog Details', path: '/client/blog/details' }
//     ]},
//     { label: 'RESERVE', path: '/client/reserve', hasDropdown: true, dropdownItems: [
//       { label: 'Make Reservation', path: '/client/reserve' },
//       { label: 'My Reservations', path: '/client/my-reservations' }
//     ]},
//     { label: 'SHOP', path: '/client/shop', hasDropdown: true, dropdownItems: [
//       { label: 'Shop Grid', path: '/client/shop' },
//       { label: 'Shop Details', path: '/client/shop/details' },
//       { label: 'Shopping Cart', path: '/client/cart' }
//     ]},
//     { label: 'CONTACT', path: '/client/contact' }
//   ];

//   const handleMenuClick = (item: MenuItem) => {
//     setActiveMenu(item.label.toLowerCase());
//     handleNavigation(item.path);
//   };

//   const handleDropdownItemClick = (path: string) => {
//     setOpenDropdown(null);
//     handleNavigation(path);
//   };

  // const handleNavigation = (path: string) => {
  //   navigate(path);
  // };

  // const handleCart = () => {
  //   handleNavigation('/client/cart');
  // };

//   const handleLogout = () => {
//     Cookies.remove('token');
//     Cookies.remove('user');
//     setUser(null);
//     setOpenDropdown(null);
//     navigate('/client/auth');
//   };

  // const handleProfileAction = (path: string) => {
  //   setOpenDropdown(null);
  //   handleNavigation(path);
  // };

//   return (
//     <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <button
//               onClick={() => handleMenuClick({ label: 'HOME', path: '/client/dashboard' })}
//               className="text-2xl font-serif font-bold text-white hover:text-amber-500 transition-colors"
//             >
//               Tastyes
//             </button>
//           </div>

//           {/* Navigation Menu */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {menuItems.map((item) => (
//               <div
//                 key={item.label}
//                 className="relative"
//                 onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
//                 onMouseLeave={() => setOpenDropdown(null)}
//               >
//                 <button
//                   onClick={() => handleMenuClick(item)}
//                   className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group py-6 ${
//                     activeMenu === item.label.toLowerCase()
//                       ? 'text-amber-500'
//                       : 'text-gray-300 hover:text-white'
//                   }`}
//                 >
//                   <span className="flex items-center gap-1">
//                     {item.label}
//                     {item.hasDropdown && (
//                       <svg
//                         className={`w-4 h-4 transition-transform ${
//                           openDropdown === item.label ? 'rotate-180' : ''
//                         }`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     )}
//                   </span>
                  
//                   {activeMenu === item.label.toLowerCase() && (
//                     <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
//                   )}
//                 </button>

//                 {/* Dropdown Menu */}
//                 {item.hasDropdown && openDropdown === item.label && item.dropdownItems && (
//                   <div className="absolute top-full left-0 pt-2 w-48">
//                     <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
//                       {item.dropdownItems.map((dropItem, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleDropdownItemClick(dropItem.path)}
//                           className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors"
//                         >
//                           {dropItem.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           {/* Right Side Actions */}
//           <div className="flex items-center gap-4">
//             {/* User Profile / Login */}
//             <div className="relative">
//               {user ? (
//                 <button
//                   onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
//                   className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   <span className="max-w-[100px] truncate">{user?.fullName}</span>
//                   <svg
//                     className={`w-4 h-4 transition-transform ${openDropdown === 'user' ? 'rotate-180' : ''}`}
//                     fill="none" stroke="currentColor" viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => navigate(standaloneRoutes.authPage)}
//                   className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   <span>Đăng nhập</span>
//                 </button>
//               )}

            //   {/* User Dropdown */}
            //   {user && openDropdown === 'user' && (
            //     <div
            //       className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
            //       onMouseEnter={() => setOpenDropdown('user')}
            //       onMouseLeave={() => setOpenDropdown(null)}
            //     >
            //       <button
            //         onClick={() => handleProfileAction('/client/profile')}
            //         className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors flex items-center gap-2"
            //       >
            //         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            //         </svg>
            //         Xem thông tin
            //       </button>
            //       <button
            //         onClick={() => handleProfileAction('/client/profile/edit')}
            //         className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-amber-500 transition-colors flex items-center gap-2"
            //       >
            //         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            //         </svg>
            //         Sửa thông tin
            //       </button>
            //       <hr className="border-gray-700" />
            //       <button
            //         onClick={handleLogout}
            //         className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-2"
            //       >
            //         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            //         </svg>
            //         Đăng xuất
            //       </button>
            //     </div>
            //   )}
            // </div>

//             {/* Reservation Button */}
//             <button
//               onClick={() => setShowBookingModal(true)}
//               className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors duration-300"
//             >
//               RESERVATION
//             </button>

//             {/* Cart Icon */}
//             <button
//               onClick={handleCart}
//               className="relative p-2 text-gray-300 hover:text-white transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                 0
//               </span>
//             </button>

//             {/* Mobile menu button */}
//             <button className="md:hidden p-2 text-gray-300 hover:text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {showBookingModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
//           onClick={() => setShowBookingModal(false)}
//         >
//           <div
//             className="bg-white rounded-lg p-8 max-w-md w-full m-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <BookingForm visible={showBookingModal} onCancel={() => setShowBookingModal(false)} />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;







import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingForm from './BookingForm/BookingForm';
import Cookies from 'js-cookie';
import { type User } from '../../service/authService';
import standaloneRoutes from '../../config/routes';

interface MenuItem {
  label: string;
  targetId?: string;
  categoryId?: number;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; targetId?: string; categoryId?: number }[];
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState<string>('home');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollCheckRef = useRef<number | null>(null);

  // === LẤY USER TỪ COOKIE ===
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
    } else {
      setUser(null);
    }
  }, []);

  // === INTERSECTION OBSERVER – CHỈ CHẠY TRÊN TRANG CHỦ ===
  useEffect(() => {
    if (location.pathname !== standaloneRoutes.client_dashboard || isUserScrolling) return;

    const sections = ['home', 'menu', 'about', 'footer'];
    const elements = sections
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrolling) return;

        let visibleSection: string | null = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleSection = entry.target.id;
          }
        });

        // Ưu tiên footer
        const footerEntry = entries.find(e => e.target.id === 'footer');
        if (footerEntry && footerEntry.isIntersecting) {
          visibleSection = 'footer';
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
  }, [isUserScrolling, activeMenu, location.pathname]);

  // === RESET ACTIVE MENU KHI CHUYỂN TRANG ===
  useEffect(() => {
    if (location.pathname !== standaloneRoutes.client_dashboard) {
      setActiveMenu('');
    } else if (window.scrollY < 100) {
      setActiveMenu('home');
    }
  }, [location.pathname]);

  // === MENU ITEMS ===
  const menuItems: MenuItem[] = [
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

  // === SCROLL TO SECTION – HOẠT ĐỘNG Ở MỌI TRANG ===
  const scrollToSection = (targetId: string, categoryId?: number) => {
    const isHomePage = location.pathname === standaloneRoutes.client_dashboard;

    if (!isHomePage) {
      // Chuyển về trang chủ trước
      navigate(standaloneRoutes.client_dashboard);

      // Đợi trang chủ load xong -> scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          setActiveMenu(targetId);
        }
      }, 150);
      return;
    }

    // Đang ở trang chủ -> scroll bình thường
    const element = document.getElementById(targetId);
    if (!element) return;

    setActiveMenu(targetId);
    setIsUserScrolling(true);
    setOpenDropdown(null);

    const headerOffset = 64;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    if (scrollCheckRef.current) cancelAnimationFrame(scrollCheckRef.current);

    let lastPos = window.pageYOffset;
    const checkScroll = () => {
      const currentPos = window.pageYOffset;
      if (Math.abs(currentPos - lastPos) < 2) {
        setIsUserScrolling(false);
      } else {
        lastPos = currentPos;
        scrollCheckRef.current = requestAnimationFrame(checkScroll);
      }
    };

    setTimeout(() => {
      scrollCheckRef.current = requestAnimationFrame(checkScroll);
    }, 300);

    // Xử lý tab menu
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

  const handleDropdownClick = (dropItem: any) => {
    scrollToSection(dropItem.targetId!, dropItem.categoryId);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleCart = () => {
    handleNavigation(standaloneRoutes.cart);
  };

  const handleProfileAction = (path: string) => {
    setOpenDropdown(null);
    handleNavigation(path);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    setOpenDropdown(null);
    navigate(standaloneRoutes.client_dashboard);
  };

  // Dọn dẹp
  useEffect(() => {
    return () => {
      if (scrollCheckRef.current) cancelAnimationFrame(scrollCheckRef.current);
    };
  }, []);

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
            {menuItems.map((item) => (
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
                    onClick={() => handleProfileAction('/client/profile/edit')} //Thêm edit sau
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
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors duration-300"
            >
              RESERVATION
            </button>

            {/* Cart */}
            <button onClick={handleCart} className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-full m-4 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Booking Form</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BookingForm visible={showBookingModal} onCancel={() => setShowBookingModal(false)} />
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

export default Header;