// import React from 'react';

// const NotFoundPage: React.FC = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//           <h1 className="text-4xl font-bold text-red-600">404 - Trang không tồn tại</h1>
//           {/* Tạm thời gắn trang admin */}
//       <p className="mt-2"><a href="/admin/dashboard" className="text-blue-500">Quay về trang chính</a></p>
//     </div>
//   );
// };

// export default NotFoundPage;

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../../client/components/Button/ButtonCustom";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  const limeSlice = 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80';
  const backgroundImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80';
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* 404 with Lime Slice */}
        <div className="flex items-center justify-center mb-8">
          <span className="text-[180px] md:text-[240px] font-bold text-[#D4A574] leading-none">
            4
          </span>
          {/* <img 
            src={limeSlice} 
            alt="Lime Slice" 
            className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] mx-4 animate-pulse"
          /> */}
          <span className="text-[180px] md:text-[240px] font-bold text-[#D4A574] leading-none">
            0
          </span>
          <span className="text-[180px] md:text-[240px] font-bold text-[#D4A574] leading-none">
            4
          </span>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-light text-white mb-4 font-serif">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Button */}
        <Link to="/client/dashboard">
          <Button 
            variant="outline" 
            size="lg"
            className="border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white transition-all duration-300 px-8 py-6 text-base"
          >
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
