import React, { useState } from 'react';
import { Card, Tabs, Typography, message } from 'antd';
import AuthForm from '../components/AuthForm/AuthForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');

  // Handle Login
  const handleLogin = (values: { email: string; password: string }) => {
    console.log('Login data:', values);
    message.success('Đăng nhập thành công!', 2);
  };

  // Handle Register
  const handleRegister = (values: { name: string; email: string; password: string; confirmPassword: string; phone: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp!', 2);
      return;
    }
    console.log('Register data:', values);
    message.success('Đăng ký thành công!', 2);
    setActiveTab('login');
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Đăng nhập',
      children: <AuthForm isLogin={true} onFinish={handleLogin} />,
    },
    {
      key: 'register',
      label: 'Đăng ký',
      children: <AuthForm isLogin={false} onFinish={handleRegister} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            centered
            size="large"
          />
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;