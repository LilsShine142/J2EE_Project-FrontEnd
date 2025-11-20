import React from "react";
import { Input, Select, Tag } from "antd";
import { Search, Filter } from "lucide-react";
import { ORDER_STATUS } from "../../../lib/constants/constants";

interface BillTableFiltersProps {
  onSearch: (value: string) => void;
  onStatusFilter: (value: number | undefined) => void;
}

export const BillTableFilters: React.FC<BillTableFiltersProps> = ({
  onSearch,
  onStatusFilter,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="🔍 Tìm theo khách hàng, bàn..."
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            allowClear
            size="large"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          size="large"
          style={{ width: 200 }}
          onChange={onStatusFilter}
          suffixIcon={<Filter className="w-4 h-4" />}
        >
          <Select.Option value={ORDER_STATUS.PAID.id}>
            <Tag color="green" className="m-0">
              Đã thanh toán
            </Tag>
          </Select.Option>
          <Select.Option value={ORDER_STATUS.PENDING.id}>
            <Tag color="orange" className="m-0">
              Chờ thanh toán
            </Tag>
          </Select.Option>
          <Select.Option value={ORDER_STATUS.PARTIALLY_PAID.id}>
            <Tag color="blue" className="m-0">
              Thanh toán 1 phần
            </Tag>
          </Select.Option>
          <Select.Option value={ORDER_STATUS.CANCELLED.id}>
            <Tag color="red" className="m-0">
              Đã hủy
            </Tag>
          </Select.Option>
          <Select.Option value={ORDER_STATUS.REFUNDED.id}>
            <Tag color="purple" className="m-0">
              Đã hoàn tiền
            </Tag>
          </Select.Option>
        </Select>
      </div>
    </div>
  );
};