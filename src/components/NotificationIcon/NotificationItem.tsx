// import React from 'react';
// import { Button, Tag, Typography } from 'antd';
// import { CheckCircle } from 'lucide-react';
// import Cookies from 'js-cookie';
// import { useNotification } from '../../hooks/useNotification';
// import type { NotificationDTO } from '../../service/notificationsService';

// const { Text, Paragraph } = Typography;

// interface NotificationItemProps {
//   notification: NotificationDTO;
//   compact?: boolean;
//   onClick?: () => void;
//   onMarkAsRead?: () => void;
//   onDelete?: () => void;
// }

// const NotificationItem: React.FC<NotificationItemProps> = ({
//   notification,
//   compact = false,
//   onClick,
//   onMarkAsRead,
//   onDelete
// }) => {
//   const token = Cookies.get('authToken') || '';
//   const { useMarkAsRead } = useNotification(token);
//   const markAsReadMutation = useMarkAsRead();

//   const handleMarkAsRead = () => {
//     markAsReadMutation.mutate(notification.notificationID);
//   };

//   return (
//     <div className={`p-3 border-b border-gray-200 last:border-b-0 ${notification.isRead === 'No' ? 'bg-blue-50' : ''}`}>
//       <div className="flex justify-between items-start mb-2">
//         <Text strong className="text-sm">{notification.title}</Text>
//         <Tag color={notification.isRead === 'Yes' ? 'green' : 'orange'}>
//           {notification.isRead === 'Yes' ? 'Đã đọc' : 'Mới'}
//         </Tag>
//       </div>
//       <Paragraph
//         ellipsis={compact ? { rows: 2 } : false}
//         className="text-gray-600 text-sm mb-2"
//       >
//         {notification.content}
//       </Paragraph>
//       <div className="flex justify-between items-center text-xs text-gray-500">
//         <span>{new Date(notification.sentDate).toLocaleString()}</span>
//         {notification.isRead === 'No' && (
//           <Button
//             type="link"
//             size="small"
//             icon={<CheckCircle className="w-4 h-4" />}
//             onClick={handleMarkAsRead}
//             loading={markAsReadMutation.isPending}
//           >
//             Đánh dấu đã đọc
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationItem;



import React from 'react';
import { Button, Tag, Typography } from 'antd';
import { CheckCircle, Delete } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNotification } from '../../hooks/useNotification';
import type { NotificationDTO } from '../../service/notificationsService';

const { Text, Paragraph } = Typography;

interface NotificationItemProps {
  notification: NotificationDTO;
  compact?: boolean;
  onClick?: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  compact = false,
  onClick,
  onMarkAsRead,
  onDelete
}) => {
  const token = Cookies.get('authToken') || '';
  const { useMarkAsRead } = useNotification(token);
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
    } else {
      markAsReadMutation.mutate(notification.notificationID);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
        notification.isRead === 'No' ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <Text strong className="text-sm">{notification.title}</Text>
        <Tag color={notification.isRead === 'Yes' ? 'green' : 'orange'}>
          {notification.isRead === 'Yes' ? 'Đã đọc' : 'Mới'}
        </Tag>
      </div>
      <Paragraph
        ellipsis={compact ? { rows: 2 } : false}
        className="text-gray-600 text-sm mb-2"
      >
        {notification.content}
      </Paragraph>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{new Date(notification.sentDate).toLocaleString()}</span>
        <div className="flex gap-2">
          {notification.isRead === 'No' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
              loading={markAsReadMutation.isPending}
            >
              Đọc
            </Button>
          )}
          {onDelete && (
            <Button
              type="link"
              size="small"
              danger
              icon={<Delete className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Xóa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;