// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { User, Mail, Phone, Save, X, Eye, EyeOff, Camera } from 'lucide-react';

// interface UserData {
//   userId?: number;
//   roleId?: number;
//   username?: string;
//   email?: string;
//   fullName?: string;
//   phoneNumber?: string;
//   statusId?: number;
//   statusWork?: string;
//   joinDate?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // === Component: Avatar Section ===
// const AvatarSection: React.FC<{ avatarUrl?: string }> = React.memo(({ avatarUrl }) => {
//   return (
//     <div className="w-64 flex flex-col items-center border-l border-gray-200 pl-8">
//       <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-orange-100 relative group">
//         <img
//           src={avatarUrl || 'https://via.placeholder.com/128'}
//           alt="Avatar"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//           <Camera className="text-white" size={32} />
//         </div>
//       </div>
//       <label className="cursor-pointer">
//         <input type="file" accept="image/*" className="hidden" />
//         <span className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors inline-block">
//           Chọn Ảnh
//         </span>
//       </label>
//       <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
//         <p>Dung lượng file tối đa 1 MB</p>
//         <p>Định dạng: .JPEG, .PNG</p>
//       </div>
//     </div>
//   );
// });

// // === Component: Profile Form ===
// const ProfileForm: React.FC<{
//   formData: any;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: () => void;
//   hasChanges: boolean;
//   onCancel: () => void;
//   loading: boolean;
//   showPassword: boolean;
//   onTogglePassword: () => void;
//   errors: any;
// }> = React.memo(({ formData, onChange, onSubmit, hasChanges, onCancel, loading, showPassword, onTogglePassword, errors }) => {
//   return (
//     <div className="flex-1 space-y-6">
//       {/* Tên đăng nhập (chỉ đọc) */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Tên đăng nhập</label>
//         <span className="text-gray-900 font-medium">{formData.username || 'Chưa có'}</span>
//       </div>

//       {/* Tên đầy đủ */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Tên đầy đủ</label>
//         <div className="flex-1">
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={onChange}
//             className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
//               errors.fullName ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Nhập tên đầy đủ"
//           />
//           {errors.fullName && (
//             <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
//           )}
//         </div>
//       </div>

//       {/* Email */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Email</label>
//         <div className="flex-1">
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={onChange}
//             className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
//               errors.email ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Nhập email"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//           )}
//         </div>
//       </div>

//       {/* Số điện thoại */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Số điện thoại</label>
//         <div className="flex-1">
//           <input
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={onChange}
//             className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
//               errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Nhập số điện thoại"
//           />
//           {errors.phoneNumber && (
//             <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
//           )}
//         </div>
//       </div>

//       {/* Mật khẩu mới */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Mật khẩu mới</label>
//         <div className="flex-1">
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={onChange}
//               className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
//                 errors.password ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Để trống nếu không đổi"
//             />
//             <button
//               type="button"
//               onClick={onTogglePassword}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//           )}
//           <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
//         </div>
//       </div>

//       {/* Trạng thái làm việc */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Trạng thái</label>
//         <span className="text-gray-900">{formData.statusWork || 'Chưa có'}</span>
//       </div>

//       {/* Ngày tham gia */}
//       <div className="flex items-center">
//         <label className="w-32 text-sm text-gray-600 font-medium">Ngày tham gia</label>
//         <span className="text-gray-900">{formData.joinDate || 'Chưa có'}</span>
//       </div>

//       {/* Nút Lưu/Hủy */}
//       {hasChanges && (
//         <div className="flex justify-end pl-32 gap-3">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Hủy
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={loading}
//             className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//           >
//             {loading ? 'Đang lưu...' : 'Lưu'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// });

// // === Main Component ===
// const Profile: React.FC = () => {
//   // Mock user data - thay bằng useCurrentUser() trong dự án thật
//   const [user] = useState<UserData>({
//     userId: 1,
//     username: 'user123',
//     email: 'user@example.com',
//     fullName: 'Nguyễn Văn A',
//     phoneNumber: '0123456789',
//     statusWork: 'Đang làm việc',
//     joinDate: '2024-01-15',
//   });

//   const isLoading = false;
//   const isError = false;

//   // === Form state ===
//   const [formData, setFormData] = useState({
//     username: '',
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     statusWork: '',
//     joinDate: '',
//   });

//   const [initialValues, setInitialValues] = useState({
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//   });

//   const [hasChanges, setHasChanges] = useState(false);
//   const [errors, setErrors] = useState<any>({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   // === CẬP NHẬT FORM KHI USER CÓ DỮ LIỆU ===
//   useEffect(() => {
//     if (user) {
//       const values = {
//         username: user.username || '',
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phoneNumber: user.phoneNumber || '',
//         password: '',
//         statusWork: user.statusWork || '',
//         joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : '',
//       };
//       setFormData(values);
//       setInitialValues({
//         fullName: values.fullName,
//         email: values.email,
//         phoneNumber: values.phoneNumber,
//       });
//     }
//   }, [user]);

//   // === Validation ===
//   const validate = useCallback(() => {
//     const newErrors: any = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = 'Vui lòng nhập tên đầy đủ!';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Vui lòng nhập email!';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Email không hợp lệ!';
//     }

//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = 'Vui lòng nhập số điện thoại!';
//     }

//     if (formData.password && formData.password.length < 6) {
//       newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự!';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   // === Handlers ===
//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
    
//     // Clear error for this field
//     setErrors((prev: any) => ({ ...prev, [name]: '' }));
    
//     // Check if there are changes
//     const changed =
//       (name === 'fullName' && value !== initialValues.fullName) ||
//       (name === 'email' && value !== initialValues.email) ||
//       (name === 'phoneNumber' && value !== initialValues.phoneNumber) ||
//       (name === 'password' && value.length > 0) ||
//       (name !== 'fullName' && formData.fullName !== initialValues.fullName) ||
//       (name !== 'email' && formData.email !== initialValues.email) ||
//       (name !== 'phoneNumber' && formData.phoneNumber !== initialValues.phoneNumber) ||
//       (name !== 'password' && formData.password.length > 0);
    
//     setHasChanges(changed);
//     setSuccessMessage('');
//   }, [formData, initialValues]);

//   const handleSubmit = useCallback(() => {
//     if (!validate()) return;

//     setLoading(true);
    
//     // Simulate API call - thay bằng updateUserMutation.mutate() trong dự án thật
//     setTimeout(() => {
//       setSuccessMessage('Cập nhật thông tin thành công!');
//       setHasChanges(false);
      
//       const newValues = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//       };
//       setInitialValues(newValues);
//       setFormData(prev => ({ ...prev, password: '' }));
//       setLoading(false);

//       setTimeout(() => setSuccessMessage(''), 3000);
//     }, 1000);
//   }, [formData, validate]);

//   const handleCancel = useCallback(() => {
//     setFormData(prev => ({
//       ...prev,
//       fullName: initialValues.fullName,
//       email: initialValues.email,
//       phoneNumber: initialValues.phoneNumber,
//       password: '',
//     }));
//     setHasChanges(false);
//     setErrors({});
//     setSuccessMessage('');
//   }, [initialValues]);

//   const handleTogglePassword = useCallback(() => {
//     setShowPassword(prev => !prev);
//   }, []);

//   const formFields = useMemo(() => ({
//     username: formData.username,
//     fullName: formData.fullName,
//     email: formData.email,
//     phoneNumber: formData.phoneNumber,
//     password: formData.password,
//     statusWork: formData.statusWork,
//     joinDate: formData.joinDate,
//   }), [formData]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <span className="ml-3 text-gray-600">Đang tải hồ sơ...</span>
//       </div>
//     );
//   }

//   if (isError || !user) {
//     return (
//       <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
//         Không thể tải thông tin. Vui lòng đăng nhập lại.
//       </div>
//     );
//   }

//   return (
//     <section className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
//       <header className="border-b border-gray-200 pb-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Của Tôi</h1>
//         <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
//       </header>

//       {successMessage && (
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           {successMessage}
//         </div>
//       )}

//       <div className="flex gap-8">
//         <ProfileForm
//           formData={formFields}
//           onChange={handleInputChange}
//           onSubmit={handleSubmit}
//           hasChanges={hasChanges}
//           onCancel={handleCancel}
//           loading={loading}
//           showPassword={showPassword}
//           onTogglePassword={handleTogglePassword}
//           errors={errors}
//         />
//         <AvatarSection avatarUrl="https://via.placeholder.com/128" />
//       </div>
//     </section>
//   );
// };

// export default Profile;






import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, Mail, Phone, Save, X, Eye, EyeOff, Camera } from 'lucide-react';
import { useCurrentUser, useUpdateUser } from '../../../../hooks/useUserHooks';
import Cookies from 'js-cookie';

interface UserData {
  userId?: number;
  roleId?: number;
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  statusId?: number;
  statusWork?: string;
  joinDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// === Component: Avatar Section ===
const AvatarSection: React.FC<{ avatarUrl?: string }> = React.memo(({ avatarUrl }) => {
  return (
    <div className="w-64 flex flex-col items-center border-l border-gray-200 pl-8">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-orange-100 relative group">
        <img
          src={avatarUrl || 'https://via.placeholder.com/128'}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="text-white" size={32} />
        </div>
      </div>
      <label className="cursor-pointer">
        <input type="file" accept="image/*" className="hidden" />
        <span className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors inline-block">
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

// === Component: Profile Form ===
const ProfileForm: React.FC<{
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  hasChanges: boolean;
  onCancel: () => void;
  loading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  errors: any;
}> = React.memo(({ formData, onChange, onSubmit, hasChanges, onCancel, loading, showPassword, onTogglePassword, errors }) => {
  return (
    <div className="flex-1 space-y-6">
      {/* Tên đăng nhập (chỉ đọc) */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Tên đăng nhập</label>
        <span className="text-gray-900 font-medium">{formData.username || 'Chưa có'}</span>
      </div>

      {/* Tên đầy đủ */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Tên đầy đủ</label>
        <div className="flex-1">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập tên đầy đủ"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Email</label>
        <div className="flex-1">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Số điện thoại */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Số điện thoại</label>
        <div className="flex-1">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập số điện thoại"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Mật khẩu mới */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Mật khẩu mới</label>
        <div className="flex-1">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onChange}
              className={`w-full px-4 py-2 pr-10 border rounded-md text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Để trống nếu không đổi"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
        </div>
      </div>

      {/* Trạng thái làm việc */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Trạng thái</label>
        <span className="text-gray-900">{formData.statusWork || 'Chưa có'}</span>
      </div>

      {/* Ngày tham gia */}
      <div className="flex items-center">
        <label className="w-32 text-sm text-gray-600 font-medium">Ngày tham gia</label>
        <span className="text-gray-900">{formData.joinDate || 'Chưa có'}</span>
      </div>

      {/* Nút Lưu/Hủy */}
      {hasChanges && (
        <div className="flex justify-end pl-32 gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      )}
    </div>
  );
});

// === Main Component ===
const Profile: React.FC = () => {
  const { data: user, isLoading, refetch } = useCurrentUser();
  const updateUserMutation = useUpdateUser(Cookies.get('authToken') || '');

  const isError = false; // Có thể thêm error từ hook

  // === Form state ===
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    statusWork: '',
    joinDate: '',
  });
  console.log('Current User:', user);
  const [initialValues, setInitialValues] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // === CẬP NHẬT FORM KHI USER CÓ DỮ LIỆU ===
  useEffect(() => {
      if (user) {
        console.log('User data in useEffect:', user);
      const values = {
        username: user.username || '',
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        password: '',
        statusWork: user.statusWork || '',
        joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : '',
      };
      setFormData(values);
      setInitialValues({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      });
    }
  }, [user]);

  // === Validation ===
  const validate = useCallback(() => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập tên đầy đủ!';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ!';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại!';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // === Handlers ===
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    setErrors((prev: any) => ({ ...prev, [name]: '' }));
    
    // Check if there are changes
    const changed = 
      (name === 'fullName' && value !== initialValues.fullName) ||
      (name === 'email' && value !== initialValues.email) ||
      (name === 'phoneNumber' && value !== initialValues.phoneNumber) ||
      (name === 'password' && value.length > 0) ||
      (name !== 'fullName' && formData.fullName !== initialValues.fullName) ||
      (name !== 'email' && formData.email !== initialValues.email) ||
      (name !== 'phoneNumber' && formData.phoneNumber !== initialValues.phoneNumber) ||
      (name !== 'password' && formData.password.length > 0);
    
    setHasChanges(changed);
    setSuccessMessage('');
  }, [formData, initialValues]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    if (!user?.userId) {
      setErrors({ general: 'Không tìm thấy ID người dùng' });
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: user.userId,
        userData: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          ...(formData.password && { password: formData.password }),
        },
      });
      setSuccessMessage('Cập nhật thông tin thành công!');
      setHasChanges(false);
      
      const newValues = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      };
      setInitialValues(newValues);
      setFormData(prev => ({ ...prev, password: '' }));
      refetch();
    } catch (error) {
      setErrors({ general: 'Cập nhật thất bại. Vui lòng thử lại.' });
    }
  }, [formData, validate, user, updateUserMutation, refetch]);

  const handleCancel = useCallback(() => {
    setFormData(prev => ({ 
      ...prev,
      fullName: initialValues.fullName,
      email: initialValues.email,
      phoneNumber: initialValues.phoneNumber,
      password: '',
    }));
    setHasChanges(false);
    setErrors({});
    setSuccessMessage('');
  }, [initialValues]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const formFields = useMemo(() => ({
    username: formData.username,
    fullName: formData.fullName,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    password: formData.password,
    statusWork: formData.statusWork,
    joinDate: formData.joinDate,
  }), [formData]);
  console.log('Form Fields:', formFields);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Đang tải hồ sơ...</span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
        Không thể tải thông tin. Vui lòng đăng nhập lại.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
      <header className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </header>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="flex gap-8">
        <ProfileForm
          formData={formFields}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          hasChanges={hasChanges}
          onCancel={handleCancel}
          loading={updateUserMutation.isPending}
          showPassword={showPassword}
          onTogglePassword={handleTogglePassword}
          errors={errors}
        />
        <AvatarSection avatarUrl="https://via.placeholder.com/128" />
      </div>
    </section>
  );
};

export default Profile;