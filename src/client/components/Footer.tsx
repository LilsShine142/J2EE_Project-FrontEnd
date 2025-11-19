import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const facilities = [
    { col1: 'Indian Menu', col2: 'Popular Item' },
    { col1: 'Menu Item', col2: 'Regular Menu' },
    { col1: 'Private Event', col2: 'New Food' },
    { col1: 'Italian Menu', col2: 'Special Offer' },
    { col1: 'Best Offer', col2: '' }
  ];

  return (
    <footer className="relative h-[40vh] bg-gray-900 text-white overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://res.cloudinary.com/ddlso6ofq/image/upload/v1762694400/footer_k0rzlb.avif"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full h-full py-8 px-8 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Left Section - Our Facilities */}
          <div className="text-center md:text-left">
            <h3 className="text-sm md:text-base font-serif font-bold text-white mb-1 md:mb-2">Our Facilities</h3>
            <div className="space-y-1.5">
              {facilities.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-12">
                  <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors duration-300 text-xs">
                    {item.col1}
                  </a>
                  {item.col2 && (
                    <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors duration-300 text-xs">
                      {item.col2}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center Section - Logo and Social Media */}
          <div className="flex flex-col items-center justify-center ml-[98px] mr-[98px]">
            {/* Logo Circle */}
            <div className="relative mb-2">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-amber-600 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <svg width="18" height="18" viewBox="0 0 30 30" fill="none" className="text-amber-600">
                    <path d="M15 5L17 13H25L19 18L21 26L15 21L9 26L11 18L5 13H13L15 5Z" fill="currentColor"/>
                  </svg>
                  <h2 className="text-lg md:text-2xl font-serif font-bold text-amber-600">Restho</h2>
                </div>
                <p className="text-gray-400 text-sm tracking-wider">Est. 2022</p>
                <div className="w-12 h-px bg-amber-600 my-1"></div>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-amber-600">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-1">
              <a 
                href="#" 
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300"
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Section - Address Info */}
          <div className="text-center md:text-left self-start">
            <h3 className="text-sm md:text-base font-serif font-bold text-white mb-1 md:mb-2">Address Info</h3>
            <div>
              <div className="leading-none">
                <span className="text-gray-400 text-[10px]">Phone: </span>
                <span className="text-amber-500 hover:text-amber-400 transition-colors text-xs">
                  <a href="tel:+880-1776-766-767">+880.1776.766.767</a>
                </span>
              </div>
              <div className="leading-none">
                <span className="text-gray-400 text-[10px]">Email: </span>
                <span className="text-amber-500 hover:text-amber-400 transition-colors text-xs">
                  <a href="mailto:info@example.com">info@example.com</a>
                </span>
              </div>
              <div className="leading-none">
                <span className="text-gray-400 text-[10px]">Fax ID: </span>
                <span className="text-white text-xs">+99-756-67-786</span>
              </div>
              <div className="leading-tight">
                <span className="text-gray-400 text-[10px]">Location: </span>
                <span className="text-white text-xs">
                  Mirpur DOHS, House-167/170,<br />
                  Road-02, Avenue-01.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-2 mt-2 absolute bottom-2 left-0 right-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1">
            <p className="text-gray-400 text-[10px] text-center md:text-left">
              ©Copyright by Eganelde-{currentYear}. All Right Reserved.
            </p>
            <div className="flex gap-2 items-center">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors text-[10px]">
                Privacy & Policy
              </a>
              <span className="text-gray-600 hidden md:inline text-[10px]">|</span>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors text-[10px]">
                Terms and Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;