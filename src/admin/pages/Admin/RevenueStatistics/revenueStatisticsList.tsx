import React, { useState } from "react";
import { Table, Select, Button, Modal } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { Eye } from "lucide-react";

const { Option } = Select;

/* -------------------- Fake data -------------------- */
const fakeRevenueData = [
  { month: "Jan", revenue: 32000, orders: 120, profit: 8000 },
  { month: "Feb", revenue: 28000, orders: 110, profit: 7000 },
  { month: "Mar", revenue: 45000, orders: 150, profit: 12000 },
  { month: "Apr", revenue: 52000, orders: 180, profit: 14000 },
  { month: "May", revenue: 61000, orders: 200, profit: 18000 },
  { month: "Jun", revenue: 58000, orders: 190, profit: 16000 },
  { month: "Jul", revenue: 67000, orders: 210, profit: 19000 },
  { month: "Aug", revenue: 70000, orders: 230, profit: 20000 },
  { month: "Sep", revenue: 64000, orders: 220, profit: 17500 },
  { month: "Oct", revenue: 72000, orders: 240, profit: 21000 },
  { month: "Nov", revenue: 76000, orders: 250, profit: 23000 },
  { month: "Dec", revenue: 82000, orders: 270, profit: 25000 },
];

const currencyVN = (v: number) => v.toLocaleString("vi-VN") + " ₫";

const RevenueDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const filteredData =
    selectedMonth === "All"
      ? fakeRevenueData
      : fakeRevenueData.filter((d) => d.month === selectedMonth);

  const totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = filteredData.reduce((s, d) => s + d.orders, 0);
  const totalProfit = filteredData.reduce((s, d) => s + d.profit, 0);
  const totalCustomers = Math.round(totalOrders * 0.8);

  // ✅ Tách riêng state cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record); // Lưu record để hiển thị modal
    setIsModalOpen(true);
  };

  const tableColumns = [
    { title: "Tháng", dataIndex: "month", key: "month" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center" as const,
      render: (val: number) => currencyVN(val),
    },
    {
      title: "Đơn hàng",
      dataIndex: "orders",
      key: "orders",
      align: "center" as const,
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      align: "center" as const,
      render: (val: number) => currencyVN(val),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (record: any) => (
        <button
          onClick={() => handleViewDetails(record)}
          className="flex items-center justify-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
        >
          <Eye className="w-3 h-3 items-center justify-center" /> Xem
        </button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
      align: "center" as const,
    },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right" as const,
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      align: "center" as const,
    },
  ];

  const fakeOrderDetails = [
    {
      orderId: 101,
      customer: "Nguyễn Văn A",
      total: 500000,
      date: "2025-05-10",
    },
    { orderId: 102, customer: "Trần Thị B", total: 350000, date: "2025-05-11" },
    { orderId: 103, customer: "Phạm Văn C", total: 470000, date: "2025-05-12" },
  ];

  return (
    <div className="p-6">
      <div className="bg-white border rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            📊 Thống kê doanh thu
          </h1>
          <div className="flex items-center gap-2">
            <Select
              value={selectedYear}
              onChange={(v) => {
                setSelectedYear(v);
                setSelectedMonth("All");
              }}
              className="min-w-[120px]"
            >
              {[2023, 2024, 2025].map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>

            <Select
              value={selectedMonth}
              onChange={(v) => setSelectedMonth(v)}
              className="min-w-[140px]"
            >
              <Option value="All">Tất cả tháng</Option>
              {fakeRevenueData.map((d) => (
                <Option key={d.month} value={d.month}>
                  {d.month}
                </Option>
              ))}
            </Select>

            <Button type="primary">Lọc</Button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Tổng doanh thu</div>
              <FaDollarSign className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {currencyVN(totalRevenue)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Tổng đơn hàng</div>
              <FaShoppingCart className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {totalOrders}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Khách hàng</div>
              <FaUsers className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {totalCustomers}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Lợi nhuận</div>
              <FaChartLine className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-700">
              {currencyVN(totalProfit)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Doanh thu theo tháng
          </h2>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fakeRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000) | 0}k`} />
                <ReTooltip formatter={(v: number) => currencyVN(v)} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng tổng hợp */}
        <div className="p-4 rounded-lg bg-white border shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Bảng tổng hợp doanh thu
            </h3>
            <div className="text-sm text-gray-500">
              Dữ liệu:{" "}
              {selectedMonth === "All"
                ? `Năm ${selectedYear}`
                : `${selectedMonth} ${selectedYear}`}
            </div>
          </div>

          <Table
            dataSource={filteredData}
            columns={tableColumns}
            pagination={false}
            rowKey="month"
            bordered
            size="middle"
          />

          {/* Modal chi tiết */}
          <Modal
            title={
              selectedRecord
                ? `Chi tiết doanh thu tháng ${selectedRecord.month}`
                : "Chi tiết doanh thu"
            }
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={700}
          >
            <Table
              columns={detailColumns}
              dataSource={fakeOrderDetails}
              rowKey="orderId"
              pagination={false}
              size="small"
            />
          </Modal>

          {/* Tổng kết */}
          <div className="mt-3 flex justify-end space-x-6 text-sm">
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500">Tổng Doanh thu</div>
              <div className="font-semibold text-gray-800">
                {currencyVN(totalRevenue)}
              </div>
            </div>
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500">Tổng Đơn</div>
              <div className="font-semibold text-gray-800">{totalOrders}</div>
            </div>
            <div className="px-3 py-2 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500">Tổng Lợi nhuận</div>
              <div className="font-semibold text-gray-800">
                {currencyVN(totalProfit)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
