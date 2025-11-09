import React, { useState } from 'react';
import { Card, Tabs, Typography, Spin, ConfigProvider, message } from 'antd';
import AuthForm from '../components/AuthForm/AuthForm';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
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

    register(
      {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      },
      {
        onSuccess: () => {
          setActiveTab('login'); // TỰ ĐỘNG CHUYỂN TAB
        },
      }
    );
  };

  const loading = activeTab === 'login' ? isLoginLoading : isRegisterLoading;
  const hasError = activeTab === 'login' ? isLoginError : isRegisterError;

  const tabItems = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: (
        <div className="relative">
          <Spin spinning={loading} tip="Đang xác thực..." size="large">
            <div className="p-1">
              <AuthForm isLogin={true} onFinish={handleLogin} />
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
              <AuthForm isLogin={false} onFinish={handleRegister} />
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
          colorPrimary: '#1890ff',
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
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
              <Title level={3} className="text-blue-600 font-bold tracking-wide">
                Nhà Hàng J2EE
              </Title>
              <p className="text-gray-500 text-sm">Quản lý đặt bàn & gọi món</p>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(key) => !loading && setActiveTab(key as 'login' | 'register')}
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