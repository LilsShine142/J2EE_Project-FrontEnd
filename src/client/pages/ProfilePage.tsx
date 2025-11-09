import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Spin, message } from 'antd';
import { useCurrentUser, useUserById } from '../../hooks/useUserHooks';

// === Component: Form Section ===
const ProfileForm: React.FC<{
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}> = React.memo(({ formData, onChange, onSubmit }) => {
  return (
    <div className="flex-1 space-y-6">
      {/* Tên đăng nhập (chỉ đọc) */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Tên đăng nhập</label>
        <span className="text-gray-900 font-medium">{formData.username || 'Chưa có'}</span>
      </div>

      {/* Tên đầy đủ */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Tên</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Nhập tên"
        />
      </div>

      {/* Email */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Email</label>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-gray-900">{formData.email}</span>
          <button className="text-sm text-blue-600 hover:underline font-medium">Thay đổi</button>
        </div>
      </div>

      {/* Số điện thoại */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Số điện thoại</label>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-gray-900">{formData.phone || 'Chưa có'}</span>
          <button className="text-sm text-blue-600 hover:underline font-medium">Thay đổi</button>
        </div>
      </div>

      {/* Giới tính */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Giới tính</label>
        <div className="flex-1 flex gap-6">
          {['male', 'female', 'other'].map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={value}
                checked={formData.gender === value}
                onChange={onChange}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-gray-700 capitalize">
                {value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : 'Khác'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ngày sinh */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Ngày sinh</label>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-gray-900">{formData.birthdate || 'Chưa có'}</span>
          <button className="text-sm text-blue-600 hover:underline font-medium">Thay đổi</button>
        </div>
      </div>

      {/* Nút Lưu */}
      <div className="flex justify-end pl-32">
        <button
          onClick={onSubmit}
          className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm transition-all duration-200 transform hover:scale-105"
        >
          Lưu
        </button>
      </div>
    </div>
  );
});

// === Component: Avatar Section ===
const AvatarSection: React.FC<{ avatarUrl?: string }> = React.memo(({ avatarUrl }) => {
  return (
    <div className="w-64 flex flex-col items-center border-l pl-8">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-gray-100">
        <img
          src={avatarUrl || 'https://via.placeholder.com/128'}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <label className="cursor-pointer">
        <input type="file" accept="image/*" className="hidden" />
        <span className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          Chọn Ảnh
        </span>
      </label>
      <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
        <p>Dung lượng file tối đa 1 MB</p>
        <p>Định dạng: .JPEG, .PNG</p>
      </div>
    </div>
  );
});

// === Main Component ===
const ProfilePage: React.FC = () => {
  // const { data: user, isLoading, isError } = useCurrentUser();
  const { data: currentUser } = useCurrentUser();
  console.log('Current user in ProfilePage:', currentUser);
  const userId = currentUser?.userId;
  console.log('Fetching profile for user ID:', userId);
  const { data: user, isLoading, isError } = useUserById(userId);

  // === Form state ===
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    gender: 'male' as 'male' | 'female' | 'other',
    birthdate: '',
  });
  console.log('user data in ProfilePage:', user?.data);
  // === CẬP NHẬT FORM KHI USER CÓ DỮ LIỆU ===
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.data.username || '',
        name: user.data.fullName || '',
        email: user.data.email || '',
        phone: user.data.phoneNumber || '',
        gender: 'male',
        birthdate: user.data.joinDate ? new Date(user.data.joinDate).toLocaleDateString('vi-VN') : '',
      });
    }
  }, [user]);

  // === Handlers ===
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('Cập nhật profile:', formData);
    message.success('Cập nhật thông tin thành công!');
    // TODO: Gọi API cập nhật ở đây
  }, [formData]);

  const formFields = useMemo(() => ({
    username: formData.username,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    gender: formData.gender,
    birthdate: formData.birthdate,
  }), [formData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải hồ sơ..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center text-red-500 p-8">
        Không thể tải thông tin. Vui lòng đăng nhập lại.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <header className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </header>

      <div className="flex gap-8">
        <ProfileForm
          formData={formFields}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        {/* <AvatarSection avatarUrl={user.avatarUrl} /> */}
      </div>
    </section>
  );
};

export default ProfilePage;