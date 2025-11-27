import React from "react";
import { Form, Input, Button, Card, message, InputNumber, Select } from "antd";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../../../hooks/useNotification";
import type { NotificationDTO, NotificationRequest } from "../../../../service/notificationsService";

const { TextArea } = Input;
const { Option } = Select;

const NotificationAdd: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useCreateNotification } = useNotification(token);
  const createMutation = useCreateNotification();
  const [form] = Form.useForm();

  const handleSubmit = (values: NotificationRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        message.success("Tạo notification thành công!");
        navigate("/admin/notifications");
      },
      onError: (error: any) => {
        message.error(error.message || "Tạo notification thất bại!");
      },
    });
  };

  const handleCancel = () => {
    navigate("/admin/notifications");
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <ArrowLeft
              className="w-5 h-5 cursor-pointer hover:text-blue-600"
              onClick={handleCancel}
            />
            <Bell className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Thêm Notification</span>
          </div>
        }
        className="shadow-lg max-w-2xl mx-auto"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isRead: 'No' }}
        >
          <Form.Item
            label="User ID"
            name="userID"
            rules={[{ required: true, message: "Vui lòng nhập User ID!" }]}
          >
            <InputNumber placeholder="Nhập User ID" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Tiêu Đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>

          <Form.Item
            label="Nội Dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>

          <Form.Item
            label="Trạng Thái Đọc"
            name="isRead"
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Yes">Đã đọc</Option>
              <Option value="No">Chưa đọc</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              Thêm Notification
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NotificationAdd;