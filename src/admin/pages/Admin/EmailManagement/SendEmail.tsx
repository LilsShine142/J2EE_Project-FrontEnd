import React, { useState } from "react";
import { Card, message, Select, Spin, Space, Radio, Alert, Button, Form, Input, InputNumber } from "antd";
import { ArrowLeft, Mail, User, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmail } from "../../../../hooks/useEmail";
import Cookies from "js-cookie";

type EmailType = 'general' | 'verification' | 'password-reset' | 'welcome';

const SendEmail: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useSendEmail, useSendVerificationEmail, useSendPasswordResetEmail, useSendWelcomeEmail } = useEmail(token);

  const [emailType, setEmailType] = useState<EmailType>('general');
  const [form] = Form.useForm();

  const sendMutation = useSendEmail();
  const verificationMutation = useSendVerificationEmail();
  const passwordResetMutation = useSendPasswordResetEmail();
  const welcomeMutation = useSendWelcomeEmail();

  const handleSubmit = async (values: any) => {
    try {
      if (emailType === 'general') {
        await sendMutation.mutateAsync({
          sendType: values.sendType,
          userId: values.sendType === 'USER' ? values.userId : undefined,
          userIds: values.sendType === 'LIST' ? values.userIds : undefined,
          roleId: values.sendType === 'ROLE' ? values.roleId : undefined,
          title: values.title,
          content: values.content,
          templateVariables: values.templateVariables,
        });
      } else if (emailType === 'verification') {
        await verificationMutation.mutateAsync({
          userId: values.userId,
          email: values.email,
          fullName: values.fullName,
        });
      } else if (emailType === 'password-reset') {
        await passwordResetMutation.mutateAsync({
          userId: values.userId,
          email: values.email,
        });
      } else if (emailType === 'welcome') {
        await welcomeMutation.mutateAsync({
          userId: values.userId,
          email: values.email,
          fullName: values.fullName,
        });
      }
      navigate("/admin/emails");
    } catch (error: any) {
      message.error(error.message || "Gửi email thất bại!");
    }
  };

  const handleCancel = () => {
    navigate("/admin/emails");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleCancel}
            className="hover:bg-gray-100"
          />
          <Mail className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gửi Email Mới</h2>
        </div>
      </div>

      {/* Content */}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Chọn loại email */}
        <Card className="border shadow-sm mb-6">
          <Form.Item label="Loại Email" name="emailType" initialValue="general">
            <Radio.Group value={emailType} onChange={(e) => setEmailType(e.target.value)}>
              <Space direction="vertical">
                <Radio value="general">Email Linh Hoạt</Radio>
                <Radio value="verification">Email Xác Nhận</Radio>
                <Radio value="password-reset">Email Đặt Lại Mật Khẩu</Radio>
                <Radio value="welcome">Email Chào Mừng</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Card>

        {emailType === 'general' && (
          <Card className="border shadow-sm mb-6">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item label="Kiểu Gửi" name="sendType" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="USER">Gửi đến User</Radio>
                  <Radio value="LIST">Gửi đến Danh Sách</Radio>
                  <Radio value="ROLE">Gửi đến Role</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.sendType !== curr.sendType}>
                {({ getFieldValue }) => {
                  const sendType = getFieldValue('sendType');
                  if (sendType === 'USER') {
                    return (
                      <Form.Item label="User ID" name="userId" rules={[{ required: true }]}>
                        <InputNumber placeholder="Nhập User ID" style={{ width: '100%' }} />
                      </Form.Item>
                    );
                  } else if (sendType === 'LIST') {
                    return (
                      <Form.Item label="Danh Sách User IDs" name="userIds" rules={[{ required: true }]}>
                        <Select mode="tags" placeholder="Nhập User IDs" style={{ width: '100%' }} />
                      </Form.Item>
                    );
                  } else if (sendType === 'ROLE') {
                    return (
                      <Form.Item label="Role ID" name="roleId" rules={[{ required: true }]}>
                        <InputNumber placeholder="Nhập Role ID" style={{ width: '100%' }} />
                      </Form.Item>
                    );
                  }
                  return null;
                }}
              </Form.Item>
              <Form.Item label="Tiêu Đề" name="title" rules={[{ required: true }]}>
                <Input placeholder="Nhập tiêu đề email" />
              </Form.Item>
              <Form.Item label="Nội Dung" name="content" rules={[{ required: true }]}>
                <Input.TextArea rows={4} placeholder="Nhập nội dung email" />
              </Form.Item>
            </Space>
          </Card>
        )}

        {(emailType === 'verification' || emailType === 'password-reset' || emailType === 'welcome') && (
          <Card className="border shadow-sm mb-6">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item label="User ID" name="userId" rules={[{ required: true }]}>
                <InputNumber placeholder="Nhập User ID" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
              {(emailType === 'verification' || emailType === 'welcome') && (
                <Form.Item label="Họ Tên" name="fullName">
                  <Input placeholder="Nhập họ tên" />
                </Form.Item>
              )}
            </Space>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={sendMutation.isPending || verificationMutation.isPending || passwordResetMutation.isPending || welcomeMutation.isPending}
          >
            Gửi Email
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SendEmail;