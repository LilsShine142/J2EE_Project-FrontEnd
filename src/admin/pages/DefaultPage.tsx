import React from 'react';

const DefaultPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Chào mừng đến với Spotify Admin</h1>
        <p className="text-gray-300 mb-6">
          Quản lý toàn bộ hệ thống âm nhạc của bạn từ một nơi duy nhất. 
          Bảng điều khiển này cung cấp cho bạn quyền kiểm soát hoàn toàn đối với nội dung, người dùng và phân tích.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-green-400 text-2xl mb-2">
              <i className="fas fa-music"></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quản lý bài hát</h3>
            <p className="text-gray-400 text-sm">
              Thêm, chỉnh sửa và quản lý thư viện bài hát của bạn
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-blue-400 text-2xl mb-2">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quản lý người dùng</h3>
            <p className="text-gray-400 text-sm">
              Theo dõi và quản lý người dùng và đăng ký của họ
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-yellow-400 text-2xl mb-2">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Phân tích</h3>
            <p className="text-gray-400 text-sm">
              Xem thống kê và xu hướng nghe nhạc của người dùng
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-2 mr-3">
                  <i className="fas fa-plus text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Bài hát mới được thêm</p>
                  <p className="text-gray-400 text-xs">"Bài hát của mùa hè" - JustaTee</p>
                </div>
              </div>
              <span className="text-gray-400 text-xs">2 giờ trước</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Người dùng mới</p>
                  <p className="text-gray-400 text-xs">nguyenvanA đã đăng ký</p>
                </div>
              </div>
              <span className="text-gray-400 text-xs">5 giờ trước</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <div className="bg-yellow-500 rounded-full p-2 mr-3">
                  <i className="fas fa-arrow-up text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Lượt nghe tăng đột biến</p>
                  <p className="text-gray-400 text-xs">"Phố đã lên đèn" tăng 205%</p>
                </div>
              </div>
              <span className="text-gray-400 text-xs">1 ngày trước</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Thống kê nhanh</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <i className="fas fa-music text-green-400 mr-3"></i>
                <span className="text-white">Tổng số bài hát</span>
              </div>
              <span className="text-green-400 font-bold">12,587</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <i className="fas fa-users text-blue-400 mr-3"></i>
                <span className="text-white">Người dùng hoạt động</span>
              </div>
              <span className="text-blue-400 font-bold">24,841</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <i className="fas fa-heart text-red-400 mr-3"></i>
                <span className="text-white">Lượt thích hôm nay</span>
              </div>
              <span className="text-red-400 font-bold">8,742</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <i className="fas fa-play-circle text-purple-400 mr-3"></i>
                <span className="text-white">Lượt phát hôm nay</span>
              </div>
              <span className="text-purple-400 font-bold">152,639</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;