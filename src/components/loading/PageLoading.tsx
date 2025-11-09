// ==========================================
// FILE 3: src/components/Loading/PageLoading.tsx
// ==========================================
import React from 'react';

export const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-600">Đang tải trang...</p>
    </div>
  </div>
);