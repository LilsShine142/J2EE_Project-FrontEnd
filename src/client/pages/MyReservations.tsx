// src/pages/MyReservations.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Spin,
  Empty,
  Card,
  Pagination,
  message,
  Popconfirm,
} from 'antd';
import {
  ClockCircleOutlined,
  TeamOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBookings';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const MyReservations: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // ĐỌC COOKIE ĐỒNG BỘ – LOG CHẠY TRƯỚC
  const token = Cookies.get('authToken') || null;
  console.log('Auth token (đồng bộ - chạy trước):', token);

  // GỌI useBooking VỚI TOKEN ĐỒNG BỘ
  const { useMyBookings, useCancel } = useBooking(token);

  // DÙNG enabled ĐỂ CHỜ TOKEN (vẫn giữ an toàn)
  const {
    data,
    isLoading: isDataLoading,
    isFetching,
    error,
  } = useMyBookings(currentPage - 1, pageSize, {
    enabled: !!token, // Chỉ chạy khi có token
  });

  const cancelMutation = useCancel();

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Không thể tải danh sách đặt bàn');
    }
  }, [error]);

  if (!token) {
    message.warning('Vui lòng đăng nhập để xem đặt bàn của bạn.');
    return <Navigate to="/login" replace />;
  }
  console.log('data.', data);
  const bookings = data?.items ?? [];
  console.log('Bookings data:', bookings);
  const total = data?.total ?? 0;

const columns = [
    {
      title: 'Bàn',
      dataIndex: 'tableName',
      key: 'table',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: any, r: any) => (
        <div className="text-left">
          <div>{new Date(r.bookingDate).toLocaleDateString('vi-VN')}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <ClockCircleOutlined />
            {new Date(r.startTime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      title: 'Khách',
      dataIndex: 'numberOfGuests',
      render: (n: number) => (
        <span className="flex items-center gap-1">
          <TeamOutlined /> {n}
        </span>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'initialPayment',
      render: (amount: number | undefined) => (
        <span className="text-amber-600 font-medium flex items-center gap-1">
          <DollarCircleOutlined />{' '}
          {amount?.toLocaleString('vi-VN') ?? '0'} VND
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const map: Record<string, { color: string; text: string }> = {
          Confirmed: { color: 'green', text: 'Đã xác nhận' },
          Pending: { color: 'orange', text: 'Chờ xử lý' },
          Cancelled: { color: 'red', text: 'Đã hủy' },
        };
        const item = map[status] || { color: 'default', text: status };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, r: any) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="link"
            onClick={() => navigate(`/client/reserve/${r.bookingId}`)}
          >
            Chi tiết
          </Button>

          {r.status === 'Pending' && (
            <Popconfirm
              title="Hủy đặt bàn này?"
              onConfirm={() => cancelMutation.mutate(r.bookingId)}
              okText="Hủy"
              cancelText="Không"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                loading={cancelMutation.isPending}
              >
                Hủy
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Đặt bàn của tôi
      </h1>

      <Card>
        {isDataLoading && !isFetching ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : bookings.length === 0 ? (
          <Empty description="Chưa có đặt bàn nào" className="py-10">
            <Button type="primary" onClick={() => navigate('/client/reserve')}>
              Đặt bàn ngay
            </Button>
          </Empty>
        ) : (
          <>
            <div className="relative">
              {isFetching && !isDataLoading && (
                <div className="absolute top-2 right-2 z-10">
                  <Spin size="small" />
                </div>
              )}
              <Table
                dataSource={bookings}
                columns={columns}
                rowKey="bookingId"
                pagination={false}
                className="mb-4"
              />
            </div>

            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default MyReservations;