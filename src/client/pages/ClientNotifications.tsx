import React, { useState } from "react";
import { Button, Space, message, List, Spin, Input, Pagination, Skeleton } from "antd";
import { Bell, CheckCircle, Delete, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../hooks/useNotification";
import NotificationItem from "../../components/NotificationIcon/NotificationItem";
import type { NotificationDTO } from "../../service/notificationsService";

const { Search } = Input;

const ClientNotifications: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useNotifications, useDeleteNotification, useMarkAsRead } = useNotification(token);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState<string>('');

  const { data: notificationsData, isLoading, error, refetch } = useNotifications(
    currentPage - 1,
    pageSize,
    search,
    !!token
  );

  const deleteMutation = useDeleteNotification();
  const markAsReadMutation = useMarkAsRead();

  const notifications = notificationsData?.content || [];
  const total = notificationsData?.totalElements || 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id, {
      onSuccess: () => {
        message.success("Đánh dấu đã đọc thành công!");
      },
      onError: (error: any) => {
        message.error(error.message || "Đánh dấu đã đọc thất bại!");
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success("Xóa thông báo thành công!");
      },
      onError: (error: any) => {
        message.error(error.message || "Xóa thông báo thất bại!");
      },
    });
  };

  const handleItemClick = (notification: NotificationDTO) => {
    // Giả sử dựa trên title hoặc content để navigate đến trang liên quan
    if (notification.title.toLowerCase().includes('đặt bàn') || notification.content.toLowerCase().includes('reservation')) {
      navigate('/client/my-reservations');
    } else if (notification.title.toLowerCase().includes('voucher') || notification.content.toLowerCase().includes('voucher')) {
      navigate('/client/profile'); // Hoặc trang voucher nếu có
    } else {
      navigate(`/client/notifications/${notification.notificationID}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-500 mb-6">Không thể tải danh sách thông báo. Vui lòng thử lại.</p>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Thông Báo Của Tôi</h1>
            </div>
            <Space>
              <Button
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => refetch()}
                size="large"
              >
                Làm mới
              </Button>
            </Space>
          </div>

          <div className="mb-6">
            <Search
              placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
              className="rounded-lg"
            />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <>
              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <NotificationItem
                    key={item.notificationID}
                    notification={item}
                    onClick={() => handleItemClick(item)}
                    onMarkAsRead={() => handleMarkAsRead(item.notificationID)}
                    onDelete={() => handleDelete(item.notificationID)}
                  />
                )}
                size="large"
                className="bg-white"
              />
              <div className="mt-6 text-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  className="flex justify-center"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-gray-500">Bạn chưa có thông báo nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientNotifications;