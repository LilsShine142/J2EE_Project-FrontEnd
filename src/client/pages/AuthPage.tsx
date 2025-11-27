// import React, { useState, useEffect } from 'react';
// import { Card, Tabs, Typography, Spin, ConfigProvider, message } from 'antd';
// import AuthForm from '../components/AuthForm/AuthForm';
// import { useAuth } from '../../hooks/useAuth';
// import { useSearchParams } from 'react-router-dom';

// const { Title } = Typography;

// const AuthPage: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const urlTab = searchParams.get('tab');

//   // Đồng bộ tab từ URL
//   const [activeTab, setActiveTab] = useState<'login' | 'register'>(
//     urlTab === 'register' ? 'register' : 'login'
//   );

//   // Cập nhật URL khi đổi tab
//   useEffect(() => {
//     if (activeTab === 'register') {
//       setSearchParams({ tab: 'register' });
//     } else {
//       setSearchParams({ tab: 'login' });
//     }
//   }, [activeTab, setSearchParams]);

//   const {
//     login,
//     register,
//     isLoginLoading,
//     isRegisterLoading,
//     isLoginError,
//     isRegisterError,
//   } = useAuth();

//   const handleLogin = (values: { email: string; password: string }) => {
//     login(values);
//   };

//   const handleRegister = (values: {
//     fullName: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     phone: string;
//   }) => {
//     if (values.password !== values.confirmPassword) {
//       message.error('Mật khẩu không khớp!', 2);
//       return;
//     }

//     register(
//       {
//         fullName: values.fullName,
//         email: values.email,
//         password: values.password,
//         phoneNumber: values.phone,
//         statusId: 1,
//         statusWork: 'Customer',
//         roleId: 1,
//       },
//       {
//         onSuccess: () => {
//           message.success('Đăng ký thành công! Vui lòng đăng nhập.', 2);
//           setActiveTab('login');
//           setSearchParams({ tab: 'login' });
//         },
//       }
//     );
//   };

//   const loading = activeTab === 'login' ? isLoginLoading : isRegisterLoading;

//   const tabItems = [
//     {
//       key: 'login',
//       label: 'Đăng nhập',
//       children: (
//         <div className="relative">
//           <Spin spinning={loading} tip="Đang xác thực..." size="large">
//             <div className="p-1">
//               <AuthForm isLogin={true} onFinish={handleLogin} activeTab={activeTab} setActiveTab={setActiveTab} />
//             </div>
//           </Spin>
//         </div>
//       ),
//     },
//     {
//       key: 'register',
//       label: 'Đăng ký',
//       children: (
//         <div className="relative">
//           <Spin spinning={loading} tip="Đang tạo tài khoản..." size="large">
//             <div className="p-1">
//               <AuthForm isLogin={false} onFinish={handleRegister} activeTab={activeTab} setActiveTab={setActiveTab} />
//             </div>
//           </Spin>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: '#f59e0b',
//           borderRadius: 12,
//         },
//       }}
//     >
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4 flex items-center justify-center">
//         <div className="max-w-md w-full">
//           <Card
//             className="shadow-2xl border-0 overflow-hidden"
//             style={{
//               borderRadius: 16,
//               backdropFilter: 'blur(10px)',
//               background: 'rgba(255, 255, 255, 0.95)',
//             }}
//           >
//             <div className="text-center mb-6 pt-6">
//               <Title level={3} className="text-amber-600 font-bold tracking-wide">
//                 Nhà Hàng J2EE
//               </Title>
//               <p className="text-gray-500 text-sm">Quản lý đặt bàn & gọi món</p>
//             </div>

//             <Tabs
//               activeKey={activeTab}
//               onChange={(key) => setActiveTab(key as 'login' | 'register')}
//               items={tabItems}
//               centered
//               size="large"
//               tabBarGutter={32}
//               className="px-2"
//               animated={{ inkBar: true, tabPane: true }}
//             />
//           </Card>

//           <div className="text-center mt-6 text-xs text-gray-400">
//             © 2025 J2EE Restaurant. All rights reserved.
//           </div>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default AuthPage;





import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Spin, ConfigProvider, message } from 'antd';
import AuthForm from '../components/AuthForm/AuthForm';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

const { Title } = Typography;

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  // Đồng bộ tab từ URL
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    urlTab === 'register' ? 'register' : 'login'
  );

  // Cập nhật URL khi đổi tab
  useEffect(() => {
    if (activeTab === 'register') {
      setSearchParams({ tab: 'register' });
    } else {
      setSearchParams({ tab: 'login' });
    }
  }, [activeTab, setSearchParams]);

  const {
    login,
    register,
    isLoginLoading,
    isRegisterLoading,
    isLoginError,
    isRegisterError,
  } = useAuth();

  const handleLogin = (values: { email: string; password: string }) => {
    login(values);
  };

  const handleRegister = (values: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp!', 2);
      return;
    }

    register({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phone,
      statusId: 1,
      statusWork: 'Customer',
      roleId: 1,
    });
  };

  const loading = activeTab === 'login' ? isLoginLoading : isRegisterLoading;

  const tabItems = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: (
        <div className="relative">
          <Spin spinning={loading} tip="Đang xác thực..." size="large">
            <div className="p-1">
              <AuthForm
                isLogin={true}
                onFinish={handleLogin}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </Spin>
        </div>
      ),
    },
    {
      key: 'register',
      label: 'Đăng ký',
      children: (
        <div className="relative">
          <Spin spinning={loading} tip="Đang tạo tài khoản..." size="large">
            <div className="p-1">
              <AuthForm
                isLogin={false}
                onFinish={handleRegister}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </Spin>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f59e0b',
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card
            className="shadow-2xl border-0 overflow-hidden"
            style={{
              borderRadius: 16,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <div className="text-center mb-6 pt-6">
              <Title level={3} className="text-amber-600 font-bold tracking-wide">
                Nhà Hàng J2EE
              </Title>
              <p className="text-gray-500 text-sm">Quản lý đặt bàn & gọi món</p>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as 'login' | 'register')}
              items={tabItems}
              centered
              size="large"
              tabBarGutter={32}
              className="px-2"
              animated={{ inkBar: true, tabPane: true }}
            />
          </Card>

          <div className="text-center mt-6 text-xs text-gray-400">
            © 2025 J2EE Restaurant. All rights reserved.
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AuthPage;