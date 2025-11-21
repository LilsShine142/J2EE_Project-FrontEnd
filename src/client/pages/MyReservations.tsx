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