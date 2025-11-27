import React from 'react';
import { Bell } from 'lucide-react';
import { Badge, Dropdown } from 'antd';
import Cookies from 'js-cookie';
import { useNotification } from '../../hooks/useNotification';
import NotificationDropdown from './NotificationDropdown';

const NotificationIcon: React.FC = () => {
  const token = Cookies.get('authToken') || '';
  const { useNotifications } = useNotification(token);

  // Fetch notifications với polling nhẹ (30s) để cập nhật unread count
  const { data: notificationsData } = useNotifications(0, 10, '', true);

  const notifications = notificationsData?.content || [];
  const unreadCount = notifications.filter(n => n.isRead === 'No').length;

  const menu = <NotificationDropdown notifications={notifications} />;

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <Badge
            count={unreadCount}
            size="small"
            className="absolute -top-1 -right-1"
            style={{ backgroundColor: '#f56565' }} // Red badge
          />
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationIcon;