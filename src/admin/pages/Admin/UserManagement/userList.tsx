// import React, { useState, useEffect } from "react";
// import Filter from "../Components/Filter";
// import { Input, Modal, Spin } from "antd";
// import DataTable from "../Components/Table/Table";
// import AddNewUser from "./addNewUser"
// import UpdateUser from "./updateUser";
// import { notification } from 'antd';
// import Pagination from "../Components/Pagination";
// import { MStatusUser } from "../../../../lib/constants/constants";
// import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import DetailModal from "../Components/ModalForm/DetailModal";
// import { type User, type RoleOption, type StatusOption } from '../../../../types/index';
// import { useAllUsers } from '../../../../hooks/useUserHooks';
// import Cookies from 'js-cookie';
// import { useGetAllRoles } from "../../../../hooks/useRoles";

// const UserList: React.FC = () => {
  
//   interface FilterOption {
//     key: string;
//     label: string;
//     type: "select";
//     placeholder: string;
//     values: { value: string; label: string }[];
//   }

//   const [data, setData] = useState<User[]>([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [api, contextHolder] = notification.useNotification();
//   const itemsPerPage = 4;
//   const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   const [filters, setFilters] = useState({
//     role: "",
//     status: "",
//   });

//   const token = Cookies.get('authToken') || '';
//   const { data: rolesData } = useGetAllRoles(token);

//   const verificationStatusOptions: StatusOption[] = [
//     {
//       id: MStatusUser.VERIFIED.code,
//       description: MStatusUser.VERIFIED.description,
//       code: String(MStatusUser.VERIFIED.code),
//     },
//     {
//       id: MStatusUser.UNVERIFIED.code,
//       description: MStatusUser.UNVERIFIED.description,
//       code: String(MStatusUser.UNVERIFIED.code),
//     }
//   ];

//   const workStatusOptions: StatusOption[] = [
//     {
//       id: MStatusUser.ACTIVE.code,
//       description: MStatusUser.ACTIVE.description,
//       code: String(MStatusUser.ACTIVE.code),
//     },
//     {
//       id: MStatusUser.INACTIVE.code,
//       description: MStatusUser.INACTIVE.description,
//       code: String(MStatusUser.INACTIVE.code),
//     }
//   ];

//   useEffect(() => {
//     if (rolesData) {
//       const mappedRoles = rolesData.map((role) => ({
//         RoleID: role.roleID,
//         RoleName: role.roleName,
//         Description: role.description ?? '',
//       }));
//       setRoleOptions(mappedRoles as RoleOption[]);
//     }
//   }, [rolesData]);

//   const filterOptions: FilterOption[] = [
//     {
//       key: "role",
//       label: "Vai trò",
//       type: "select",
//       placeholder: "Chọn Vai trò",
//       values: roleOptions.map((item) => ({
//         value: String(item.RoleID),
//         label: item.RoleName,
//       })),
//     },
//     {
//       key: "status",
//       label: "Trạng thái xác minh",
//       type: "select",
//       placeholder: "Chọn Trạng thái",
//       values: verificationStatusOptions.map((item) => ({
//         value: String(item.id),
//         label: item.description,
//       })),
//     },
//   ];

//   const roleId = filters.role ? Number(filters.role) : undefined;
//   const statusId = filters.status ? Number(filters.status) : undefined;

//   const {
//     data: pageData,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useAllUsers(token, roleId, statusId, searchQuery, currentPage, itemsPerPage);
  
//   const usersData = pageData?.data?.users ?? [];
//   const fetchedTotalItems = pageData?.data?.totalItems ?? 0;
//   const fetchedTotalPages = pageData?.data?.totalPages ?? 1;
  
//   useEffect(() => {
//     if (pageData) {
//       setData(usersData);
//       setTotalItems(fetchedTotalItems);
//       setTotalPages(fetchedTotalPages);
//       setIsInitialLoad(false);
//     }
//   }, [pageData]);
    
//   useEffect(() => {
//     if (!isInitialLoad) {
//       setCurrentPage(1);
//     }
//   }, [filters.role, filters.status, searchQuery]);

//   // Chỉ hiển thị loading khi lần đầu load, không hiển thị khi filter/search
//   if (isLoading && isInitialLoad) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spin size="large" tip="Đang tải dữ liệu..." />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Có lỗi xảy ra khi tải dữ liệu!
//         <button onClick={() => refetch()} className="ml-2 text-blue-500 underline">
//           Thử lại
//         </button>
//       </div>
//     );
//   }

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const handleReset = () => {
//     setFilters({
//       role: "",
//       status: "",
//     });
//     setSearchQuery("");
//   };
  
//   const handleView = (id: number) => {
//     const user = data.find((u) => u.userId === id);
//     if (user) {
//       setSelectedUser(user);
//       setShowViewModal(true);
//     }
//   };

//   const handleEdit = (id: number) => {
//     const user = data.find((u) => u.userId === id);
//     if (user) {
//       setSelectedUser(user);
//       setShowEditModal(true);
//     }
//   };

//   const handleDelete = (id: number) => {
//     Modal.confirm({
//       title: 'Xác nhận xóa',
//       content: 'Bạn có chắc muốn xóa người dùng này?',
//       okText: 'Xóa',
//       cancelText: 'Hủy',
//       okType: 'danger',
//       onOk: () => {
//         setData((prevData) => prevData.filter((user) => user.userId !== id));
//         api.success({
//           message: 'Thành công',
//           description: 'Đã xóa người dùng thành công!',
//         });
//       },
//     });
//   };

//   const handleAddUser = async (userData: any) => {
//     try {
//       console.log("Adding user:", userData);
      
//       api.success({
//         message: 'Thành công',
//         description: 'Đã thêm người dùng mới thành công!',
//       });
//       refetch();
//     } catch (error) {
//       api.error({
//         message: 'Lỗi',
//         description: 'Có lỗi xảy ra khi thêm người dùng!',
//       });
//       throw error;
//     }
//   };

//   const handleUpdateUser = async (userData: any) => {
//     try {
//       console.log("Updating user:", userData);
      
//       api.success({
//         message: 'Thành công',
//         description: 'Đã cập nhật người dùng thành công!',
//       });
      
//       setShowEditModal(false);
//       setSelectedUser(null);
//       refetch();
//     } catch (error) {
//       api.error({
//         message: 'Lỗi',
//         description: 'Có lỗi xảy ra khi cập nhật người dùng!',
//       });
//       throw error;
//     }
//   };

//   const columns = [
//     {
//       key: "UserID",
//       label: "ID",
//       render: (row: User) => (
//         <span className="font-mono text-sm">{row.userId}</span>
//       )
//     },
//     {
//       key: "fullName",
//       label: "Họ và tên",
//       render: (row: User) => (
//         <div>
//           <div className="font-medium">{row.fullName}</div>
//           <div className="text-sm text-gray-500">{row.email}</div>
//         </div>
//       )
//     },
//     {
//       key: "phoneNumber",
//       label: "Số điện thoại",
//     },
//     {
//       key: "Status",
//       label: "Trạng thái",
//       render: (row: User) => (
//         <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
//           row.Status === 'Verified'
//             ? 'bg-green-100 text-green-800'
//             : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           {row.Status === 'Verified' ? 'Đã xác minh' : 'Chưa xác minh'}
//         </span>
//       )
//     },
//     {
//       key: "role",
//       label: "Vai trò",
//       render: (row: User) => (
//         <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//           {row.role?.RoleName || "Không có"}
//         </span>
//       )
//     },
//     {
//       key: "statusWork",
//       label: "Trạng thái làm việc",
//       render: (row: User) => (
//         <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
//           row.statusWork === 'Active'
//             ? 'bg-green-100 text-green-800'
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {row.statusWork === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
//         </span>
//       )
//     },
//     {
//       key: "actions",
//       label: "Hành động",
//       render: (row: User) => (
//         <div className="flex gap-1">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleView(row.userId);
//             }}
//             className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
//             title="Xem chi tiết"
//           >
//             <FaEye className="w-3 h-3" />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEdit(row.userId);
//             }}
//             className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
//             title="Chỉnh sửa"
//           >
//             <FaEdit className="w-3 h-3" />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDelete(row.userId);
//             }}
//             className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
//             title="Xóa"
//           >
//             <FaTrash className="w-3 h-3" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const userColumns = [
//     {
//       name: "Email",
//       label: "Email",
//       type: "email" as const,
//       required: true,
//       placeholder: "Nhập email",
//     },
//     {
//       name: "Password",
//       label: "Mật khẩu",
//       type: "password" as const,
//       required: true,
//       placeholder: "Nhập mật khẩu",
//     },
//     {
//       name: "FullName",
//       label: "Họ và tên",
//       type: "text" as const,
//       required: true,
//       placeholder: "Nhập họ và tên",
//     },
//     {
//       name: "PhoneNumber",
//       label: "Số điện thoại",
//       type: "tel" as const,
//       required: true,
//       placeholder: "Nhập số điện thoại",
//     },
//     {
//       name: "Status",
//       label: "Trạng thái xác minh",
//       type: "select" as const,
//       required: true,
//       defaultValue: String(MStatusUser.UNVERIFIED.code),
//       options: verificationStatusOptions.map((status) => ({
//         label: status.description,
//         value: String(status.id),
//       })),
//     },
//     {
//       name: "StatusWork",
//       label: "Trạng thái làm việc",
//       type: "select" as const,
//       required: true,
//       defaultValue: String(MStatusUser.ACTIVE.code),
//       options: workStatusOptions.map((status) => ({
//         label: status.description,
//         value: String(status.id),
//       })),
//     },
//     {
//       name: "RoleID",
//       label: "Vai trò",
//       type: "select" as const,
//       required: true,
//       options: roleOptions.map((role) => ({
//         label: role.RoleName,
//         value: role.RoleID.toString(),
//       })),
//     },
//     {
//       name: "gender",
//       label: "Giới tính",
//       type: "select" as const,
//       options: [
//         { label: "Nam", value: "male" },
//         { label: "Nữ", value: "female" },
//         { label: "Khác", value: "other" },
//       ],
//     },
//     {
//       name: "JoinDate",
//       label: "Ngày tham gia",
//       type: "date" as const,
//       defaultValue: new Date().toISOString().split('T')[0],
//     },
//     {
//       name: "avatar",
//       label: "Ảnh đại diện",
//       type: "file" as const,
//       span: 2 as const,
//     },
//   ];

//   const userDetailColumns = [
//     { label: "ID", key: "userId" },
//     { label: "Họ tên", key: "fullName" },
//     { label: "Email", key: "email" },
//     { label: "Số điện thoại", key: "phoneNumber" },
//     {
//       label: "Vai trò",
//       key: "role",
//       render: (value: User['role']) => value?.RoleName || 'Không có'
//     },
//     {
//       label: "Trạng thái",
//       key: "Status",
//       render: (value: string) => value === 'Verified' ? 'Đã xác minh' : 'Chưa xác minh'
//     },
//     {
//       label: "Trạng thái làm việc",
//       key: "statusWork",
//       render: (value: string) => value === 'Active' ? 'Hoạt động' : 'Không hoạt động'
//     },
//     { label: "Ngày tham gia", key: "joinDate" },
//   ];

//   const initialFormData = userColumns.reduce((acc, col) => {
//     acc[col.name] = col.defaultValue || "";
//     return acc;
//   }, {} as { [key: string]: any });

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg">
//       {contextHolder}
//       <h2 className="text-2xl font-bold mb-4 text-black">Danh sách nhân viên</h2>
      
//       <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
//         <div className="flex-1">
//           <Input
//             value={searchQuery}
//             onChange={handleSearch}
//             placeholder="🔍 Tìm kiếm theo tên hoặc email..."
//             className="w-full"
//             size="large"
//           />
//         </div>
//         <Filter
//           filters={filters}
//           options={filterOptions}
//           onFilterChange={handleInputChange}
//           onReset={handleReset}
//         />
//       </div>

//       <AddNewUser
//         onAdd={handleAddUser}
//         initialFormData={initialFormData}
//         columns={userColumns}
//         roleOptions={roleOptions.map(role => ({
//           RoleID: role.RoleID,
//           RoleName: role.RoleName,
//           Description: role.Description ?? ''
//         }))}
//       />

//       <div className="bg-white rounded-lg border overflow-hidden relative">
//         {/* Loading overlay khi đang fetch */}
//         {isFetching && !isInitialLoad && (
//           <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
//             <Spin size="large" />
//           </div>
//         )}
        
//         {/* Table với transition mượt */}
//         <div className="transition-opacity duration-300" style={{ opacity: isFetching ? 0.5 : 1 }}>
//           <DataTable
//             columns={columns}
//             data={(data ?? []).map(user => ({ ...user, id: user.userId }))}
//             onSort={() => {}}
//             sortConfig={{ key: '', direction: 'ascending' }}
//           />
//         </div>

//         <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
//           <span className="text-sm text-gray-600">
//             Hiển thị {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
//             {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
//             {totalItems} người dùng
//           </span>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>

//       <UpdateUser
//         show={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setSelectedUser(null);
//         }}
//         onUpdate={handleUpdateUser}
//         userData={selectedUser}
//         roleOptions={roleOptions.map(role => ({
//           RoleID: role.RoleID,
//           RoleName: role.RoleName,
//           Description: role.Description ?? ''
//         }))}
//       />

//       <DetailModal<User>
//         show={showViewModal}
//         onClose={() => {
//           setShowViewModal(false);
//           setSelectedUser(null);
//         }}
//         title="Chi tiết người dùng"
//         data={selectedUser}
//         columns={userDetailColumns}
//       />
//     </div>
//   );
// };

// export default UserList;






import React, { useState, useEffect } from "react";
import Filter from "../Components/Filter";
import { Input, Modal, Spin } from "antd";
import DataTable from "../Components/Table/Table";
import AddNewUser from "./addNewUser"
import UpdateUser from "./updateUser";
import { notification } from 'antd';
import Pagination from "../Components/Pagination";
import { MStatusUser } from "../../../../lib/constants/constants";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DetailModal from "../Components/ModalForm/DetailModal";
import { type User, type RoleOption, type StatusOption } from '../../../../types/index';
import { useAllUsers } from '../../../../hooks/useUserHooks';
import Cookies from 'js-cookie';
import { useRole } from "../../../../hooks/useRoles";

const UserList: React.FC = () => {
  
  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }

  const [data, setData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // Bắt đầu từ 0 theo pattern mới
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const itemsPerPage = 4;
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });

  const token = Cookies.get('authToken') || '';
  
  // Sử dụng hook mới
  const { useRoles } = useRole(token);
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(
    0, 
    100, // Lấy tất cả roles
    undefined,
    { enabled: !!token }
  );

  // Map roles data
  useEffect(() => {
    if (rolesData?.content) {
      const mappedRoles = rolesData.content.map((role) => ({
        RoleID: role.roleID,
        RoleName: role.roleName,
        Description: role.description ?? '',
      }));
      setRoleOptions(mappedRoles);
    }
  }, [rolesData]);

  const verificationStatusOptions: StatusOption[] = [
    {
      id: MStatusUser.VERIFIED.code,          
      description: MStatusUser.VERIFIED.description,
      code: String(MStatusUser.VERIFIED.code), 
    },
    {
      id: MStatusUser.UNVERIFIED.code,        
      description: MStatusUser.UNVERIFIED.description,
      code: String(MStatusUser.UNVERIFIED.code), 
    }
  ];

  const workStatusOptions: StatusOption[] = [
    {
      id: MStatusUser.ACTIVE.code,            
      description: MStatusUser.ACTIVE.description,
      code: String(MStatusUser.ACTIVE.code),
    },
    {
      id: MStatusUser.INACTIVE.code,        
      description: MStatusUser.INACTIVE.description,
      code: String(MStatusUser.INACTIVE.code), 
    }
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
      label: "Trạng thái xác minh",
      type: "select",
      placeholder: "Chọn Trạng thái",
      values: verificationStatusOptions.map((item) => ({
        value: String(item.id),
        label: item.description,
      })),
    },
  ];

  const roleId = filters.role ? Number(filters.role) : undefined;
  const statusId = filters.status ? Number(filters.status) : undefined;

  const {
    data: pageData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAllUsers(
    token, 
    roleId, 
    statusId, 
    searchQuery, 
    currentPage + 1, // API dùng page 1-based
    itemsPerPage
  );
  
  const usersData = pageData?.data?.users ?? [];
  const fetchedTotalItems = pageData?.data?.totalItems ?? 0;
  const fetchedTotalPages = pageData?.data?.totalPages ?? 1;
  
  useEffect(() => {
    if (pageData) {
      setData(usersData);
      setTotalItems(fetchedTotalItems);
      setTotalPages(fetchedTotalPages);
      setIsInitialLoad(false);
    }
  }, [pageData]);
    
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(0); // Reset về page 0
    }
  }, [filters.role, filters.status, searchQuery]);

  // Hiển thị loading khi lần đầu load
  if ((isLoading || isLoadingRoles) && isInitialLoad) {
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
      role: "",
      status: "",
    });
    setSearchQuery("");
  };
  
  const handleView = (id: number) => {
    const user = data.find((u) => u.userId === id);
    if (user) {
      setSelectedUser(user);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: number) => {
    const user = data.find((u) => u.userId === id);
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
        setData((prevData) => prevData.filter((user) => user.userId !== id));
        api.success({
          message: 'Thành công',
          description: 'Đã xóa người dùng thành công!',
        });
        refetch();
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
      refetch();
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
      console.log("Updating user:", userData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã cập nhật người dùng thành công!',
      });
      
      setShowEditModal(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật người dùng!',
      });
      throw error;
    }
  };

  // Xử lý page change theo 0-based index
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // Convert từ 1-based sang 0-based
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    { 
      key: "UserID", 
      label: "ID",
      render: (row: User) => (
        <span className="font-mono text-sm">{row.userId}</span>
      )
    },
    {
      key: "fullName", 
      label: "Họ và tên",
      render: (row: User) => (
        <div>
          <div className="font-medium">{row.fullName}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: "phoneNumber", 
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
      key: "statusWork", 
      label: "Trạng thái làm việc",
      render: (row: User) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          row.statusWork === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.statusWork === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
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
              handleView(row.userId);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            title="Xem chi tiết"
          >
            <FaEye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.userId);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.userId);
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
      label: "Trạng thái xác minh",
      type: "select" as const,
      required: true,
      defaultValue: String(MStatusUser.UNVERIFIED.code),
      options: verificationStatusOptions.map((status) => ({
        label: status.description,
        value: String(status.id),
      })),
    },
    {
      name: "StatusWork",
      label: "Trạng thái làm việc",
      type: "select" as const,
      required: true,
      defaultValue: String(MStatusUser.ACTIVE.code),
      options: workStatusOptions.map((status) => ({
        label: status.description,
        value: String(status.id),
      })),
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

  const userDetailColumns = [
    { label: "ID", key: "userId" },
    { label: "Họ tên", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Số điện thoại", key: "phoneNumber" },
    { 
      label: "Vai trò", 
      key: "role",
      render: (value: User['role']) => value?.RoleName || 'Không có'
    },
    { 
      label: "Trạng thái", 
      key: "Status",
      render: (value: string) => value === 'Verified' ? 'Đã xác minh' : 'Chưa xác minh'
    },
    { 
      label: "Trạng thái làm việc", 
      key: "statusWork",
      render: (value: string) => value === 'Active' ? 'Hoạt động' : 'Không hoạt động'
    },
    { label: "Ngày tham gia", key: "joinDate" },
  ];

  const initialFormData = userColumns.reduce((acc, col) => {
    acc[col.name] = col.defaultValue || "";
    return acc;
  }, {} as { [key: string]: any });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách nhân viên</h2>
      
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

      <AddNewUser 
        onAdd={handleAddUser}
        initialFormData={initialFormData}
        columns={userColumns}
        roleOptions={roleOptions.map(role => ({
          RoleID: role.RoleID,
          RoleName: role.RoleName,
          Description: role.Description ?? '' 
        }))}
      />
      <div className="bg-white rounded-lg border overflow-hidden relative">
        {/* Loading overlay */}
        {isFetching && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        
        <div className="transition-opacity duration-300" style={{ opacity: isFetching ? 0.5 : 1 }}>
          <DataTable
            columns={columns}
            data={(data ?? []).map(user => ({ ...user, id: user.userId }))}
            onSort={() => {}}
            sortConfig={{ key: '', direction: 'ascending' }}
          />
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {data.length > 0 ? currentPage * itemsPerPage + 1 : 0}-
            {Math.min((currentPage + 1) * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} người dùng
          </span>
          <Pagination
            currentPage={currentPage + 1} // Convert sang 1-based cho UI
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <UpdateUser
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
        userData={selectedUser}
        roleOptions={roleOptions.map(role => ({
          RoleID: role.RoleID,
          RoleName: role.RoleName,
          Description: role.Description ?? '' 
        }))}
      />

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