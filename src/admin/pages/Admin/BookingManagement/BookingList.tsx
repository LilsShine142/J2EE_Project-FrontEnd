import React, { useState, useEffect } from "react";
import Filter from "../../Admin/Components/Filter";
import { Input, Modal, Spin } from "antd";
import DataTable from "../../Admin/Components/Table/Table";
import AddNewBooking from "./AddNewBooking";
import UpdateBooking from "./UpdateBooking";
import { notification } from 'antd';
import Pagination from "../../Admin/Components/Pagination";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DetailModal from "../../Admin/Components/ModalForm/DetailModal";
import { type BookingDTO } from '../../../../service/bookingService';
import { useBooking } from '../../../../hooks/useBookings';
import Cookies from 'js-cookie';

export interface StatusOption {
  id: string;
  description: string;
  code: string;
}

const BookingList: React.FC = () => {
  
  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }

  const [data, setData] = useState<BookingDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({
    statusId: "",
  });

  const token = Cookies.get('authToken') || '';
  const { useAllBookings, useDelete } = useBooking(token);

  // Các status có thể có cho booking (dựa trên statusId từ API)
  const statusOptions: StatusOption[] = [
    {
      id: "3",
      description: "Chờ xác nhận",
      code: "Pending",
    },
    {
      id: "4",
      description: "Đã xác nhận",
      code: "Confirmed",
    },
    {
      id: "5",
      description: "Đã hủy",
      code: "Cancelled",
    },
    {
      id: "6",
      description: "Hoàn thành",
      code: "Completed",
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "statusId",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      values: statusOptions.map((item) => ({
        value: String(item.id),
        label: item.description,
      })),
    },
  ];

  const statusId = filters.statusId ? Number(filters.statusId) : undefined;

  const {
    data: pageData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAllBookings(
    currentPage - 1, 
    itemsPerPage, 
    statusId,
    searchQuery
  );

  const deleteBookingMutation = useDelete();

  // Extract data từ pageData
  const bookingsData = pageData?.content ?? [];
  const fetchedTotalItems = pageData?.totalElements ?? 0;
  const fetchedTotalPages = pageData?.totalPages ?? 1;

  useEffect(() => {
    if (pageData) {
      setData(bookingsData);
      setTotalItems(fetchedTotalItems);
      setTotalPages(fetchedTotalPages);
      setIsInitialLoad(false);
    }
  }, [pageData, bookingsData, fetchedTotalItems, fetchedTotalPages]);
    
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [filters.statusId, searchQuery]);

  // Chỉ hiển thị loading khi lần đầu load
  if (isLoading && isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu!
        <button onClick={() => refetch()} className="ml-2 text-blue-500 underline">
          Thử lại
        </button>
      </div>
    );
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      statusId: "",
    });
    setSearchQuery("");
  };
  
  const handleView = (id: number) => {
    const booking = data.find((b) => b.bookingID === id);
    if (booking) {
      setSelectedBooking(booking);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: number) => {
    const booking = data.find((b) => b.bookingID === id);
    if (booking) {
      setSelectedBooking(booking);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa đặt bàn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBookingMutation.mutateAsync(id);
          refetch();
        } catch (error) {
          console.error('Delete error:', error);
        }
      },
    });
  };

  const handleAddBooking = async (bookingData: any) => {
    try {
      console.log("Adding booking:", bookingData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã thêm đặt bàn mới thành công!',
      });
      refetch();
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm đặt bàn!',
      });
      throw error;
    }
  };

  const handleUpdateBooking = async (bookingData: any) => {
    try {
      console.log("Updating booking:", bookingData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã cập nhật đặt bàn thành công!',
      });
      
      setShowEditModal(false);
      setSelectedBooking(null);
      refetch();
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật đặt bàn!',
      });
      throw error;
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 3: // Pending
        return 'bg-yellow-100 text-yellow-800';
      case 4: // Confirmed
        return 'bg-blue-100 text-blue-800';
      case 5: // Cancelled
        return 'bg-red-100 text-red-800';
      case 6: // Completed
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statusId: number) => {
    const option = statusOptions.find(s => Number(s.id) === statusId);
    return option?.description || 'Không xác định';
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    { 
      key: "bookingID", 
      label: "ID",
      render: (row: BookingDTO) => (
        <span className="font-mono text-sm">{row.bookingID}</span>
      )
    },
    {
      key: "userName", 
      label: "Khách hàng",
      render: (row: BookingDTO) => (
        <div>
          <div className="font-medium">{row.userName || `User #${row.userID}`}</div>
          <div className="text-sm text-gray-500">ID: {row.userID}</div>
        </div>
      )
    },
    {
      key: "tableName", 
      label: "Bàn",
      render: (row: BookingDTO) => (
        <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
          {row.tableName}
        </span>
      )
    },
    {
      key: "bookingDate", 
      label: "Thời gian",
      render: (row: BookingDTO) => (
        <div>
          <div className="font-medium">{new Date(row.bookingDate).toLocaleDateString('vi-VN')}</div>
          <div className="text-sm text-gray-500">
            {formatDateTime(row.startTime)} - {formatDateTime(row.endTime)}
          </div>
        </div>
      )
    },
    {
      key: "numberOfGuests", 
      label: "Số khách",
      render: (row: BookingDTO) => (
        <span className="font-semibold">{row.numberOfGuests} người</span>
      )
    },
    {
      key: "initialPayment", 
      label: "Đặt cọc",
      render: (row: BookingDTO) => (
        <span className="font-semibold text-green-600">
          {row.initialPayment ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.initialPayment) : '-'}
        </span>
      )
    },
    {
      key: "paymentMethod", 
      label: "Thanh toán",
      render: (row: BookingDTO) => (
        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
          {row.paymentMethod || '-'}
        </span>
      )
    },
    {
      key: "statusId", 
      label: "Trạng thái",
      render: (row: BookingDTO) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(row.statusId)}`}>
          {getStatusText(row.statusId)}
        </span>
      )
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row: BookingDTO) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.bookingID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            title="Xem chi tiết"
          >
            <FaEye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.bookingID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.bookingID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
            title="Xóa"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  const bookingDetailColumns = [
    { label: "ID", key: "bookingID" },
    { label: "User ID", key: "userID" },
    { label: "Tên khách hàng", key: "userName" },
    { label: "Bàn", key: "tableName" },
    { 
      label: "Ngày đặt", 
      key: "bookingDate",
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN')
    },
    { 
      label: "Giờ bắt đầu", 
      key: "startTime",
      render: (value: string) => formatDateTime(value)
    },
    { 
      label: "Giờ kết thúc", 
      key: "endTime",
      render: (value: string) => formatDateTime(value)
    },
    { label: "Số khách", key: "numberOfGuests" },
    { 
      label: "Đặt cọc", 
      key: "initialPayment",
      render: (value: number) => value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '-'
    },
    { label: "Phương thức thanh toán", key: "paymentMethod" },
    { 
      label: "Trạng thái", 
      key: "statusId",
      render: (value: number) => getStatusText(value)
    },
    { label: "Ghi chú", key: "notes" },
    { 
      label: "Ngày tạo", 
      key: "createdAt",
      render: (value: string) => formatDateTime(value)
    },
    { 
      label: "Cập nhật lần cuối", 
      key: "updatedAt",
      render: (value: string) => formatDateTime(value)
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách đặt bàn</h2>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo ID, tên khách, bàn..."
            className="w-full"
            size="large"
          />
        </div>
        <Filter
          filters={filters}
          options={filterOptions}
          onFilterChange={handleInputChange}
          onReset={handleReset}
        />
      </div>

      <AddNewBooking 
        onAdd={handleAddBooking}
        statusOptions={statusOptions}
      />

      <div className="bg-white rounded-lg border overflow-hidden relative">
        {/* Loading overlay khi đang fetch */}
        {isFetching && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        
        {/* Table với transition mượt */}
        <div className="transition-opacity duration-300" style={{ opacity: isFetching ? 0.5 : 1 }}>
          <DataTable
            columns={columns}
            data={(data ?? []).map(booking => ({ ...booking, id: booking.bookingID }))}
            onSort={() => {}}
            sortConfig={{ key: '', direction: 'ascending' }}
          />
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} đặt bàn
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <UpdateBooking
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBooking(null);
        }}
        onUpdate={handleUpdateBooking}
        bookingData={selectedBooking}
        statusOptions={statusOptions}
      />

      <DetailModal<BookingDTO>
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBooking(null);
        }}
        title="Chi tiết đặt bàn"
        data={selectedBooking}
        columns={bookingDetailColumns}
      />
    </div>
  );
};

export default BookingList;