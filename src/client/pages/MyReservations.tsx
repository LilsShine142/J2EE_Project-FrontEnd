// // src/pages/MyReservations.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Tag,
//   Button,
//   Spin,
//   Empty,
//   Card,
//   Pagination,
//   message,
//   Popconfirm,
// } from 'antd';
// import {
//   ClockCircleOutlined,
//   TeamOutlined,
//   DollarCircleOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useBooking } from '../../hooks/useBookings';
// import Cookies from 'js-cookie';
// import { Navigate } from 'react-router-dom';

// const MyReservations: React.FC = () => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   // ĐỌC COOKIE ĐỒNG BỘ – LOG CHẠY TRƯỚC
//   const token = Cookies.get('authToken') || null;
//   console.log('Auth token (đồng bộ - chạy trước):', token);

//   // GỌI useBooking VỚI TOKEN ĐỒNG BỘ
//   const { useMyBookings, useCancel } = useBooking(token);

//   // DÙNG enabled ĐỂ CHỜ TOKEN (vẫn giữ an toàn)
//   const {
//     data,
//     isLoading: isDataLoading,
//     isFetching,
//     error,
//   } = useMyBookings(currentPage - 1, pageSize, {
//     enabled: !!token, // Chỉ chạy khi có token
//   });

//   const cancelMutation = useCancel();

//   useEffect(() => {
//     if (error) {
//       message.error(error.message || 'Không thể tải danh sách đặt bàn');
//     }
//   }, [error]);

//   if (!token) {
//     message.warning('Vui lòng đăng nhập để xem đặt bàn của bạn.');
//     return <Navigate to="/login" replace />;
//   }
//   console.log('data.', data);
//   const bookings = data?.content ?? [];
//   console.log('Bookings data:', bookings);
//   const total = data?.totalElements ?? 0;

// const columns = [
//     {
//       title: 'Bàn',
//       dataIndex: 'tableName',
//       key: 'table',
//       render: (text: string) => <span className="font-medium">{text}</span>,
//     },
//     {
//       title: 'Thời gian',
//       key: 'time',
//       render: (_: any, r: any) => (
//         <div className="text-left">
//           <div>{new Date(r.bookingDate).toLocaleDateString('vi-VN')}</div>
//           <div className="text-sm text-gray-500 flex items-center gap-1">
//             <ClockCircleOutlined />
//             {new Date(r.startTime).toLocaleTimeString('vi-VN', {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Khách',
//       dataIndex: 'numberOfGuests',
//       render: (n: number) => (
//         <span className="flex items-center gap-1">
//           <TeamOutlined /> {n}
//         </span>
//       ),
//     },
//     {
//       title: 'Thanh toán',
//       dataIndex: 'initialPayment',
//       render: (amount: number | undefined) => (
//         <span className="text-amber-600 font-medium flex items-center gap-1">
//           <DollarCircleOutlined />{' '}
//           {amount?.toLocaleString('vi-VN') ?? '0'} VND
//         </span>
//       ),
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       render: (status: string) => {
//         const map: Record<string, { color: string; text: string }> = {
//           Confirmed: { color: 'green', text: 'Đã xác nhận' },
//           Pending: { color: 'orange', text: 'Chờ xử lý' },
//           Cancelled: { color: 'red', text: 'Đã hủy' },
//         };
//         const item = map[status] || { color: 'default', text: status };
//         return <Tag color={item.color}>{item.text}</Tag>;
//       },
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_: any, r: any) => (
//         <div className="flex gap-2">
//           <Button
//             size="small"
//             type="link"
//             onClick={() => navigate(`/client/reserve/${r.bookingId}`)}
//           >
//             Chi tiết
//           </Button>

//           {r.status === 'Pending' && (
//             <Popconfirm
//               title="Hủy đặt bàn này?"
//               onConfirm={() => cancelMutation.mutate(r.bookingId)}
//               okText="Hủy"
//               cancelText="Không"
//               okButtonProps={{ danger: true }}
//             >
//               <Button
//                 size="small"
//                 danger
//                 loading={cancelMutation.isPending}
//               >
//                 Hủy
//               </Button>
//             </Popconfirm>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto py-6 px-4">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         Đặt bàn của tôi
//       </h1>

//       <Card>
//         {isDataLoading && !isFetching ? (
//           <div className="flex justify-center py-20">
//             <Spin size="large" />
//           </div>
//         ) : bookings.length === 0 ? (
//           <Empty description="Chưa có đặt bàn nào" className="py-10">
//             <Button type="primary" onClick={() => navigate('/client/reserve')}>
//               Đặt bàn ngay
//             </Button>
//           </Empty>
//         ) : (
//           <>
//             <div className="relative">
//               {isFetching && !isDataLoading && (
//                 <div className="absolute top-2 right-2 z-10">
//                   <Spin size="small" />
//                 </div>
//               )}
//               <Table
//                 dataSource={bookings}
//                 columns={columns}
//                 rowKey="bookingId"
//                 pagination={false}
//                 className="mb-4"
//               />
//             </div>

//             <div className="flex justify-center mt-6">
//               <Pagination
//                 current={currentPage}
//                 total={total}
//                 pageSize={pageSize}
//                 onChange={(page) => {
//                   setCurrentPage(page);
//                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                 }}
//                 showSizeChanger={false}
//                 showQuickJumper
//               />
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default MyReservations;






// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Tag,
//   Button,
//   Empty,
//   Card,
//   message,
//   Popconfirm,
//   Space,
// } from 'antd';
// import {
//   ClockCircleOutlined,
//   TeamOutlined,
//   CalendarOutlined,
//   EyeOutlined,
//   CloseCircleOutlined,
//   PlusOutlined,
//   ReloadOutlined,
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useBooking } from '../../hooks/useBookings';
// import Cookies from 'js-cookie';
// import { Navigate } from 'react-router-dom';

// const MyReservations: React.FC = () => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(0);
//   const pageSize = 10;

//   const token = Cookies.get('authToken') || null;
//   const { useMyBookings, useCancel } = useBooking(token);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     error,
//     refetch,
//   } = useMyBookings(currentPage, pageSize, {
//     enabled: !!token,
//   });

//   const cancelMutation = useCancel();

//   useEffect(() => {
//     if (error) {
//       message.error(error.message || 'Không thể tải danh sách đặt bàn');
//     }
//   }, [error]);

//   useEffect(() => {
//     if (cancelMutation.isSuccess) {
//       message.success('Đã hủy đặt bàn thành công!');
//       refetch();
//     }
//   }, [cancelMutation.isSuccess, refetch]);

//   if (!token) {
//     message.warning('Vui lòng đăng nhập để xem đặt bàn của bạn.');
//     return <Navigate to="/login" replace />;
//   }

//   const bookings = data?.content ?? [];
//   const total = data?.totalElements ?? 0;

//   const getStatusTag = (status: string) => {
//     const statusMap: Record<string, { color: string; text: string }> = {
//       Confirmed: { color: 'green', text: 'Đã xác nhận' },
//       Pending: { color: 'orange', text: 'Chờ xử lý' },
//       Cancelled: { color: 'red', text: 'Đã hủy' },
//       Completed: { color: 'blue', text: 'Hoàn tất' },
//     };
//     const item = statusMap[status] || { color: 'default', text: status };
//     return <Tag color={item.color}>{item.text}</Tag>;
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(value);
//   };

//   const columns = [
//     {
//       title: 'Mã đặt bàn',
//       dataIndex: 'bookingId',
//       key: 'bookingId',
//       width: 100,
//       render: (id: number) => (
//         <span className="font-mono text-sm font-semibold text-blue-600">
//           #{id}
//         </span>
//       ),
//     },
//     {
//       title: 'Bàn',
//       dataIndex: 'tableName',
//       key: 'table',
//       width: 120,
//       render: (text: string) => (
//         <Tag color="cyan" className="font-medium">
//           {text}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Ngày đặt',
//       dataIndex: 'bookingDate',
//       key: 'bookingDate',
//       width: 130,
//       render: (date: string) => (
//         <div className="flex items-center gap-2">
//           <CalendarOutlined className="text-gray-400" />
//           <span className="text-sm">
//             {new Date(date).toLocaleDateString('vi-VN')}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: 'Giờ bắt đầu',
//       dataIndex: 'startTime',
//       key: 'startTime',
//       width: 120,
//       render: (time: string) => (
//         <div className="flex items-center gap-2">
//           <ClockCircleOutlined className="text-blue-500" />
//           <span className="text-sm font-medium">
//             {new Date(time).toLocaleTimeString('vi-VN', {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: 'Số khách',
//       dataIndex: 'numberOfGuests',
//       key: 'numberOfGuests',
//       width: 100,
//       align: 'center' as const,
//       render: (n: number) => (
//         <span className="flex items-center justify-center gap-1 font-medium">
//           <TeamOutlined className="text-green-600" />
//           {n}
//         </span>
//       ),
//     },
//     {
//       title: 'Đã thanh toán',
//       dataIndex: 'initialPayment',
//       key: 'initialPayment',
//       width: 140,
//       align: 'right' as const,
//       render: (amount: number | undefined) => (
//         <span className="font-semibold text-green-600">
//           {formatCurrency(amount || 0)}
//         </span>
//       ),
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       width: 130,
//       render: (status: string) => getStatusTag(status),
//     },
//     {
//       title: 'Thao tác',
//       key: 'action',
//       width: 180,
//       align: 'center' as const,
//       fixed: 'right' as const,
//       render: (_: any, record: any) => (
//         <Space size="small">
//           <Button
//             type="primary"
//             ghost
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => navigate(`/client/reserve/${record.bookingId}`)}
//           >
//             Chi tiết
//           </Button>

//           {record.status === 'Pending' && (
//             <Popconfirm
//               title="Xác nhận hủy đặt bàn?"
//               description="Bạn có chắc chắn muốn hủy đặt bàn này không?"
//               onConfirm={() => cancelMutation.mutate(record.bookingId)}
//               okText="Hủy đặt bàn"
//               cancelText="Không"
//               okButtonProps={{ danger: true, loading: cancelMutation.isPending }}
//             >
//               <Button
//                 danger
//                 size="small"
//                 icon={<CloseCircleOutlined />}
//                 loading={cancelMutation.isPending}
//               >
//                 Hủy
//               </Button>
//             </Popconfirm>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   // Chỉ hiển thị loading toàn màn hình lần đầu
//   const isFirstLoading = isLoading && !data;

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">
//       {/* Header - Luôn hiển thị */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <CalendarOutlined className="text-3xl text-blue-600" />
//           <h1 className="text-2xl font-bold text-gray-900">
//             Đặt bàn của tôi
//           </h1>
//         </div>
//         <Space>
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => refetch()}
//             loading={isFetching}
//             size="large"
//           >
//             Làm mới
//           </Button>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             size="large"
//             onClick={() => navigate('/client/reserve')}
//           >
//             Đặt bàn mới
//           </Button>
//         </Space>
//       </div>

//       {/* Content */}
//       {isFirstLoading ? (
//         // Chỉ hiển thị empty loading lần đầu
//         <Card className="border shadow-sm">
//           <Empty
//             description="Đang tải dữ liệu..."
//             className="py-10"
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//           />
//         </Card>
//       ) : bookings.length === 0 && !isFetching ? (
//         // Empty state khi không có data
//         <Card className="border shadow-sm">
//           <Empty
//             description="Bạn chưa có đặt bàn nào"
//             className="py-10"
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//           >
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => navigate('/client/reserve')}
//               size="large"
//             >
//               Đặt bàn ngay
//             </Button>
//           </Empty>
//         </Card>
//       ) : (
//         // Table với loading overlay
//         <div className="bg-white rounded-lg border overflow-hidden">
//           <Table
//             dataSource={bookings}
//             columns={columns}
//             rowKey="bookingId"
//             loading={{
//               spinning: isFetching,
//               tip: 'Đang tải dữ liệu...',
//             }}
//             locale={{
//               emptyText: isFetching ? ' ' : (
//                 <Empty
//                   description="Không có dữ liệu"
//                   image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 />
//               ),
//             }}
//             scroll={{ x: 1100 }}
//             pagination={{
//               current: currentPage + 1,
//               pageSize: pageSize,
//               total: total,
//               showSizeChanger: true,
//               showTotal: (total, range) => (
//                 <span className="text-sm text-gray-600">
//                   Hiển thị {range[0]}-{range[1]} trong tổng số {total} đặt bàn
//                 </span>
//               ),
//               onChange: (page, size) => {
//                 setCurrentPage(page - 1);
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//               },
//               pageSizeOptions: ['10', '20', '50'],
//               className: 'py-4',
//             }}
//             size="middle"
//           />

//           <style>{`
//             .ant-table-pagination {
//               display: flex !important;
//               justify-content: space-between !important;
//               align-items: center !important;
//               padding: 20px 24px !important;
//               margin: 0 !important;
//             }

//             .ant-pagination-total-text {
//               margin-right: auto !important;
//               float: none !important;
//             }

//             .ant-pagination-options,
//             .ant-pagination-prev,
//             .ant-pagination-next,
//             .ant-pagination-item {
//               margin-left: auto;
//             }
//           `}</style>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyReservations;

import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Empty,
  Card,
  message,
  Popconfirm,
  Space,
  Spin,
} from 'antd';
import {
  CalendarOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useBooking } from '../../hooks/useBookings';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm/BookingForm';
import DetailModal from '../components/Modal/DetailModal';

const MyReservations: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    visible: boolean;
    fields: Array<{ label: string; value: any }>;
  }>({
    visible: false,
    fields: [],
  });

  const token = Cookies.get('authToken') || null;
  const { useMyBookings, useCancel } = useBooking(token);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMyBookings(currentPage, pageSize, {
    enabled: !!token,
  });

  const cancelMutation = useCancel();

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Không thể tải danh sách đặt bàn');
    }
  }, [error]);

  useEffect(() => {
    if (cancelMutation.isSuccess) {
      message.success('Đã hủy đặt bàn thành công!');
      refetch();
    }
  }, [cancelMutation.isSuccess, refetch]);

  if (!token) {
    message.warning('Vui lòng đăng nhập để xem đặt bàn của bạn.');
    return <Navigate to="/login" replace />;
  }

  const bookings = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      Confirmed: { color: 'green', text: 'Đã xác nhận' },
      Pending: { color: 'orange', text: 'Chờ xử lý' },
      Cancelled: { color: 'red', text: 'Đã hủy' },
      Completed: { color: 'blue', text: 'Hoàn tất' },
    };
    const item = statusMap[status] || { color: 'default', text: status };
    return <Tag color={item.color}>{item.text}</Tag>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const columns = [
    {
      title: 'Mã đặt bàn',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 100,
      render: (id: number) => (
        <span className="font-mono text-sm font-semibold text-blue-600">
          #{id}
        </span>
      ),
    },
    {
      title: 'Bàn',
      dataIndex: 'tableName',
      key: 'table',
      width: 120,
      render: (text: string) => (
        <Tag color="cyan" className="font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: 130,
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <span className="text-sm">
            {new Date(date).toLocaleDateString('vi-VN')}
          </span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              const fields = [
                { label: 'Mã đặt bàn', value: `#${record.bookingId}` },
                { label: 'Bàn', value: record.tableName },
                { label: 'Ngày đặt', value: new Date(record.bookingDate).toLocaleDateString('vi-VN') },
                { label: 'Giờ bắt đầu', value: new Date(record.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) },
                { label: 'Số khách', value: record.numberOfGuests },
                { label: 'Đã thanh toán', value: formatCurrency(record.initialPayment || 0) },
                { label: 'Trạng thái', value: getStatusTag(record.status) },
                ...(record.note ? [{ label: 'Ghi chú', value: record.note }] : []),
              ];
              setDetailModal({ visible: true, fields });
            }}
          >
            Chi tiết
          </Button>

          {record.status === 'Pending' && (
            <Popconfirm
              title="Xác nhận hủy đặt bàn?"
              description="Bạn có chắc chắn muốn hủy đặt bàn này không?"
              onConfirm={() => cancelMutation.mutate(record.bookingId)}
              okText="Hủy đặt bàn"
              cancelText="Không"
              okButtonProps={{ danger: true, loading: cancelMutation.isPending }}
            >
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                loading={cancelMutation.isPending}
              >
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Chỉ hiển thị loading toàn màn hình lần đầu
  const isFirstLoading = isLoading && !data;

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <header className="border-b border-gray-200 pb-4 mb-6">
      {/* Header*/}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarOutlined className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Đặt bàn của tôi
          </h1>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
            size="large"
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setShowBookingModal(true)}
          >
            Đặt bàn mới
          </Button>
        </Space>
      </div>
      </header>
      {/* Content */}
      {isFirstLoading ? (
        <Card className="border shadow-sm">
          <Empty
            description="Đang tải dữ liệu..."
            className="py-10"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : bookings.length === 0 && !isFetching ? (
        <Card className="border shadow-sm">
          <Empty
            description="Bạn chưa có đặt bàn nào"
            className="py-10"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowBookingModal(true)}
              size="large"
            >
              Đặt bàn ngay
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table
            dataSource={bookings}
            columns={columns}
            rowKey="bookingId"
            loading={{
              spinning: isFetching,
              tip: 'Đang tải dữ liệu...',
            }}
            locale={{
              emptyText: isFetching ? ' ' : (
                <Empty
                  description="Không có dữ liệu"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            scroll={{ x: 900 }}
            pagination={{
              current: currentPage + 1,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <span className="text-sm text-gray-600">
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} đặt bàn
                </span>
              ),
              onChange: (page, size) => {
                setCurrentPage(page - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
              pageSizeOptions: ['10', '20', '50'],
              className: 'py-4',
            }}
            size="middle"
          />

          <style>{`
            .ant-table-pagination {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              padding: 20px 24px !important;
              margin: 0 !important;
            }

            .ant-pagination-total-text {
              margin-right: auto !important;
              float: none !important;
            }

            .ant-pagination-options,
            .ant-pagination-prev,
            .ant-pagination-next,
            .ant-pagination-item {
              margin-left: auto;
            }
          `}</style>
        </div>
      )}

      {/* Modal BookingForm */}
      <BookingForm
        visible={showBookingModal}
        onCancel={() => setShowBookingModal(false)}
        onSuccess={() => {
          setShowBookingModal(false);
          refetch();
        }}
      />

      {/* Modal Chi tiết */}
      <DetailModal
        visible={detailModal.visible}
        title="Chi tiết đặt bàn"
        fields={detailModal.fields}
        onCancel={() => setDetailModal({ visible: false, fields: [] })}
      />
    </section>
  );
};

export default MyReservations;