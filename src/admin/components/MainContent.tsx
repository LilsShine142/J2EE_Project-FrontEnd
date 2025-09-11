import React, { type ReactNode } from 'react';

interface MainContentProps {
  children?: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-900">
      {/* Content Area */}
      <div className="p-6">
        {React.Children.count(children) === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold mb-2">Chào mừng đến với Admin Page</h3>
            <p className="text-gray-400">Dữ liệu sẽ render tại đây</p>
          </div>
        ) : (
          children
        )}

      </div>
    </div>
  );
};

export default MainContent;