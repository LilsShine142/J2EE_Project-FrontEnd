// import React, { useState, useEffect } from 'react';

// const Header: React.FC = () => {
//   return (
//     <header className="bg-gray-800 text-white p-4 shadow-md border-b border-gray-200">
//       <div className="container mx-auto flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Header Client</h1>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, message } from 'antd';
import { UserOutlined, CalendarOutlined, CloseOutlined } from '@ant-design/icons';
import BookingForm from '../components/BookingForm/BookingForm'; 
import type { BookingFormData } from '../../types/index';
import standaloneRoutes from '../../config/routes';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookingSuccess = (data: BookingFormData) => {
    message.success({
      content: `Đặt bàn thành công cho ${data.name}! Chúng tôi sẽ liên hệ xác nhận.`,
      duration: 3,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <CalendarOutlined className="text-2xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                Feliciano Restaurant
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Nút Đăng nhập - Class riêng */}
              <Button
                size="large"
                className="booking-login-btn flex items-center space-x-2 h-12 px-6 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl transition-all duration-300"
                onClick={() => navigate(standaloneRoutes.authPage)}
              >
                <UserOutlined />
                <span>Đăng nhập</span>
              </Button>

              {/* Nút Đặt bàn ngay - Class riêng */}
              <Button
                size="large"
                className="booking-book-btn flex items-center space-x-2 h-12 px-7 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                <CalendarOutlined />
                <span>Đặt bàn ngay</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Gọi BookingForm Modal */}
      <BookingForm
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
};

export default Header;