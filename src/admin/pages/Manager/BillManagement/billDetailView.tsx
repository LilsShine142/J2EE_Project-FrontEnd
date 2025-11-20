import React, { type JSX } from "react";
import { Card, Descriptions, Tag, Space, Button, Divider, Alert } from "antd";
import { Receipt, User, MapPin, ShoppingCart, Calendar, CreditCard, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import type { BillDTO } from "../../../../service/billService";
import { ORDER_STATUS } from "../../../../lib/constants/constants";
import dayjs from "dayjs";

interface BillDetailViewProps {
  bill: BillDTO;
  onClose?: () => void;
}

const BillDetailView: React.FC<BillDetailViewProps> = ({ bill, onClose }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusTag = (statusId: number | null, statusName?: string) => {
    if (!statusId) return <Tag>Không xác định</Tag>;

    const statusConfig: Record<number, { color: string; icon: JSX.Element | null }> = {
      [ORDER_STATUS.PAID.id]: { color: 'green', icon: <CheckCircle className="w-3 h-3" /> },
      [ORDER_STATUS.PENDING.id]: { color: 'orange', icon: <Clock className="w-3 h-3" /> },
      [ORDER_STATUS.CANCELLED.id]: { color: 'red', icon: <XCircle className="w-3 h-3" /> },
      [ORDER_STATUS.PARTIALLY_PAID.id]: { color: 'blue', icon: <DollarSign className="w-3 h-3" /> },
    };

    const config = statusConfig[statusId] || { color: 'default', icon: null };

    return (
      <Tag color={config.color} icon={config.icon} className="flex items-center gap-1">
        {statusName || 'Không xác định'}
      </Tag>
    );
  };

  const getPaymentMethodTag = (method: string) => {
    return method === 'CASH' ? (
      <Tag color="green" icon={<DollarSign className="w-3 h-3" />}>Tiền mặt</Tag>
    ) : (
      <Tag color="blue" icon={<CreditCard className="w-3 h-3" />}>Chuyển khoản</Tag>
    );
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold">Chi tiết hóa đơn #{bill.billID}</span>
          </div>
          {getStatusTag(bill.statusID, bill.statusName)}
        </div>
      }
      extra={onClose && (
        <Button onClick={onClose} className="cursor-pointer">
          Đóng
        </Button>
      )}
      className="shadow-lg h-full flex flex-col"
      styles={{
        body: { 
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 120px)', // Trừ đi height của header
        }
      }}
    >
      <Space direction="vertical" className="w-full" size="large">
        {/* Basic Info */}
        <div>
          <Descriptions column={2} bordered>
            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Mã hóa đơn
                </span>
              }
              span={2}
            >
              <span className="font-bold text-blue-600">#{bill.billID}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Khách hàng
                </span>
              }
            >
              {bill.userName || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Bàn
                </span>
              }
            >
              {bill.tableName || 'N/A'}
            </Descriptions.Item>

            {bill.bookingID && (
              <Descriptions.Item label="Booking ID">
                <Tag color="purple">#{bill.bookingID}</Tag>
              </Descriptions.Item>
            )}

            {bill.orderID && (
              <Descriptions.Item 
                label={
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Order ID
                  </span>
                }
              >
                <Tag color="blue">#{bill.orderID}</Tag>
              </Descriptions.Item>
            )}

            <Descriptions.Item 
              label={
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày tạo
                </span>
              }
              span={2}
            >
              {dayjs(bill.billDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Payment Info */}
        <div>
          <div className="text-base font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Thông tin thanh toán
          </div>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Phương thức" span={2}>
              {getPaymentMethodTag(bill.paymentMethod)}
            </Descriptions.Item>

            {bill.mealTotal && (
              <Descriptions.Item label="Tiền món ăn" span={2}>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(bill.mealTotal)}
                </span>
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Đã thanh toán" span={2}>
              <span className="font-semibold text-green-600">
                {formatCurrency(bill.initialPayment)}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Tổng tiền" span={2}>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(bill.totalAmount)}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Còn lại" span={2}>
              <span className="font-semibold text-orange-600">
                {formatCurrency(bill.remainingAmount)}
              </span>
            </Descriptions.Item>

            {bill.paymentTime && (
              <Descriptions.Item label="Thời gian thanh toán" span={2}>
                {dayjs(bill.paymentTime).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
            )}

            {bill.transactionNo && (
              <Descriptions.Item label="Mã giao dịch" span={2}>
                <Tag color="blue">{bill.transactionNo}</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        {/* Status Description */}
        {bill.statusDescription && (
          <>
            <Divider />
            <Alert
              message="Trạng thái"
              description={bill.statusDescription}
              type="info"
              showIcon
            />
          </>
        )}

        {/* Timestamps */}
        <Divider />
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Tạo lúc:</span>{' '}
            {dayjs(bill.createdAt).format('DD/MM/YYYY HH:mm')}
          </div>
          <div>
            <span className="font-medium">Cập nhật:</span>{' '}
            {dayjs(bill.updatedAt).format('DD/MM/YYYY HH:mm')}
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default BillDetailView;