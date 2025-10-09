import React, { useState, useEffect } from "react";
import Filter from "../Components/Filter";
import { Input, Modal } from "antd";
import DataTable from "../Components/Table/Table";
import AddNewUser from "./addNewUser"
import UpdateUser from "./updateUser";
import { Button, notification, Space } from 'antd';
import Pagination from "../Components/Pagination";
import MStatusUser from "../../../../lib/constants/constants";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DetailModal from "../Components/ModalForm/DetailModal";

// Dữ liệu giả (fake data) dựa trên bảng Users và liên kết với Roles
const fakeUsers = [
  {
    UserID: 1,
    Email: "nguyenvana@example.com",
    Password: "password123",
    VerifyCode: "ABC123",
    Status: "Verified",
    FullName: "Nguyen Van A",
    JoinDate: "2023-01-15",
    PhoneNumber: "0901234567",
    TotalSpent: 1500000.50,
    LoyaltyPoints: 50,
    StatusWork: "Active",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    role: { RoleID: 1, RoleName: "Admin", Description: "Quản trị viên" },
  },
  {
    UserID: 2,
    Email: "tranthib@example.com",
    Password: "password456",
    VerifyCode: "DEF456",
    Status: "Unverified",
    FullName: "Tran Thi B",
    JoinDate: "2023-02-20",
    PhoneNumber: "0912345678",
    TotalSpent: 800000.00,
    LoyaltyPoints: 20,
    StatusWork: "Inactive",
    role: { RoleID: 2, RoleName: "Staff", Description: "Nhân viên" },
  },
  {
    UserID: 3,
    Email: "levanc@example.com",
    Password: "password789",
    VerifyCode: null,
    Status: "Verified",
    FullName: "Le Van C",
    JoinDate: "2023-03-10",
    PhoneNumber: "0923456789",
    TotalSpent: 2000000.75,
    LoyaltyPoints: 75,
    StatusWork: "Active",
    role: { RoleID: 3, RoleName: "Manager", Description: "Quản lý" },
  },
];

const UserList: React.FC = () => {
  interface User {
    UserID: number;
    Email: string;
    Password: string;
    VerifyCode: string | null;
    Status: string;
    FullName: string;
    JoinDate: string;
    PhoneNumber: string;
    StatusWork: string;
    role: {
      RoleID: number;
      RoleName: string;
      Description: string;
    };
    avatar?: string;
    gender?: string;
  }
  
  interface RoleOption {
    RoleID: number;
    RoleName: string;
    Description: string;
  }

  interface StatusOption {
    id: string;
    description: string;
  }

  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }

  const [data, setData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const itemsPerPage = 2; // Số người dùng hiển thị trên mỗi trang
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });

  const fakeRoleOptions = [
    { RoleID: 1, RoleName: "Admin", Description: "Quản trị viên" },
    { RoleID: 2, RoleName: "Staff", Description: "Nhân viên" },
    { RoleID: 3, RoleName: "Manager", Description: "Quản lý" },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "role",
      label: "Vai trò",
      type: "select",
      placeholder: "Chọn Vai trò",
      values: roleOptions.map((item) => ({
        value: String(item.RoleID),
        label: item.RoleName,
      })),
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn Trạng thái",
      values: statusOptions.map((item) => ({
        value: item.id,
        label: item.description,
      })),
    },
  ];

  // Sử dụng useEffect để tải dữ liệu giả
  useEffect(() => {
    const fetStatusOptions = Object.keys(MStatusUser).map((key) => {
      const statusKey = key as keyof typeof MStatusUser;
      return {
        id: MStatusUser[statusKey].code,
        description: MStatusUser[statusKey].description,
      };
    });
    setStatusOptions(fetStatusOptions);

    // Giả lập tải dữ liệu từ API
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filteredData = fakeUsers.filter((user) => {
      const matchesSearch = user.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.Email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !filters.role || user.role.RoleID === Number(filters.role);
      const matchesStatus = !filters.status || user.Status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });

    console.log("Filtered Data:", filteredData);
    
    setData(filteredData.slice(startIndex, endIndex));
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    setRoleOptions(fakeRoleOptions); // Sử dụng dữ liệu vai trò giả
  }, [filters, currentPage, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    // setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi thay đổi bộ lọc
  };

  const handleReset = () => {
    setFilters({
      role: "",
      status: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };
  
const handleView = (id: number) => {
    const user = fakeUsers.find((u) => u.UserID === id);
    if (user) {
      setSelectedUser(user);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: number) => {
    const user = fakeUsers.find((u) => u.UserID === id);
    if (user) {
      setSelectedUser(user);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa người dùng này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        // Sử dụng id trực tiếp từ tham số hàm
        setData((prevData) => prevData.filter((user) => user.UserID !== id));
        api.success({
          message: 'Thành công',
          description: 'Đã xóa người dùng thành công!',
        });
        setCurrentPage(1);
      },
    });
  };

  const handleAddUser = async (userData: any) => {
    try {
      console.log("Adding user:", userData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã thêm người dùng mới thành công!',
      });
      setData((prevData) => [...prevData, userData]);
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm người dùng!',
      });
      throw error;
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      // In real app, call API to update user
      console.log("Updating user:", userData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã cập nhật người dùng thành công!',
      });
      
      setShowEditModal(false);
      setSelectedUser(null);
      // Refresh data in real app
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật người dùng!',
      });
      throw error;
    }
  };

//   const handleConfirmDelete = () => {
//     setData((prevData) => prevData.filter((user) => user.UserID !== deleteId));
//     toast.success("Xóa người dùng thành công!");
//     setConfirmOpen(false);
//     setDeleteId(null);
  //   };
  
  
const columns = [
    { 
      key: "UserID", 
      label: "ID",
      render: (row: User) => (
        <span className="font-mono text-sm">{row.UserID}</span>
      )
    },
    {
      key: "FullName", 
      label: "Họ và tên",
      render: (row: User) => (
        <div>
          <div className="font-medium">{row.FullName}</div>
          <div className="text-sm text-gray-500">{row.Email}</div>
        </div>
      )
    },
    {
      key: "PhoneNumber", 
      label: "Số điện thoại",
    },
    {
      key: "Status", 
      label: "Trạng thái",
      render: (row: User) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          row.Status === 'Verified' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.Status === 'Verified' ? 'Đã xác minh' : 'Chưa xác minh'}
        </span>
      )
    },
    {
      key: "role", 
      label: "Vai trò",
      render: (row: User) => (
        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {row.role?.RoleName || "Không có"}
        </span>
      )
    },
    {
      key: "StatusWork", 
      label: "Trạng thái làm việc",
      render: (row: User) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          row.StatusWork === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.StatusWork === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row: User) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.UserID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            title="Xem chi tiết"
          >
            <FaEye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.UserID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.UserID);
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

const userColumns = [
        {
        name: "Email",
        label: "Email",
        type: "email" as const,
        required: true,
        placeholder: "Nhập email",
        },
        {
        name: "Password",
        label: "Mật khẩu",
        type: "password" as const,
        required: true,
        placeholder: "Nhập mật khẩu",
        },
        {
        name: "FullName",
        label: "Họ và tên",
        type: "text" as const,
        required: true,
        placeholder: "Nhập họ và tên",
        },
        {
        name: "PhoneNumber",
        label: "Số điện thoại",
        type: "tel" as const,
        required: true,
        placeholder: "Nhập số điện thoại",
        },
        {
        name: "Status",
        label: "Trạng thái",
        type: "select" as const,
        required: true,
        defaultValue: "Unverified",
        options: [
            { label: "Đã xác minh", value: "Verified" },
            { label: "Chưa xác minh", value: "Unverified" },
        ],
        },
        {
        name: "StatusWork",
        label: "Trạng thái làm việc",
        type: "select" as const,
        required: true,
        defaultValue: "Active",
        options: [
            { label: "Hoạt động", value: "Active" },
            { label: "Không hoạt động", value: "Inactive" },
        ],
        },
        {
        name: "RoleID",
        label: "Vai trò",
        type: "select" as const,
        required: true,
        options: roleOptions.map((role) => ({
            label: role.RoleName,
            value: role.RoleID.toString(),
        })),
        },
        {
        name: "gender",
        label: "Giới tính",
        type: "select" as const,
        options: [
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
            { label: "Khác", value: "other" },
        ],
        },
        {
        name: "JoinDate",
        label: "Ngày tham gia",
        type: "date" as const,
        defaultValue: new Date().toISOString().split('T')[0],
        },
        {
        name: "avatar",
        label: "Ảnh đại diện",
        type: "file" as const,
        span: 2 as const,
        },
  ];

// Columns cho DetailModal
  const userDetailColumns = [
    { label: "ID", key: "UserID" },
    { label: "Họ tên", key: "FullName" },
    { label: "Email", key: "Email" },
    { label: "Số điện thoại", key: "PhoneNumber" },
    { 
      label: "Vai trò", 
      key: "role",
      render: (value: User['role']) => value.RoleName 
    },
    { 
      label: "Trạng thái", 
      key: "Status",
      render: (value: string) => value === 'Verified' ? 'Đã xác minh' : 'Chưa xác minh'
    },
    { 
      label: "Trạng thái làm việc", 
      key: "StatusWork",
      render: (value: string) => value === 'Active' ? 'Hoạt động' : 'Không hoạt động'
    },
    { label: "Ngày tham gia", key: "JoinDate" },
   
  ];

  const initialFormData = userColumns.reduce((acc, col) => {
    acc[col.name] = col.defaultValue || "";
    return acc;
  }, {} as { [key: string]: any });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách nhân viên</h2>
      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
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

      {/* Add User Button */}
      <AddNewUser 
        onAdd={handleAddUser}
        initialFormData={initialFormData}
        columns={userColumns}
        roleOptions={roleOptions}
      />

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data.map(user => ({ ...user, id: user.UserID }))}
          onSort={() => {}}
          sortConfig={{ key: '', direction: 'ascending' }}
        />

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} người dùng
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <UpdateUser
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
        userData={selectedUser}
        roleOptions={roleOptions}
      />

      {/* View Modal sử dụng DetailModal */}
      <DetailModal<User>
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        title="Chi tiết người dùng"
        data={selectedUser}
        columns={userDetailColumns}
      />
    </div>
  );
};

export default UserList;