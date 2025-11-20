import React from "react";
import { Button, Space, Tag, Tooltip } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { BillDTO } from "../../../service/billService";
import { ORDER_STATUS } from "../../../lib/constants/constants";
import dayjs from "dayjs";

interface BillTableColumnsProps {
  onViewDetail: (bill: BillDTO) => void;
}

export const useBillTableColumns = ({ onViewDetail }: BillTableColumnsProps): ColumnsType<BillDTO> => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusTag = (statusId: number | null, statusName?: string) => {
    if (!statusId) return <Tag>Không xác định</Tag>;

    const statusConfig: Record<number, { color: string }> = {
      [ORDER_STATUS.PAID.id]: { color: "green" },
      [ORDER_STATUS.PENDING.id]: { color: "orange" },
      [ORDER_STATUS.CANCELLED.id]: { color: "red" },
      [ORDER_STATUS.PARTIALLY_PAID.id]: { color: "blue" },
      [ORDER_STATUS.REFUNDED.id]: { color: "purple" },
    };

    const config = statusConfig[statusId] || { color: "default" };

    return <Tag color={config.color}>{statusName || "Không xác định"}</Tag>;
  };

  return [
    {
      title: "Mã HĐ",
      dataIndex: "billID",
      key: "billID",
      width: 80,
      fixed: "left",
      render: (id: number) => (
        <span className="font-mono text-sm font-semibold text-blue-600">#{id}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      ellipsis: true,
      render: (name: string) => (
        <Tooltip title={name}>
          <span className="text-gray-800">{name || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Bàn",
      dataIndex: "tableName",
      key: "tableName",
      width: 100,
      render: (name: string) => <Tag color="cyan">{name || "N/A"}</Tag>,
    },
    {
      title: "Liên kết",
      key: "links",
      width: 140,
      render: (_: any, record: BillDTO) => (
        <Space size="small">
          {record.bookingID && (
            <Tag color="purple" className="text-xs">
              Booking #{record.bookingID}
            </Tag>
          )}
          {record.orderID && (
            <Tag color="blue" className="text-xs">
              Order #{record.orderID}
            </Tag>
          )}
          {!record.bookingID && !record.orderID && (
            <span className="text-gray-400">-</span>
          )}
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "billDate",
      key: "billDate",
      width: 110,
      render: (date: string) => (
        <span className="text-sm text-gray-700">
          {dayjs(date).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right",
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 130,
      align: "right",
      render: (_: any, record: BillDTO) => (
        <div className="text-right">
          <div className="text-xs text-gray-500">
            Đã:{" "}
            <span className="font-medium text-blue-600">
              {formatCurrency(record.initialPayment)}
            </span>
          </div>
          {record.remainingAmount > 0 && (
            <div className="text-xs text-gray-500">
              Còn:{" "}
              <span className="font-medium text-orange-600">
                {formatCurrency(record.remainingAmount)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusID",
      key: "statusID",
      width: 130,
      render: (_: any, record: BillDTO) =>
        getStatusTag(record.statusID, record.statusName),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_: any, record: BillDTO) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];
};