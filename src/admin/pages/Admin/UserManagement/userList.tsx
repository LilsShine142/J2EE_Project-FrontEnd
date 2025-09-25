import React, { useState, useEffect } from "react";
import Filter from "../Components/Filter";
import { Input } from "antd";
import DataTable from "../Components/Table/Table";
// import AddNewUser from "../HumanResourceManagement/Add";
// import EditUser from "../HumanResourceManagement/Edit";
// import ViewUser from "../HumanResourceManagement/View";
import Pagination from "../Components/Pagination";
import MStatusUser from "../../../../lib/constants/constants";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Cookies from "js-cookie";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import ConfirmDialog from "../components/ConfirmDialog";

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
    TotalSpent: number;
    LoyaltyPoints: number;
    StatusWork: string;
    role: {
      RoleID: number;
      RoleName: string;
      Description: string;
    };
    avatar?: string;
    gender?: string;
  }
  
  const [data, setData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null); // Dữ liệu người dùng chọn để sửa
  const itemsPerPage = 5; // Số người dùng hiển thị trên mỗi trang
  interface RoleOption {
    RoleID: number;
    RoleName: string;
    Description: string;
  }
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  interface StatusOption {
    id: string;
    description: string;
  }
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }
  // import type { FilterOption } from "../Components/Filter";

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
      const matchesSearch = user.FullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !filters.role || user.role.RoleID === Number(filters.role);
      const matchesStatus = !filters.status || user.Status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
    setData(filteredData.slice(startIndex, endIndex));
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    setRoleOptions(fakeRoleOptions); // Sử dụng dữ liệu vai trò giả
  }, [filters, currentPage, searchQuery]);

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
      role: "",
      status: "",
    });
  };

const columns = [
  { key: "UserID", label: "ID" },
  {
    key: "Email", 
    label: "Email",
  },
  {
    key: "Password", 
    label: "Mật khẩu",
  },
  {
    key: "VerifyCode", 
    label: "Mã xác minh",
    render: (row: User) => row.VerifyCode || "Chưa có",
  },
  {
    key: "Status", 
    label: "Trạng thái xác minh",
  },
  {
    key: "FullName", 
    label: "Họ và tên",
  },
  {
    key: "JoinDate", 
    label: "Ngày tham gia",
    render: (row: User) => row.JoinDate || "Chưa cập nhật",
  },
  {
    key: "PhoneNumber", 
    label: "Số điện thoại",
  },
  {
    key: "TotalSpent", 
    label: "Tổng chi tiêu",
    render: (row: User) => (row.TotalSpent ? row.TotalSpent.toLocaleString() : "0") + " VND",
  },
  {
    key: "LoyaltyPoints", 
    label: "Điểm thưởng",
    render: (row: User) => row.LoyaltyPoints || 0,
  },
  {
    key: "StatusWork", 
    label: "Trạng thái công việc",
  },
  {
    key: "role", 
    label: "Vai trò",
    render: (row: User) => row.role?.RoleName || "Không có",
  },
  {
    key: "actions",
    label: "Hành Động",
    render: (row: User) => (
      <div className="flex gap-2">
        <button
          // onClick={(e) => {
          //   e.stopPropagation();
          //   handleView(row.UserID);
          // }}
          className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded"
        >
          <FaEye /> Xem
        </button>
        <button
          // onClick={(e) => {
          //   e.stopPropagation();
          //   handleEdit(row.UserID);
          // }}
          className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded"
        >
          <FaEdit /> Sửa
        </button>
        <button
          // onClick={(e) => {
          //   e.stopPropagation();
          //   handleDelete(row.UserID);
          // }}
          className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded"
        >
          <FaTrash /> Xóa
        </button>
      </div>
    ),
  },
];

//   const handleView = async (id: number) => {
//     const token = Cookies.get("authToken");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }
//     // Giả lập lấy dữ liệu chi tiết từ fakeUsers
//     const selectedData = fakeUsers.find((user) => user.UserID === id);
//     if (!selectedData) return;

//     setSelectedUser(selectedData);
//     setShowViewModal(true);
//   };

//   const handleAdd = (newUser: any) => {
//     // Giả lập thêm người dùng mới với ID tăng dần
//     const newId = fakeUsers.length + 1;
//     const userWithId = { ...newUser, UserID: newId, role: fakeRoleOptions[0] };
//     setData((prevData) => [...prevData, userWithId]);
//     toast.success("Thêm người dùng thành công!");
//   };

//   const handleUpdate = (updatedUser: any) => {
//     setData((prevData) =>
//       prevData.map((user) =>
//         user.UserID === updatedUser.UserID ? updatedUser : user
//       )
//     );
//     toast.success("Cập nhật người dùng thành công!");
//   };

//   const handleEdit = (id: number) => {
//     const userToEdit = data.find((user) => user.UserID === id);
//     if (!userToEdit) return;

//     setSelectedEmployee({
//       ...userToEdit,
//     });

//     setShowModal(true);
//   };

//   const handleDelete = (id: number) => {
//     setDeleteId(id);
//     setConfirmOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     setData((prevData) => prevData.filter((user) => user.UserID !== deleteId));
//     toast.success("Xóa người dùng thành công!");
//     setConfirmOpen(false);
//     setDeleteId(null);
//   };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách người dùng</h2>
      {/* <ToastContainer /> */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-black">
        <Input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="🔍 Tìm kiếm theo tên..."
          className="w-full md:w-1/2 border border-gray-300 -mb-[6px]"
          size="large"
        />
        <Filter
          filters={filters}
          options={filterOptions}
          onFilterChange={handleInputChange}
          onReset={handleReset}
        />
      </div>

      {/* <AddNewUser onAdd={handleAdd} />
      <EditUser
        show={showModal}
        setShow={setShowModal}
        userData={selectedEmployee}
        onUpdate={handleUpdate}
      />

      <ViewUser
        show={showViewModal}
        setShow={setShowViewModal}
        userData={selectedUser}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa người dùng ID: ${deleteId}?`}
      /> */}

      <div className="relative">
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
    </div>
  );
};

export default UserList;