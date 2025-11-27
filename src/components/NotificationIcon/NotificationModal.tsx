// Tùy chọn: Modal đầy đủ cho trang /client/notifications
import React, { useState } from 'react';
import { Modal, Button, Spin, Pagination } from 'antd';
import { Bell } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNotification } from '../../hooks/useNotification';
import NotificationItem from './NotificationItem';

const NotificationModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const token = Cookies.get('authToken') || '';
  const { useNotifications } = useNotification(token);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: notificationsData, isLoading } = useNotifications(currentPage - 1, pageSize, '', !!token);
  const notifications = notificationsData?.content || [];
  const total = notificationsData?.totalElements || 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Tất Cả Thông Báo
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {isLoading ? (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {notifications.map((item) => (
            <NotificationItem key={item.notificationID} notification={item} />
          ))}
          <div className="mt-4 text-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default NotificationModal;