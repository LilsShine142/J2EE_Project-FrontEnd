import React from "react";
import { Table } from "antd";
import type { BillDTO } from "../../../service/billService";
import { useBillTableColumns } from "./BillTableColumns";

interface BillTableProps {
  data: BillDTO[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number, size: number) => void;
  onViewDetail: (bill: BillDTO) => void;
}

export const BillTable: React.FC<BillTableProps> = ({
  data,
  loading,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onViewDetail,
}) => {
  const columns = useBillTableColumns({ onViewDetail });

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="billID"
        loading={loading}
        scroll={{ x: 1100 }}
        pagination={{
          current: currentPage + 1,
          pageSize,
          total: totalElements,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: onPageChange,
          showTotal: (total, range) => (
            <span className="text-sm text-gray-600">
              Hiển thị {range[0]}-{range[1]} trong tổng số {total} hóa đơn
            </span>
          ),
          position: ["bottomRight"],
        }}
        size="middle"
        className="bill-table"
      />

      <style>{`
        /* Container của pagination */
        .bill-table .ant-pagination {
          display: flex;
          justify-content: space-between !important;
          align-items: center;
          padding: 20px 24px !important;
          margin: 0 !important;
        }

        /* Đẩy dòng chữ "Hiển thị..." về bên trái */
        .bill-table .ant-pagination-total-text {
          margin-right: auto !important;
          float: none !important;
        }

        /* Các nút phân trang + select page size vẫn ở bên phải */
        .bill-table .ant-pagination-options,
        .bill-table .ant-pagination-prev,
        .bill-table .ant-pagination-next,
        .bill-table .ant-pagination-item,
        .bill-table .ant-select-selector {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};