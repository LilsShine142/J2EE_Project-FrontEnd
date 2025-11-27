import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, InputNumber, Select, Spin } from "antd";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../../../hooks/useNotification";
import type { NotificationRequest } from "../../../../service/notificationsService";

const { TextArea } = Input;
const { Option } = Select;

const NotificationUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = Cookies.get("authToken") || "";
  const { useNotificationDetail, useUpdateNotification } = useNotification(token);
  const { data: notification, isLoading: detailLoading } = useNotificationDetail(Number(id), !!id);
  const updateMutation = useUpdateNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (notification) {
      form.setFieldsValue({
        userID: notification.userID,
        title: notification.title,
        content: notification.content,
        isRead: notification.isRead,
      });
    }
  }, [notification, form]);

  const handleSubmit = (values: NotificationRequest) => {
    updateMutation.mutate({ id: Number(id), request: values }, {
      onSuccess: () => {
        message.success("Cập nhật notification thành công!");
        navigate("/admin/notifications");
      },
      onError: (error: any) => {
        message.error(error.message || "Cập nhật notification thất bại!");
      },
    });
  };

  const handleCancel = () => {
    navigate("/admin/notifications");
  };

  if (detailLoading) {
    return (
      <div className="p-6">
        <Card className="shadow-lg max-w-2xl mx-auto">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </Card>
      </div>
    );
  }

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
            <span className="text-xl font-bold">Cập Nhật Notification - ID: {id}</span>
          </div>
        }
        className="shadow-lg max-w-2xl mx-auto"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
            <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
              Cập Nhật Notification
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NotificationUpdate;