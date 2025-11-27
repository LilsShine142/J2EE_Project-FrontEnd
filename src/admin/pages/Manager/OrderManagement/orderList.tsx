import React, { useState, useEffect } from "react";
import Filter from "../../Admin/Components/Filter";
import { Input, Modal, Spin, Tag } from "antd";
import DataTable from "../../Admin/Components/Table/Table";
import AddNewOrder from "./addNewOrder";
import UpdateOrder from "./updateOrder";
import { notification } from 'antd';
import Pagination from "../../Admin/Components/Pagination";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DetailModal from "../../Admin/Components/ModalForm/DetailModal";
import { useCurrentUser, useCustomersForOrder } from "../../../../hooks/useUserHooks";
import { 
  type OrderDTO,
  type MealOption,
  type TableOption,
  type UserOption,
  getAvailableMealsForOrder,
  getAvailableTablesForOrder,
} from '../../../../service/orderService';
import { useOrder } from '../../../../hooks/useOrder';
import { ORDER_STATUS_OPTIONS } from '../../../../lib/constants/constants';
import Cookies from 'js-cookie';
import ActionButtons from "../../../components/PermissionButton/ActionButtons";
import { usePermission } from "../../../../hooks/usePermissions";

const OrderList: React.FC = () => {
  
  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }

  const [data, setData] = useState<OrderDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Data for forms
  const [meals, setMeals] = useState<MealOption[]>([]);
  const [tables, setTables] = useState<TableOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  const [filters, setFilters] = useState({
    statusId: "",
  });

  const { data: user } = useCurrentUser();
  const token = Cookies.get("authToken") || "";
  const { getMyPermissions } = usePermission(token);
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const { useAllOrders, useDeleteOrder } = useOrder(token);

  // Use hook for customers
  const {
    data: customersData,
    isLoading: loadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useCustomersForOrder(token);

  // Sync users from hook
  useEffect(() => {
    if (customersData) {
      setUsers(customersData);
    }
  }, [customersData]);

  // Handle users error
  useEffect(() => {
    if (usersError) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách khách hàng',
      });
      setUsers([]);
    }
  }, [usersError]);

  const filterOptions: FilterOption[] = [
    {
      key: "statusId",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      values: ORDER_STATUS_OPTIONS.map((item) => ({
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
  } = useAllOrders(
    currentPage - 1,
    itemsPerPage,
    searchQuery,
    statusId
  );

  const deleteOrderMutation = useDeleteOrder();

  const ordersData = pageData?.content ?? [];
  const fetchedTotalItems = pageData?.totalElements ?? 0;
  const fetchedTotalPages = pageData?.totalPages ?? 1;

  useEffect(() => {
    if (pageData) {
      setData(ordersData);
      setTotalItems(fetchedTotalItems);
      setTotalPages(fetchedTotalPages);
      setIsInitialLoad(false);
    }
  }, [pageData, ordersData, fetchedTotalItems, fetchedTotalPages]);
    
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [filters.statusId, searchQuery]);

  // Load form data (without users - handled by hook)
  const loadFormData = async () => {
    await Promise.all([
      loadMeals(),
      loadTables(),
    ]);
    // Refetch users to ensure fresh data
    refetchUsers();
  };

  const loadMeals = async () => {
    setLoadingMeals(true);
    try {
      const data = await getAvailableMealsForOrder(token);
      setMeals(data);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tải danh sách món ăn',
      });
    } finally {
      setLoadingMeals(false);
    }
  };

  const loadTables = async () => {
    setLoadingTables(true);
    try {
      const data = await getAvailableTablesForOrder(token);
      setTables(data);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Không thể tải danh sách bàn',
      });
    } finally {
      setLoadingTables(false);
    }
  };

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
    const order = data.find((o) => o.orderID === id);
    if (order) {
      setSelectedOrder(order);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: number) => {
    const order = data.find((o) => o.orderID === id);
    if (order) {
      setSelectedOrder(order);
      setShowEditModal(true);
      loadFormData(); // Load data when opening edit modal
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận hủy',
      content: 'Bạn có chắc muốn hủy đơn hàng này? (Chỉ được hủy trong vòng 2 giờ)',
      okText: 'Hủy đơn',
      cancelText: 'Đóng',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteOrderMutation.mutateAsync(id);
          refetch();
        } catch (error) {
          console.error('Delete error:', error);
        }
      },
    });
  };

  const handleAddOrder = async () => {
    refetch();
  };

  const handleUpdateOrder = async () => {
    setShowEditModal(false);
    setSelectedOrder(null);
    refetch();
  };

  const handleUserAdded = (newUser: UserOption) => {
    // Add new user to local state
    setUsers(prev => [newUser, ...prev]);
    // Refetch to get fresh data from server
    refetchUsers();
  };

  const getStatusColor = (statusId: number) => {
    const status = ORDER_STATUS_OPTIONS.find(s => s.id === statusId);
    return status?.color || 'default';
  };

  const getStatusText = (statusId: number) => {
    const option = ORDER_STATUS_OPTIONS.find(s => s.id === statusId);
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

  const calculateTotal = (order: OrderDTO) => {
    return order.orderDetails?.reduce((sum, detail) => sum + detail.subTotal, 0) || 0;
  };
  
    useEffect(() => {
      if (user && user.roleId && (user.roleId === 2 || user.roleId === 3)) {
        getMyPermissions(token)
          .then((perms) => {
            const codes = perms.map((p: any) => p.permissionName).filter(Boolean);
            setMyPermissions(codes);
          })
          .catch((err) => {
            console.error("Lỗi lấy permission:", err);
            setMyPermissions([]);
          });
      } else {
        setMyPermissions([]);
      }
      console.log("My Permissions:", myPermissions);
    }, [token, user]);
  
    const hasPermission = (code: string) => myPermissions.includes(code);

  const columns = [
    { 
      key: "orderID", 
      label: "Mã ĐH",
      render: (row: OrderDTO) => (
        <span className="font-mono text-sm font-semibold">#{row.orderID}</span>
      )
    },
    {
      key: "userName", 
      label: "Khách hàng",
      render: (row: OrderDTO) => (
        <div>
          <div className="font-medium">{row.userName}</div>
          <div className="text-xs text-gray-500">ID: {row.userID}</div>
        </div>
      )
    },
    {
      key: "tableName", 
      label: "Bàn",
      render: (row: OrderDTO) => (
        <Tag color="purple">{row.tableName}</Tag>
      )
    },
    {
      key: "orderDetails", 
      label: "Món ăn",
      render: (row: OrderDTO) => (
        <div className="max-w-xs">
          {row.orderDetails?.slice(0, 2).map((detail, idx) => (
            <div key={idx} className="text-xs text-gray-600">
              • {detail.mealName} x{detail.quantity}
            </div>
          ))}
          {row.orderDetails?.length > 2 && (
            <div className="text-xs text-blue-600">
              +{row.orderDetails.length - 2} món khác...
            </div>
          )}
        </div>
      )
    },
    {
      key: "totalAmount", 
      label: "Tổng tiền",
      render: (row: OrderDTO) => (
        <span className="font-semibold text-green-600">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal(row))}
        </span>
      )
    },
    {
      key: "orderDate", 
      label: "Thời gian đặt",
      render: (row: OrderDTO) => (
        <div className="text-sm">{formatDateTime(row.orderDate)}</div>
      )
    },
    {
      key: "statusId", 
      label: "Trạng thái",
      render: (row: OrderDTO) => (
        <Tag color={getStatusColor(row.statusId)}>
          {getStatusText(row.statusId)}
        </Tag>
      )
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row: OrderDTO) => (
        <ActionButtons
          onView={() => handleView(row.orderID)}
          onEdit={() => handleEdit(row.orderID)}
          onDelete={() => handleDelete(row.orderID)}
          permissions={{
            canView: true,
            canEdit: hasPermission("UPDATE_ORDER"),
            canDelete: hasPermission("DELETE_ORDER"),
          }}
        />
      ),
    },
  ];

  const orderDetailColumns = [
    { label: "Mã đơn hàng", key: "orderID" },
    { label: "Khách hàng", key: "userName" },
    { label: "Bàn", key: "tableName" },
    { 
      label: "Booking ID", 
      key: "bookingID",
      render: (value: number | null) => value || '-'
    },
    { 
      label: "Thời gian đặt", 
      key: "orderDate",
      render: (value: string) => formatDateTime(value)
    },
    { 
      label: "Trạng thái", 
      key: "statusId",
      render: (value: number) => getStatusText(value)
    },
    { 
      label: "Tổng tiền", 
      key: "totalAmount",
      render: (_: any, row: OrderDTO) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal(row))
    },
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
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách đơn hàng</h2>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo mã ĐH, tên khách, bàn..."
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

      <AddNewOrder 
        onAdd={handleAddOrder}
        meals={meals}
        tables={tables}
        users={users}
        loadingMeals={loadingMeals}
        loadingTables={loadingTables}
        loadingUsers={loadingUsers}
        onLoadFormData={loadFormData}
        onUserAdded={handleUserAdded}
        disabled={!hasPermission("ADD_ORDER")}
      />

      <div className="bg-white rounded-lg border overflow-hidden relative">
        {isFetching && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        
        <div className="transition-opacity duration-300" style={{ opacity: isFetching ? 0.5 : 1 }}>
          <DataTable
            columns={columns}
            data={(data ?? []).map(order => ({ ...order, id: order.orderID }))}
            onSort={() => {}}
            sortConfig={{ key: '', direction: 'ascending' }}
          />
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} đơn hàng
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <UpdateOrder
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOrder(null);
        }}
        onUpdate={handleUpdateOrder}
        orderData={selectedOrder}
        meals={meals}
        tables={tables}
        users={users}
        loadingMeals={loadingMeals}
        loadingTables={loadingTables}
        loadingUsers={loadingUsers}
      />

      <DetailModal<OrderDTO>
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedOrder(null);
        }}
        title="Chi tiết đơn hàng"
        data={selectedOrder}
        columns={orderDetailColumns}
      />
    </div>
  );
};

export default OrderList;