import React, { useState } from "react";
import { Tooltip, Modal, Select, Table } from "antd";
import { MdTableBar } from "react-icons/md";

const FakeTableTypeData = [
  { TableTypeId: 1, TypeName: "Loại bàn VIP" },
  { TableTypeId: 2, TypeName: "Loại bàn Thường" },
  { TableTypeId: 3, TypeName: "Loại bàn Ngoài trời" },
];

const FakeTableData = [
  {
    TableID: 1,
    TableName: "Bàn VIP 1",
    Location: "Tầng 1",
    Status: "Đang trống",
    TableTypeID: 1,
  },
  {
    TableID: 2,
    TableName: "Bàn VIP 2",
    Location: "Tầng 1",
    Status: "Đã đặt",
    TableTypeID: 1,
  },
  {
    TableID: 3,
    TableName: "Bàn Thường 1",
    Location: "Tầng 2",
    Status: "Đang phục vụ",
    TableTypeID: 2,
  },
  {
    TableID: 4,
    TableName: "Bàn Thường 2",
    Location: "Tầng 2",
    Status: "Đang trống",
    TableTypeID: 2,
  },
  {
    TableID: 5,
    TableName: "Bàn Ngoài trời 1",
    Location: "Tầng 1",
    Status: "Đã đặt",
    TableTypeID: 3,
  },
  {
    TableID: 6,
    TableName: "Bàn Ngoài trời 2",
    Location: "Tầng 2",
    Status: "Đang trống",
    TableTypeID: 3,
  },
];

const FakeBookingData = [
  {
    BookingID: 101,
    UserID: 1,
    TableID: 2,
    BookingDate: "2025-09-25",
    StartTime: "18:00",
    EndTime: "20:00",
    Status: "Đã đặt",
    Notes: "Khách đặt sinh nhật",
    InitialPayment: 500000,
    PaymentMethod: "Momo",
    PaymentTime: "2025-09-24T12:00:00Z",
    CreatedAt: "2025-09-24T10:00:00Z",
    UpdatedAt: "2025-09-24T11:00:00Z",
  },
];

const FakeOrderDetailData = [
  {
    OrderID: 201,
    MealID: "M001",
    Quantity: 2,
    SubTotal: 200000,
    CreatedAt: "2025-09-25T18:30:00Z",
    UpdatedAt: "2025-09-25T18:40:00Z",
  },
  {
    OrderID: 201,
    MealID: "M002",
    Quantity: 1,
    SubTotal: 150000,
    CreatedAt: "2025-09-25T18:35:00Z",
    UpdatedAt: "2025-09-25T18:45:00Z",
  },
];

const TableList: React.FC = () => {
  const [tables, setTables] = useState(FakeTableData);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const getTypeName = (id: number) =>
    FakeTableTypeData.find((t) => t.TableTypeId === id)?.TypeName || "";

  const getColorByStatus = (status: string) => {
    switch (status) {
      case "Đang trống":
        return "text-green-500";
      case "Đã đặt":
        return "text-yellow-500";
      case "Đang phục vụ":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const floors = ["Tầng 1", "Tầng 2"];

  const filteredTables = tables.filter(
    (t) => t.Location === floors[currentFloor - 1]
  );

  const handleTableClick = (table: any) => {
    setSelectedTable(table);
    setNewStatus(table.Status);
    setModalOpen(true);
  };

  const handleUpdateStatus = () => {
    setTables((prev) =>
      prev.map((t) =>
        t.TableID === selectedTable.TableID ? { ...t, Status: newStatus } : t
      )
    );
    setModalOpen(false);
  };

  const bookingColumns = [
    { title: "BookingID", dataIndex: "BookingID" },
    { title: "UserID", dataIndex: "UserID" },
    { title: "BookingDate", dataIndex: "BookingDate" },
    {
      title: "Time",
      render: (record: any) => `${record.StartTime} - ${record.EndTime}`,
    },
    { title: "Notes", dataIndex: "Notes" },
    {
      title: "Payment",
      render: (record: any) =>
        `${record.InitialPayment} (${record.PaymentMethod})`,
    },
  ];

  const orderDetailColumns = [
    { title: "MealID", dataIndex: "MealID" },
    { title: "Quantity", dataIndex: "Quantity" },
    { title: "SubTotal", dataIndex: "SubTotal" },
    { title: "CreatedAt", dataIndex: "CreatedAt" },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {" "}
      <h2 className="text-2xl font-bold mb-6 text-black">Sơ đồ bàn</h2>{" "}
      <div className="border rounded-lg p-4 bg-gray-50">
        {" "}
        <h3 className="text-lg font-semibold mb-4 text-black">
          {floors[currentFloor - 1]}
        </h3>{" "}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {" "}
          {filteredTables.map((table) => (
            <Tooltip
              key={table.TableID}
              title={
                <div className="text-sm">
                  {" "}
                  <p>
                    <strong>{table.TableName}</strong>
                  </p>{" "}
                  <p>Loại: {getTypeName(table.TableTypeID)}</p>{" "}
                  <p>Tình trạng: {table.Status}</p>{" "}
                </div>
              }
            >
              {" "}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleTableClick(table)}
              >
                {" "}
                <MdTableBar
                  className={`text-5xl transition-transform transform hover:scale-110 ${getColorByStatus(
                    table.Status
                  )}`}
                />{" "}
                <span className="mt-2 text-sm text-black">
                  {table.TableName}
                </span>{" "}
              </div>{" "}
            </Tooltip>
          ))}{" "}
        </div>{" "}
        <div className="flex justify-center mt-6 space-x-2">
          {" "}
          {floors.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFloor(idx + 1)}
              className={`px-4 py-2 rounded-md ${
                currentFloor === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {" "}
              {idx + 1}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      <Modal
        title={`Chi tiết bàn - ${selectedTable?.TableName}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleUpdateStatus}
        okText="Cập nhật"
        cancelText="Hủy"
        width={800}
      >
        {" "}
        <p>Chọn trạng thái mới:</p>{" "}
        <Select
          value={newStatus}
          onChange={(v) => setNewStatus(v)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {" "}
          <Select.Option value="Đang trống">Đang trống</Select.Option>{" "}
          <Select.Option value="Đã đặt">Đã đặt</Select.Option>{" "}
          <Select.Option value="Đang phục vụ">Đang phục vụ</Select.Option>{" "}
        </Select>{" "}
        {selectedTable?.Status === "Đã đặt" && (
          <>
            {" "}
            <h3 className="text-lg font-semibold mb-2">
              Thông tin Booking
            </h3>{" "}
            <Table
              columns={bookingColumns}
              dataSource={FakeBookingData.filter(
                (b) => b.TableID === selectedTable.TableID
              )}
              rowKey="BookingID"
              pagination={false}
              size="small"
            />{" "}
          </>
        )}{" "}
        {selectedTable?.Status === "Đang phục vụ" && (
          <>
            {" "}
            <h3 className="text-lg font-semibold mb-2">Order Details</h3>{" "}
            <Table
              columns={orderDetailColumns}
              dataSource={FakeOrderDetailData}
              rowKey="MealID"
              pagination={false}
              size="small"
            />{" "}
          </>
        )}{" "}
      </Modal>{" "}
    </div>
  );
};

export default TableList;
