import React from "react";
import { Card, Spin, Tag, Button, Space } from "antd";
import { ArrowLeft, Bell, CheckCircle, Calendar, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../hooks/useNotification";

const ClientNotificationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = Cookies.get("authToken") || "";
  const { useNotificationDetail, useMarkAsRead } = useNotification(token);

  const { data: notification, isLoading, error } = useNotificationDetail(Number(id), !!id);
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAsRead = () => {
    markAsReadMutation.mutate(Number(id));
  };

  const handleBack = () => {
    navigate("/client/notifications");
  };

  const handleRelatedAction = () => {
    // Giả sử dựa trên title/content để navigate
    if (notification?.title.toLowerCase().includes('đặt bàn') || notification?.content.toLowerCase().includes('reservation')) {
      navigate('/client/my-reservations');
    } else if (notification?.title.toLowerCase().includes('voucher')) {
      navigate('/client/profile');
    } else {
      // Default
      navigate('/client/dashboard');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg max-w-2xl mx-auto">
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-500">Không thể tải chi tiết thông báo.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card
          title={
            <div className="flex items-center gap-3">
              <ArrowLeft
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={handleBack}
              />
              <Bell className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">Chi Tiết Thông Báo</span>
            </div>
          }
          className="shadow-lg max-w-2xl mx-auto"
          extra={
            <Space>
              {notification?.isRead === 'No' && (
                <Button
                  type="primary"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleMarkAsRead}
                  loading={markAsReadMutation.isPending}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
              <Button onClick={handleRelatedAction}>
                Xem liên quan
              </Button>
            </Space>
          }
        >
          {isLoading ? (
            <div className="text-center py-12">
              <Spin size="large" />
            </div>
          ) : notification ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{notification.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(notification.sentDate).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag color={notification.isRead === 'Yes' ? 'green' : 'orange'}>
                  {notification.isRead === 'Yes' ? 'Đã đọc' : 'Chưa đọc'}
                </Tag>
              </div>
              <div className="border-t pt-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notification.content}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thông báo</h3>
              <p className="text-gray-500">Thông báo với ID {id} không tồn tại.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ClientNotificationDetail;