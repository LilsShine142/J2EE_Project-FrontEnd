import React, { useState, useEffect } from "react";
import { Input, Modal, notification } from "antd";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../Components/Pagination";
import Filter from "../../Components/Filter";
import DataTable from "../../Components/Table/Table";
//import UpdateTableType from "./UpdateTableType";
import DetailModal from "../../Components/ModalForm/DetailModal";
import AddNewTableType from "./addNewTableType";
import UpdateTableType from "./updateTableType";

// --- Fake data ---
const FakeTableTypeData = [
  {
    TableTypeId: 1,
    TypeName: "Loại bàn VIP",
    Capacity: 8,
    CreatedAt: "2023-10-01T10:00:00Z",
    UpdatedAt: "2023-10-05T12:00:00Z",
  },
  {
    TableTypeId: 2,
    TypeName: "Loại bàn Thường",
    Capacity: 4,
    CreatedAt: "2023-10-02T11:00:00Z",
    UpdatedAt: "2023-10-06T13:00:00Z",
  },
  {
    TableTypeId: 3,
    TypeName: "Loại bàn Ngoài trời",
    Capacity: 6,
    CreatedAt: "2023-10-03T12:00:00Z",
    UpdatedAt: "2023-10-07T14:00:00Z",
  },
  {
    TableTypeId: 4,
    TypeName: "Loại bàn Gia đình",
    Capacity: 10,
    CreatedAt: "2023-10-04T13:00:00Z",
    UpdatedAt: "2023-10-08T15:00:00Z",
  },
];

const TableTypeList: React.FC = () => {
  interface TableType {
    TableTypeId: number;
    TypeName: string;
    Capacity: number;
    CreatedAt: string;
    UpdatedAt: string;
  }

  const [data, setData] = useState<TableType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState<TableType | null>(
    null
  );
  const [api, contextHolder] = notification.useNotification();

  const itemsPerPage = 2;

  // --- Bộ lọc ---
  const filterOptions = [
    {
      key: "capacity",
      label: "Sức chứa",
      type: "select" as const,
      placeholder: "Chọn sức chứa",
      values: [
        { value: ">=6", label: "≥ 6 người" },
        { value: "<6", label: "< 6 người" },
      ],
    },
  ];

  // --- Lọc + Tìm kiếm ---
  useEffect(() => {
    const filtered = FakeTableTypeData.filter((item) => {
      const matchSearch = item.TypeName.toLowerCase().includes(
        searchQuery.toLowerCase()
      );

      let matchCapacity = true;
      if (capacityFilter === ">=6") matchCapacity = item.Capacity >= 6;
      if (capacityFilter === "<6") matchCapacity = item.Capacity < 6;

      return matchSearch && matchCapacity;
    });

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setData(filtered.slice(start, end));
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchQuery, capacityFilter, currentPage]);

  // --- Handlers ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCapacityFilter(e.target.value);

  const handleReset = () => {
    setSearchQuery("");
    setCapacityFilter("");
    setCurrentPage(1);
  };

  const handleAddTableType = async (tableData: TableType): Promise<void> => {
    setData((prev) => [...prev, tableData]);
    api.success({
      message: "Thành công",
      description: "Đã thêm loại bàn mới!",
    });
  };

  const handleEdit = (id: number) => {
    const found = FakeTableTypeData.find((t) => t.TableTypeId === id);
    if (found) {
      setSelectedTableType(found);
      setShowEditModal(true);
    }
  };

  const handleUpdateTableType = async (
    updatedData: TableType
  ): Promise<void> => {
    setData((prev) =>
      prev.map((t) =>
        t.TableTypeId === updatedData.TableTypeId ? updatedData : t
      )
    );
    api.success({
      message: "Thành công",
      description: "Đã cập nhật loại bàn!",
    });
    setShowEditModal(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa loại bàn này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setData((prev) => prev.filter((t) => t.TableTypeId !== id));
        api.success({
          message: "Đã xóa thành công",
          description: "Loại bàn đã được xóa khỏi danh sách.",
        });
      },
    });
  };

  const handleView = (id: number) => {
    const found = FakeTableTypeData.find((t) => t.TableTypeId === id);
    if (found) {
      setSelectedTableType(found);
      setShowViewModal(true);
    }
  };

  // --- Columns ---
  const columns = [
    { key: "TableTypeId", label: "ID" },
    { key: "TypeName", label: "Tên loại bàn" },
    {
      key: "Capacity",
      label: "Sức chứa",
      render: (row: TableType) => `${row.Capacity} người`,
    },
    {
      key: "CreatedAt",
      label: "Ngày tạo",
      render: (row: TableType) =>
        new Date(row.CreatedAt).toLocaleString("vi-VN"),
    },
    {
      key: "UpdatedAt",
      label: "Ngày cập nhật",
      render: (row: TableType) =>
        new Date(row.UpdatedAt).toLocaleString("vi-VN"),
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row: TableType) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleView(row.TableTypeId)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <FaEye className="w-3 h-3" /> Xem
          </button>
          <button
            onClick={() => handleEdit(row.TableTypeId)}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
          >
            <FaEdit className="w-3 h-3" /> Sửa
          </button>
          <button
            onClick={() => handleDelete(row.TableTypeId)}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            <FaTrash className="w-3 h-3" /> Xóa
          </button>
        </div>
      ),
    },
  ];

  // --- Columns cho DetailModal ---
  const tableTypeDetailColumns = [
    { label: "ID", key: "TableTypeId" },
    { label: "Tên loại bàn", key: "TypeName" },
    { label: "Sức chứa", key: "Capacity" },
    {
      label: "Ngày tạo",
      key: "CreatedAt",
      render: (val: string) => new Date(val).toLocaleString("vi-VN"),
    },
    {
      label: "Ngày cập nhật",
      key: "UpdatedAt",
      render: (val: string) => new Date(val).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách loại bàn</h2>

      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo tên loại bàn..."
            size="large"
          />
        </div>

        <Filter
          filters={{ capacity: capacityFilter }}
          options={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Add Button */}
      <AddNewTableType onAdd={handleAddTableType} />

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data.map((t) => ({ ...t, id: t.TableTypeId }))}
          onSort={() => {}}
          sortConfig={{ key: "", direction: "ascending" }}
        />

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} loại bàn
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals */}
      <UpdateTableType
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateTableType}
        tableTypeData={selectedTableType}
      />

      <DetailModal<TableType>
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Chi tiết loại bàn"
        data={selectedTableType}
        columns={tableTypeDetailColumns}
      />
    </div>
  );
};

export default TableTypeList;
