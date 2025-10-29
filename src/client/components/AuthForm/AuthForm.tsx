// AuthForm.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
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
}

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onFinish }) => {
  const [form] = Form.useForm();

  const handleSocialLogin = (provider: string) => {
    console.log(`Đăng nhập với ${provider}...`);
    message.info(`Đang xử lý đăng nhập với ${provider}`, 2);
    // TODO: Integrate with Google/Facebook API
  };

  return (
    <div className="p-6">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 rounded-lg"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </Form.Item>

        <div className="text-center my-4">
          <span className="text-gray-500">Hoặc {isLogin ? 'đăng nhập' : 'đăng ký'} với</span>
        </div>

        <div className="flex gap-4">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 rounded-lg"
            onClick={() => handleSocialLogin('Google')}
          >
            Google
          </Button>
          <Button
            icon={<FacebookOutlined />}
            size="large"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold transition-all duration-200 rounded-lg"
            onClick={() => handleSocialLogin('Facebook')}
          >
            Facebook
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AuthForm;