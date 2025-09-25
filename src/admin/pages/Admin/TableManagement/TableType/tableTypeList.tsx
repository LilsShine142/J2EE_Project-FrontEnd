import React, { useState, useMemo } from "react";
import { Input, Table, Select, Button } from "antd";
import Pagination from "../../Components/Pagination";

const { Option } = Select;
// --- Fake Data ---
const FakeTableTypeData = [
  {
    TableTypeId: 1,
    TypeName: "Loại bàn VIP",
    Capcity: 8,
    CreatedAt: "2023-10-01T10:00:00Z",
    UpdatedAt: "2023-10-05T12:00:00Z",
  },
  {
    TableTypeId: 2,
    TypeName: "Loại bàn Thường",
    Capcity: 4,
    CreatedAt: "2023-10-02T11:00:00Z",
    UpdatedAt: "2023-10-06T13:00:00Z",
  },
  {
    TableTypeId: 3,
    TypeName: "Loại bàn Ngoài trời",
    Capcity: 6,
    CreatedAt: "2023-10-03T12:00:00Z",
    UpdatedAt: "2023-10-07T14:00:00Z",
  },
];

const TableTypeList: React.FC = () => {
  interface TableType {
    TableTypeId: number;
    TypeName: string;
    Capcity: number;
    CreatedAt: string;
    UpdatedAt: string;
  }

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Columns ---
  const columns = [
    { title: "Id Loại bàn", dataIndex: "TableTypeId", key: "TableTypeId" },
    { title: "Tên Loại bàn", dataIndex: "TypeName", key: "TypeName" },
    { title: "Sức chứa", dataIndex: "Capcity", key: "Capcity" },
    { title: "Ngày tạo", dataIndex: "CreatedAt", key: "CreatedAt" },
    { title: "Ngày cập nhật", dataIndex: "UpdatedAt", key: "UpdatedAt" },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: TableType) => (
        <span>
          <Button
            style={{ marginRight: 16, backgroundColor: "blue", color: "white" }}
            href={`/admin/table-types/edit/${record.TableTypeId}`}
          >
            Sửa
          </Button>
          <Button
            style={{ backgroundColor: "red", color: "white" }}
            type="link"
            href={`/admin/table-types/delete/${record.TableTypeId}`}
          >
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  // --- Logic filter + search ---
  const filteredData = useMemo(() => {
    return FakeTableTypeData.filter((table) => {
      const matchSearch = table.TypeName.toLowerCase().includes(
        searchQuery.toLowerCase()
      );

      let matchCapacity = true;
      if (capacityFilter === "≥6") matchCapacity = table.Capcity >= 6;
      if (capacityFilter === "<6") matchCapacity = table.Capcity < 6;

      return matchSearch && matchCapacity;
    });
  }, [searchQuery, capacityFilter]);

  // --- Pagination ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Reset ---
  const handleReset = () => {
    setSearchQuery("");
    setCapacityFilter(null);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách loại bàn</h2>

      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-black">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm kiếm theo tên loại bàn..."
          className="w-full md:w-1/2 border border-gray-300 -mb-[6px]"
          size="large"
        />

        <Select
          value={capacityFilter || undefined}
          onChange={(value) => {
            setCapacityFilter(value);
            setCurrentPage(1);
          }}
          allowClear
          placeholder="Chọn sức chứa"
          style={{ width: 200 }}
        >
          <Option value="≥6">≥ 6</Option>
          <Option value="<6">&lt; 6</Option>
        </Select>

        <Button onClick={handleReset}>Reset</Button>
      </div>

      {/* Bảng */}
      <div className="relative mt-4">
        <Table
          columns={columns}
          dataSource={paginatedData.map((table) => ({
            ...table,
            key: table.TableTypeId,
          }))}
          pagination={false}
          bordered
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
    </div>
  );
};

export default TableTypeList;
