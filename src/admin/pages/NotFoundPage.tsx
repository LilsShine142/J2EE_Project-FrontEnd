import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h1 className="text-4xl font-bold text-red-600">404 - Trang không tồn tại</h1>
          {/* Tạm thời gắn trang admin */}
      <p className="mt-2"><a href="/admin/dashboard" className="text-blue-500">Quay về trang chính</a></p>
    </div>
  );
};

export default NotFoundPage;