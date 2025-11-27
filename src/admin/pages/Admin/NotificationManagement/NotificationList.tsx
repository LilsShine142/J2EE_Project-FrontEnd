// import React, { useState, useEffect } from "react";
// import { Button, Space, message, Table, Spin, Tag, Input, Popconfirm } from "antd";
// import { Bell, Plus, Eye, Edit, Delete, CheckCircle, RefreshCw, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useNotification } from "../../../../hooks/useNotification";
// import type { NotificationDTO } from "../../../../service/notificationsService";

// const { Search: AntSearch } = Input;

// const NotificationList: React.FC = () => {
//   const navigate = useNavigate();
//   const token = Cookies.get("authToken") || "";
//   const { useNotifications, useDeleteNotification, useMarkAsRead } = useNotification(token);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const [search, setSearch] = useState<string>('');

//   const { data: notificationsData, isLoading, error, refetch } = useNotifications(
//     currentPage - 1, // page starts from 0
//     pageSize,
//     search,
//     !!token
//   );

//   const deleteMutation = useDeleteNotification();
//   const markAsReadMutation = useMarkAsRead();

//   const notifications = notificationsData?.content ?? [];
//   const fetchedTotalItems = notificationsData?.totalElements ?? 0;
//   const fetchedTotalPages = notificationsData?.totalPages ?? 1;

//   useEffect(() => {
//     setTotalItems(fetchedTotalItems);
//     setTotalPages(fetchedTotalPages);
//   }, [fetchedTotalItems, fetchedTotalPages]);

//   const handleAddNotification = () => {
//     navigate("/admin/notifications/add");
//   };

//   const handleViewNotification = (record: NotificationDTO) => {
//     navigate(`/admin/notifications/view/${record.notificationID}`);
//   };

//   const handleEditNotification = (record: NotificationDTO) => {
//     navigate(`/admin/notifications/update/${record.notificationID}`);
//   };

//   const handleDeleteNotification = (id: number) => {
//     deleteMutation.mutate(id, {
//       onSuccess: () => {
//         message.success("Xóa notification thành công!");
//       },
//       onError: (error: any) => {
//         message.error(error.message || "Xóa notification thất bại!");
//       },
//     });
//   };

//   const handleMarkAsRead = (id: number) => {
//     markAsReadMutation.mutate(id, {
//       onSuccess: () => {
//         message.success("Đánh dấu đã đọc thành công!");
//       },
//       onError: (error: any) => {
//         message.error(error.message || "Đánh dấu đã đọc thất bại!");
//       },
//     });
//   };

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//   };

//   const handleRefresh = () => {
//     setSearch('');
//     setCurrentPage(1);
//     refetch();
//     message.success("Đã làm mới danh sách!");
//   };

//   const handlePageChange = (page: number, size: number) => {
//     setCurrentPage(page);
//     setPageSize(size);
//   };

//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'notificationID',
//       key: 'notificationID',
//     },
//     {
//       title: 'User ID',
//       dataIndex: 'userID',
//       key: 'userID',
//     },
//     {
//       title: 'User Name',
//       dataIndex: 'userName',
//       key: 'userName',
//     },
//     {
//       title: 'Tiêu Đề',
//       dataIndex: 'title',
//       key: 'title',
//     },
//     {
//       title: 'Nội Dung',
//       dataIndex: 'content',
//       key: 'content',
//       ellipsis: true,
//     },
//     {
//       title: 'Thời Gian Gửi',
//       dataIndex: 'sentDate',
//       key: 'sentDate',
//       render: (text: string) => new Date(text).toLocaleString(),
//     },
//     {
//       title: 'Trạng Thái',
//       dataIndex: 'isRead',
//       key: 'isRead',
//       render: (isRead: string) => (
//         <Tag color={isRead === 'Yes' ? 'green' : 'orange'}>
//           {isRead === 'Yes' ? 'Đã đọc' : 'Chưa đọc'}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Hành Động',
//       key: 'actions',
//       render: (_: any, record: NotificationDTO) => (
//         <Space>
//           <Button
//             type="link"
//             icon={<Eye className="w-4 h-4" />}
//             onClick={() => handleViewNotification(record)}
//           >
//             Xem
//           </Button>
//           <Button
//             type="link"
//             icon={<Edit className="w-4 h-4" />}
//             onClick={() => handleEditNotification(record)}
//           >
//             Sửa
//           </Button>
//           {record.isRead !== 'Yes' && (
//             <Button
//               type="link"
//               icon={<CheckCircle className="w-4 h-4" />}
//               onClick={() => handleMarkAsRead(record.notificationID)}
//             >
//               Đã đọc
//             </Button>
//           )}
//           <Popconfirm
//             title="Bạn có chắc muốn xóa notification này?"
//             onConfirm={() => handleDeleteNotification(record.notificationID)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button
//               type="link"
//               danger
//               icon={<Delete className="w-4 h-4" />}
//             >
//               Xóa
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   if (error) {
//     return (
//       <div className="p-6 bg-white shadow-lg rounded-lg">
//         <div className="text-center py-12">
//           <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
//           <p className="text-gray-500 mb-6">Không thể tải danh sách notifications. Vui lòng thử lại.</p>
//           <Button onClick={() => refetch()}>Thử lại</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Bell className="w-7 h-7 text-blue-600" />
//           <h2 className="text-2xl font-bold text-gray-900">Quản lý Notifications</h2>
//         </div>
//         <Space>
//           <Button
//             type="primary"
//             icon={<Plus className="w-4 h-4" />}
//             onClick={handleAddNotification}
//             size="large"
//           >
//             Thêm Notification
//           </Button>
//           <Button
//             icon={<RefreshCw className="w-4 h-4" />}
//             onClick={handleRefresh}
//             size="large"
//           >
//             Làm mới
//           </Button>
//         </Space>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-6">
//         <AntSearch
//           placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onSearch={handleSearch}
//           style={{ width: 300 }}
//         />
//       </div>

//       {/* Table */}
//       {isLoading ? (
//         <div className="text-center py-12">
//           <Spin size="large" />
//         </div>
//       ) : notifications.length > 0 ? (
//         <Table
//           columns={columns}
//           dataSource={notifications}
//           rowKey="notificationID"
//           pagination={{
//             current: currentPage,
//             pageSize,
//             total: totalItems,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50", "100"],
//             onChange: handlePageChange,
//             showTotal: (total, range) => (
//               <span className="text-sm text-gray-600">
//                 Hiển thị {range[0]}-{range[1]} trong tổng số {total} notifications
//               </span>
//             ),
//             position: ["bottomRight"],
//           }}
//           size="middle"
//           className="notification-table"
//         />
//       ) : (
//         <div className="text-center py-12">
//           <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có notifications</h3>
//           <p className="text-gray-500 mb-6">Bấm nút "Thêm Notification" để tạo mới.</p>
//           <Button type="primary" onClick={handleAddNotification}>
//             Thêm Notification
//           </Button>
//         </div>
//       )}

//       <style>{`
//         /* Container của pagination */
//         .notification-table .ant-pagination {
//           display: flex;
//           justify-content: space-between !important;
//           align-items: center;
//           padding: 20px 24px !important;
//           margin: 0 !important;
//         }

//         /* Đẩy dòng chữ "Hiển thị..." về bên trái */
//         .notification-table .ant-pagination-total-text {
//           margin-right: auto !important;
//           float: none !important;
//         }

//         /* Các nút phân trang + select page size vẫn ở bên phải */
//         .notification-table .ant-pagination-options,
//         .notification-table .ant-pagination-prev,
//         .notification-table .ant-pagination-next,
//         .notification-table .ant-pagination-item,
//         .notification-table .ant-select-selector {
//           margin-left: auto;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NotificationList;




import React, { useState, useEffect } from "react";
import { Button, Space, message, Table, Spin, Tag, Input, Popconfirm } from "antd";
import { Bell, Plus, Eye, Edit, Delete, CheckCircle, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotification } from "../../../../hooks/useNotification";
import { useCurrentUser } from "../../../../hooks/useUserHooks";
import { usePermission } from "../../../../hooks/usePermissions";
import type { NotificationDTO } from "../../../../service/notificationsService";

const { Search: AntSearch } = Input;

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useNotifications, useDeleteNotification, useMarkAsRead } = useNotification(token);
  const { data: user } = useCurrentUser();
  const { getMyPermissions } = usePermission(token);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [myPermissions, setMyPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.roleId && (user.roleId === 2 || user.roleId === 3)) {
      getMyPermissions(token)
        .then((perms) => {
          const codes = perms.map((p: any) => p.permissionName).filter(Boolean);
          setMyPermissions(codes);
        })
        .catch((err) => {
          console.error("Lỗi lấy permission:", err);
          setMyPermissions([]);
        });
    } else {
      setMyPermissions([]);
    }
  }, [token, user]);

  const hasPermission = (code: string) => myPermissions.includes(code);

  const { data: notificationsData, isLoading, error, refetch } = useNotifications(
    currentPage - 1, // page starts from 0
    pageSize,
    search,
    !!token
  );

  const deleteMutation = useDeleteNotification();
  const markAsReadMutation = useMarkAsRead();

  const notifications = notificationsData?.content ?? [];
  const fetchedTotalItems = notificationsData?.totalElements ?? 0;
  const fetchedTotalPages = notificationsData?.totalPages ?? 1;

  useEffect(() => {
    setTotalItems(fetchedTotalItems);
    setTotalPages(fetchedTotalPages);
  }, [fetchedTotalItems, fetchedTotalPages]);

  const handleAddNotification = () => {
    navigate("/admin/send-notification");
  };

  const handleViewNotification = (record: NotificationDTO) => {
    navigate(`/admin/notifications/view/${record.notificationID}`);
  };

  const handleEditNotification = (record: NotificationDTO) => {
    navigate(`/admin/notifications/update/${record.notificationID}`);
  };

  const handleDeleteNotification = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success("Xóa notification thành công!");
      },
      onError: (error: any) => {
        message.error(error.message || "Xóa notification thất bại!");
      },
    });
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

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    refetch();
    message.success("Đã làm mới danh sách!");
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'notificationID',
      key: 'notificationID',
    },
    {
      title: 'User ID',
      dataIndex: 'userID',
      key: 'userID',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nội Dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Thời Gian Gửi',
      dataIndex: 'sentDate',
      key: 'sentDate',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isRead',
      key: 'isRead',
      render: (isRead: string) => (
        <Tag color={isRead === 'Yes' ? 'green' : 'orange'}>
          {isRead === 'Yes' ? 'Đã đọc' : 'Chưa đọc'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: NotificationDTO) => (
        <Space>
          <Button
            type="link"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleViewNotification(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEditNotification(record)}
            disabled={!hasPermission("UPDATE_NOTIFICATION")}
            className={
              hasPermission("UPDATE_NOTIFICATION")
                ? ""
                : "text-gray-400 cursor-not-allowed"
            }
          >
            Sửa
          </Button>
          {record.isRead !== 'Yes' && (
            <Button
              type="link"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => handleMarkAsRead(record.notificationID)}
            >
              Đã đọc
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa notification này?"
            onConfirm={() => handleDeleteNotification(record.notificationID)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger
              icon={<Delete className="w-4 h-4" />}
              disabled={!hasPermission("DELETE_NOTIFICATION")}
              className={
                hasPermission("DELETE_NOTIFICATION")
                  ? ""
                  : "text-gray-400 cursor-not-allowed"
              }
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-500 mb-6">Không thể tải danh sách notifications. Vui lòng thử lại.</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Notifications</h2>
        </div>
        <Space>
          <Button
            type="default"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddNotification}
            size="large"
            disabled={!hasPermission("CREATE_NOTIFICATION")}
            className={
              hasPermission("CREATE_NOTIFICATION")
                ? ""
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }
          >
            Thêm Notification
          </Button>
          <Button
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
            size="large"
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <AntSearch
          placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : notifications.length > 0 ? (
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="notificationID"
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePageChange,
            showTotal: (total, range) => (
              <span className="text-sm text-gray-600">
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} notifications
              </span>
            ),
            position: ["bottomRight"],
          }}
          size="middle"
          className="notification-table"
          scroll={{ x: 1200 }}
        />
      ) : (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có notifications</h3>
          <p className="text-gray-500 mb-6">Bấm nút "Thêm Notification" để tạo mới.</p>
          <Button type="primary" onClick={handleAddNotification}>
            Thêm Notification
          </Button>
        </div>
      )}

      <style>{`
        /* Container của pagination */
        .notification-table .ant-pagination {
          display: flex;
          justify-content: space-between !important;
          align-items: center;
          padding: 20px 24px !important;
          margin: 0 !important;
        }

        /* Đẩy dòng chữ "Hiển thị..." về bên trái */
        .notification-table .ant-pagination-total-text {
          margin-right: auto !important;
          float: none !important;
        }

        /* Các nút phân trang + select page size vẫn ở bên phải */
        .notification-table .ant-pagination-options,
        .notification-table .ant-pagination-prev,
        .notification-table .ant-pagination-next,
        .notification-table .ant-pagination-item,
        .notification-table .ant-select-selector {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default NotificationList;