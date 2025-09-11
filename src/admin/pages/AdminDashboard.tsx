import React, { useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import config from '../../config';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const location = useLocation(); // Lấy route hiện tại

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-1 ">
        <Header  />
        {/* Nếu là route chính (/admin), render MainContent không có Outlet */}
        {location.pathname === config.routes.admin_dashboard ? (
          <MainContent />
        ) : (
          <div className="flex-1 overflow-y-auto bg-gray-900">
            <Outlet /> {/* Render Outlet trực tiếp cho route con */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;