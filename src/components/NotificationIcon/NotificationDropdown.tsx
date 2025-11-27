import React from 'react';
import { Button, Divider, Empty, List } from 'antd';
import { Bell, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import type { NotificationDTO } from '../../service/notificationsService';

interface NotificationDropdownProps {
  notifications: NotificationDTO[];
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/client/notifications'); // Route đến trang đầy đủ (có thể tạo sau)
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg border p-4 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Thông Báo
        </h4>
        <Button type="link" size="small" onClick={handleViewAll}>
          Xem tất cả
        </Button>
      </div>
      <Divider className="my-2" />
      {notifications.length > 0 ? (
        <List
          dataSource={notifications.slice(0, 5)} // Hiển thị tối đa 5 item trong dropdown
          renderItem={(item) => <NotificationItem notification={item} compact />}
          size="small"
        />
      ) : (
        <Empty
          image={<Bell className="w-8 h-8 text-gray-400" />}
          description="Không có thông báo mới"
          className="py-4"
        />
      )}
    </div>
  );
};

export default NotificationDropdown;