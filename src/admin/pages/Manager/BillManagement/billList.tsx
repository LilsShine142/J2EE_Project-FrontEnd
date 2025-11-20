import React, { useState } from "react";
import { Button, Space, message } from "antd";
import { Plus, Receipt, RefreshCw } from "lucide-react";
import { useBill } from "../../../../hooks/useBill";
import { BillTable } from "../../../components/BillForm/BillTable";
import { BillTableFilters } from "../../../components/BillForm/BillTableFilters";
import type { BillDTO } from "../../../../service/billService";
import type { BillFilterParams } from "../../../../types/bill";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../../css/BillForm-list.css";
import BillDetailView from "./billDetailView";

const BillList: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useBills } = useBill(token);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<BillFilterParams>({});
  const [selectedBill, setSelectedBill] = useState<BillDTO | null>(null);

  const { data: billsData, isLoading, refetch } = useBills(
    currentPage,
    pageSize,
    filters.search,
    filters.statusId,
    filters.userId,
    filters.tableId
  );

  const handleViewDetail = (bill: BillDTO) => {
    setSelectedBill(bill);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(0);
  };

  const handleStatusFilter = (value: number | undefined) => {
    setFilters((prev) => ({ ...prev, statusId: value }));
    setCurrentPage(0);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  const handleRefresh = () => {
    setFilters({});
    refetch();
    message.success("Đã làm mới danh sách!");
  };

  const handleCloseDetail = () => {
    setSelectedBill(null);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý hóa đơn</h2>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate("/admin/bills/add")}
            size="large"
          >
            Xuất hóa đơn
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
      <BillTableFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />

      {/* Table */}
      <BillTable
        data={billsData?.content || []}
        loading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalElements={billsData?.totalElements || 0}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
      />

      {/* Detail View Overlay */}
      {selectedBill && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-200 ease-out animate-in fade-in"
            onClick={handleCloseDetail}
          />
          
          {/* Content Container - Fixed center, không scroll */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-4xl max-h-[90vh] pointer-events-auto transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2"
              onClick={(e) => e.stopPropagation()}
            >
              <BillDetailView bill={selectedBill} onClose={handleCloseDetail} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillList;