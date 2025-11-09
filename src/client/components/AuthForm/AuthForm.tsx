import React, { useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isLogin: boolean;
  onFinish: (values: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onFinish }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    // redirect đến endpoint khởi tạo OAuth2
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="relative p-6 max-w-md mx-auto">
        <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={isLogin ? { email: '', password: '' } : { name: '', email: '', phone: '', password: '', confirmPassword: '' }}
        autoComplete="off"
      >
        {!isLogin && (
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
              size="large"
              className="w-full"
            />
          </Form.Item>
        )}

        {!isLogin && (
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="0123456789"
              size="large"
              className="w-full"
            />
          </Form.Item>
        )}

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="example@email.com"
            size="large"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            size="large"
            className="w-full"
          />
        </Form.Item>

        {!isLogin && (
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
              className="w-full"
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </Form.Item>

        <div className="text-center my-4 text-gray-500">
          Hoặc {isLogin ? 'đăng nhập' : 'đăng ký'} với
        </div>

        <div className="flex gap-3">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
            onClick={() => handleSocialLogin('google')}
          >
            Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            size="large"
            className="flex-1 bg-blue-800 hover:bg-blue-900 text-white border-0"
            onClick={() => handleSocialLogin('facebook')}
          >
            Facebook
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AuthForm;