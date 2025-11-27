import React from "react";
import { Card, Descriptions, Spin, Tag } from "antd";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../../../hooks/useNotification";
import type { NotificationDTO } from "../../../../service/notificationsService";

interface Column {
  label: string;
  key: keyof NotificationDTO;
  span?: number;
  render?: (value: any) => React.ReactNode;
}

const NotificationView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = Cookies.get("authToken") || "";
  const { useNotificationDetail } = useNotification(token);

  const { data: notification, isLoading, error } = useNotificationDetail(Number(id), !!id);

  const handleCancel = () => {
    navigate("/admin/notifications");
  };

  const columns: Column[] = [
    { label: 'ID', key: 'notificationID' },
    { label: 'User ID', key: 'userID' },
    { label: 'User Name', key: 'userName' },
    { label: 'Tiêu Đề', key: 'title' },
    { label: 'Nội Dung', key: 'content', span: 2, render: (value) => <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div> },
    { label: 'Thời Gian Gửi', key: 'sentDate', render: (value) => new Date(value).toLocaleString() },
    { label: 'Trạng Thái', key: 'isRead', render: (value) => <Tag color={value === 'Yes' ? 'green' : 'orange'}>{value === 'Yes' ? 'Đã đọc' : 'Chưa đọc'}</Tag> },
  ];

  if (error) {
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
              <span className="text-xl font-bold">Chi Tiết Notification</span>
            </div>
          }
          className="shadow-lg max-w-2xl mx-auto"
        >
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-500">Không thể tải chi tiết notification.</p>
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
            <span className="text-xl font-bold">Chi Tiết Notification - ID: {id}</span>
          </div>
        }
        className="shadow-lg max-w-2xl mx-auto"
      >
        {isLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : notification ? (
          <Descriptions bordered column={2}>
            {columns.map((col) => (
              <Descriptions.Item key={col.key} label={col.label} span={col.span || 1}>
                {col.render ? col.render(notification[col.key]) : notification[col.key]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy notification</h3>
            <p className="text-gray-500">Notification với ID {id} không tồn tại.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationView;