import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

interface AuthFormProps {
  isLogin: boolean;
  onFinish: (values: any) => void;
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onFinish, activeTab, setActiveTab }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onFinish(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={
          isLogin
            ? { email: '', password: '' }
            : { fullName: '', email: '', phone: '', password: '', confirmPassword: '' }
        }
        autoComplete="off"
        className="space-y-4"
      >
        {/* === ĐĂNG KÝ === */}
        {!isLogin && (
          <>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải 10-11 chữ số!' },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0123456789" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" className="rounded-lg" />
            </Form.Item>
          </>
        )}

        {/* === ĐĂNG NHẬP === */}
        {isLogin && (
          <>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" className="rounded-lg" />
            </Form.Item>
          </>
        )}

        {/* === NÚT SUBMIT === */}
        <Form.Item className="mb-2">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
          </Button>
        </Form.Item>

        {/* === PHÂN CÁCH === */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">Hoặc</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* === ĐĂNG NHẬP XÃ HỘI === */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium rounded-lg shadow-sm"
          >
            Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            size="large"
            onClick={() => handleSocialLogin('facebook')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium rounded-lg shadow-sm"
          >
            Facebook
          </Button>
        </div>

        {/* === XÓA LIÊN KẾT CHUYỂN TAB Ở ĐÂY === */}
      </Form>
    </div>
  );
};

export default AuthForm;