// ==========================================
// FILE 2: src/components/Loading/GlobalLoading.tsx
// ==========================================
import React from 'react';

export const GlobalLoading: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Đang tải...</p>
    </div>
  </div>
);