// import React, { useState, useEffect, useRef } from "react";
// import { Menu, Avatar } from "antd";
// import { NavLink } from "react-router-dom";
// import {
//   UserOutlined,
//   CalendarOutlined,
//   DollarOutlined,
//   BarChartOutlined,
//   SettingOutlined,
//   HistoryOutlined,
//   BellOutlined,
//   EnvironmentOutlined,
//   GiftOutlined,
//   MenuOutlined,
//   ShoppingCartOutlined,
//   TeamOutlined,
// } from "@ant-design/icons";
// import type { MenuProps } from "antd";
// type MenuItem = Required<MenuProps>["items"][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: "group"
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   } as MenuItem;
// }

// const AdminSidebar: React.FC = () => {
//   const [openKeys, setOpenKeys] = useState<string[]>([]);
//   const sidebarRef = useRef<HTMLDivElement>(null);

// const items: MenuProps["items"] = [
//   getItem("Quản lý Người dùng", "sub1", <UserOutlined />, [
//     getItem(
//       <NavLink to="/admin/test_default">Test default page</NavLink>,
//       "0"
//     ),
//     getItem(<NavLink to="/admin/users">Tất cả người dùng</NavLink>, "1"),
//     getItem(<NavLink to="/admin/add-user">Thêm người dùng mới</NavLink>, "2"),
//   ]),
//     getItem("Quản lý Vai trò và Quyền", "sub2", <SettingOutlined />, [
//       getItem(<NavLink to="/admin/roles">Danh sách vai trò</NavLink>, "3"),
//       getItem(<NavLink to="/admin/permissions">Danh sách quyền</NavLink>, "4"),
//       getItem(
//         <NavLink to="/admin/role-permissions">Gán quyền cho vai trò</NavLink>,
//         "5"
//       ),
//       getItem(
//         <NavLink to="/admin/user-roles">Gán vai trò cho người dùng</NavLink>,
//         "6"
//       ),
//     ]),
//     getItem("Quản lý Đặt bàn", "sub3", <CalendarOutlined />, [
//       getItem(<NavLink to="/admin/bookings">Danh sách đặt bàn</NavLink>, "7"),
//       getItem(<NavLink to="/admin/cancel-bookings">Hủy đặt bàn</NavLink>, "8"),
//     ]),
//     getItem("Quản lý Nhân viên", "sub4", <TeamOutlined />, [
//       getItem(<NavLink to="/admin/staff">Tất cả nhân viên</NavLink>, "9"),
//       getItem(
//         <NavLink to="/admin/add-staff">Thêm nhân viên mới</NavLink>,
//         "10"
//       ),
//       getItem(
//         <NavLink to="/admin/staff-verification">Xác thực nhân viên</NavLink>,
//         "11"
//       ),
//     ]),
//     getItem("Quản lý Thực đơn", "sub5", <MenuOutlined />, [
//       getItem(<NavLink to="/admin/categories">Danh mục món ăn</NavLink>, "12"),
//       getItem(<NavLink to="/admin/meals">Tất cả món ăn</NavLink>, "13"),
//       getItem(<NavLink to="/admin/add-meal">Thêm món ăn mới</NavLink>, "14"),
//     ]),
//     getItem("Quản lý Bàn", "sub6", <EnvironmentOutlined />, [
//       getItem(<NavLink to="/admin/table-types">Loại bàn</NavLink>, "15"),
//       getItem(<NavLink to="/admin/tables">Tất cả bàn</NavLink>, "16"),
//       getItem(<NavLink to="/admin/add-table">Thêm bàn mới</NavLink>, "17"),
//     ]),
//     getItem("Quản lý Voucher", "sub7", <GiftOutlined />, [
//       getItem(<NavLink to="/admin/vouchers">Danh sách voucher</NavLink>, "18"),
//       getItem(
//         <NavLink to="/admin/add-voucher">Thêm voucher mới</NavLink>,
//         "19"
//       ),
//       getItem(
//         <NavLink to="/admin/customer-vouchers">Voucher của khách hàng</NavLink>,
//         "20"
//       ),
//     ]),
//     getItem("Quản lý Đơn hàng", "sub8", <ShoppingCartOutlined />, [
//       getItem(<NavLink to="/admin/orders">Danh sách đơn hàng</NavLink>, "21"),
//       getItem(
//         <NavLink to="/admin/order-details">Chi tiết đơn hàng</NavLink>,
//         "22"
//       ),
//       getItem(<NavLink to="/admin/add-order">Thêm đơn hàng mới</NavLink>, "23"),
//     ]),
//     getItem("Quản lý Hóa đơn", "sub9", <DollarOutlined />, [
//       getItem(<NavLink to="/admin/bills">Danh sách hóa đơn</NavLink>, "24"),
//       getItem(<NavLink to="/admin/add-bill">Thêm hóa đơn mới</NavLink>, "25"),
//       getItem(
//         <NavLink to="/admin/bill-payments">Thanh toán hóa đơn</NavLink>,
//         "26"
//       ),
//     ]),
//     getItem("Quản lý Thông báo", "sub10", <BellOutlined />, [
//       getItem(
//         <NavLink to="/admin/notifications">Danh sách thông báo</NavLink>,
//         "27"
//       ),
//       getItem(
//         <NavLink to="/admin/send-notification">Gửi thông báo mới</NavLink>,
//         "28"
//       ),
//     ]),
//     getItem("Phân tích & Báo cáo", "sub11", <BarChartOutlined />, [
//       getItem(
//         <NavLink to="/admin/statistics">Thống kê nhà hàng</NavLink>,
//         "29"
//       ),
//       getItem(
//         <NavLink to="/admin/reports/bookings">Báo cáo đặt bàn</NavLink>,
//         "30"
//       ),
//       getItem(
//         <NavLink to="/admin/reports/revenue">Báo cáo doanh thu</NavLink>,
//         "31"
//       ),
//       getItem(
//         <NavLink to="/admin/reports/orders">Báo cáo đơn hàng</NavLink>,
//         "32"
//       ),
//     ]),
//     // Xem logs các thay đổi trong hệ thống, nếu không hát triển tính năng này có thể xóa sau
//     getItem("Lịch sử Hệ thống", "sub12", <HistoryOutlined />, [
//       getItem(<NavLink to="/admin/logs">Xem logs</NavLink>, "33"),
//     ]),
//     getItem("Hệ thống", "sub13", <SettingOutlined />, [
//       getItem(<NavLink to="/admin/settings">Cài đặt hệ thống</NavLink>, "34"),
//       getItem(<NavLink to="/admin/permissions">Quản lý quyền</NavLink>, "35"),
//     ]),
//      getItem("Quản lý gửi Email", "sub14", <SettingOutlined />, [
//       getItem(<NavLink to="/admin/emails">Xem lịch sử gửi Email</NavLink>, "36"),
//       getItem(<NavLink to="/admin/emails/send">Gửi Email</NavLink>, "37"),
//     ]),
//   ];

//   // Xử lý mở/đóng menu
//   const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
//     setOpenKeys(keys as string[]);
//   };

//   // Xử lý click menu item để cập nhật selectedKeys
//   const onClick: MenuProps["onClick"] = (e) => {
//     console.log("click ", e);
//     if (!e.key.startsWith("sub") && !e.key.startsWith("g")) {
//       setSelectedKeys([e.key]); // Cập nhật item con được chọn
//     }
//     // Nếu click vào sub menu title, không đóng các menu khác
//     if (e.key.startsWith("sub")) {
//       return;
//     }
//   };

//   // State để theo dõi item được chọn
//   const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

//   // Đóng menu nếu click ra ngoài
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target as Node)
//       ) {
//         setOpenKeys([]);
//         setSelectedKeys([]); // Reset selected khi click ra ngoài
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Avatar mặc định
//   const defaultAvatar =
//     "https://ui-avatars.com/api/?name=Admin&background=random";

//   return (
//     <div
//       ref={sidebarRef}
//       className="w-[15%] h-screen text-gray-300 flex flex-col bg-white"
//     >
//       {/* Tiêu đề sidebar */}
//       <div className="flex items-center h-[8%] ml-[9%] box-border">
//         <Avatar size={32} src={defaultAvatar} className="mr-[4%]" />
//         <span className="text-sm font-medium text-black">MediAdmin</span>
//       </div>

//       {/* Menu với Ant Design */}
//       <Menu
//         onClick={onClick}
//         style={{
//           borderRight: 0,
//           height: "calc(100vh - 64px)",
//         }}
//         selectedKeys={selectedKeys}
//         openKeys={openKeys}
//         onOpenChange={onOpenChange}
//         mode="inline"
//         className="text-gray-300 overflow-y-auto custom-menu antd-wave-shadow"
//         items={items}
//       />
//     </div>
//   );
// };

// export default AdminSidebar;










import React, { useState, useEffect, useRef } from "react";
import { Menu, Avatar, Spin, message } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  HistoryOutlined,
  BellOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useCurrentUser } from "../../hooks/useUserHooks";
import { usePermission } from "../../hooks/usePermissions";
import Cookies from "js-cookie";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return { key, icon, children, label, type } as MenuItem;
}

const AdminSidebar: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { data: user } = useCurrentUser();
  const token = Cookies.get("authToken") || "";
  const { getMyPermissions } = usePermission(token);

  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Current User in Sidebar:", user); // để bạn thấy rõ

    // Nếu chưa có user → thoát
    if (!user) {
      setMyPermissions([]);
      setLoading(false);
      return;
    }

    // LẤY roleId ĐÚNG THEO API CỦA BẠN
    const roleId = user.roleId; // ← ĐÚNG RỒI! KHÔNG CẦN user.role.RoleId

    // Chỉ Admin (2) và Staff (3) mới được lấy permission
    if (roleId !== 2 && roleId !== 3) {
      setMyPermissions([]);
      setLoading(false);
      return;
    }

    // Bắt đầu loading + gọi API
    setLoading(true);
    getMyPermissions(token)
      .then((perms) => {
        const codes = perms
          .map((p: any) => p.permissionName) // Sử dụng permissionName từ JSON
          .filter(Boolean);
        
        console.log("Permissions loaded:", codes); // để check
        setMyPermissions(codes);
      })
      .catch((err) => {
        console.error("Lỗi lấy permission:", err);
        message.error("Không thể tải quyền truy cập");
        setMyPermissions([]);
      })
      .finally(() => {
        setLoading(false); 
      });

  }, [token, user]);

  // Kiểm tra quyền
  const hasPermission = (code: string): boolean => {
    return myPermissions.includes(code);
  };

  // Highlight menu theo URL hiện tại
  useEffect(() => {
    const path = location.pathname;
    const key = Object.entries(menuKeyMap).find(([route]) => path.startsWith(route))?.[1];
    if (key) {
      setSelectedKeys([key]);
    }
  }, [location]);

  const menuKeyMap: Record<string, string> = {
    "/admin/test_default": "0",
    "/admin/users": "1",
    "/admin/add-user": "2",
    "/admin/roles": "3",
    "/admin/permissions": "4",
    "/admin/role-permissions": "5",
    "/admin/user-roles": "6",
    "/admin/bookings": "7",
    "/admin/cancel-bookings": "8",
    "/admin/staff": "9",
    "/admin/add-staff": "10",
    "/admin/staff-verification": "11",
    "/admin/categories": "12",
    "/admin/meals": "13",
    "/admin/add-meal": "14",
    "/admin/table-types": "15",
    "/admin/tables": "16",
    "/admin/add-table": "17",
    "/admin/vouchers": "18",
    "/admin/add-voucher": "19",
    "/admin/customer-vouchers": "20",
    "/admin/orders": "21",
    "/admin/order-details": "22",
    "/admin/add-order": "23",
    "/admin/bills": "24",
    "/admin/add-bill": "25",
    "/admin/bill-payments": "26",
    "/admin/notifications": "27",
    "/admin/send-notification": "28",
    "/admin/statistics": "29",
    "/admin/reports/bookings": "30",
    "/admin/reports/revenue": "31",
    "/admin/reports/orders": "32",
    "/admin/logs": "33",
    "/admin/settings": "34",
    "/admin/emails": "36",
    "/admin/emails/send": "37",
  };

  // Tạo các nhóm menu chỉ khi có ít nhất 1 item con được phép
  const buildMenuItems = (): MenuProps["items"] => {
    const items: MenuProps["items"] = [];

    // Quản lý Người dùng
    const userItems = [
      hasPermission("VIEW_USER") && getItem(<NavLink to="/admin/test_default">Test default page</NavLink>, "0"),
      hasPermission("VIEW_USER") && getItem(<NavLink to="/admin/users">Tất cả người dùng</NavLink>, "1"),
      hasPermission("CREATE_USER") && getItem(<NavLink to="/admin/add-user">Thêm người dùng mới</NavLink>, "2"),
    ].filter(Boolean) as MenuItem[];
    if (userItems.length > 0) {
      items.push(getItem("Quản lý Người dùng", "sub1", <UserOutlined />, userItems));
    }

    // Vai trò & Quyền
    const roleItems = [
      hasPermission("VIEW_ROLE") && getItem(<NavLink to="/admin/roles">Danh sách vai trò</NavLink>, "3"),
      hasPermission("VIEW_PERMISSION") && getItem(<NavLink to="/admin/permissions">Danh sách quyền</NavLink>, "4"),
      hasPermission("CREATE_ROLE_PERMISSION") && getItem(<NavLink to="/admin/role-permissions">Gán quyền cho vai trò</NavLink>, "5"),
      hasPermission("UPDATE_ROLE_PERMISSION") && getItem(<NavLink to="/admin/user-roles">Gán vai trò cho người dùng</NavLink>, "6"),
    ].filter(Boolean) as MenuItem[];
    if (roleItems.length > 0) {
      items.push(getItem("Quản lý Vai trò và Quyền", "sub2", <SettingOutlined />, roleItems));
    }

    // Các nhóm khác...
    const bookingItems = [
      hasPermission("VIEW_BOOKING") && getItem(<NavLink to="/admin/bookings">Danh sách đặt bàn</NavLink>, "7"),
      hasPermission("DELETE_BOOKING") && getItem(<NavLink to="/admin/cancel-bookings">Hủy đặt bàn</NavLink>, "8"),
    ].filter(Boolean) as MenuItem[];
    if (bookingItems.length > 0) items.push(getItem("Quản lý Đặt bàn", "sub3", <CalendarOutlined />, bookingItems));

    const staffItems = [
      hasPermission("VIEW_USER") && getItem(<NavLink to="/admin/staff">Tất cả nhân viên</NavLink>, "9"), // Giả sử staff là user
      hasPermission("CREATE_USER") && getItem(<NavLink to="/admin/add-staff">Thêm nhân viên mới</NavLink>, "10"),
      hasPermission("UPDATE_USER") && getItem(<NavLink to="/admin/staff-verification">Xác thực nhân viên</NavLink>, "11"),
    ].filter(Boolean) as MenuItem[];
    if (staffItems.length > 0) items.push(getItem("Quản lý Nhân viên", "sub4", <TeamOutlined />, staffItems));

    const menuItems = [
      hasPermission("VIEW_CATEGORY") && getItem(<NavLink to="/admin/categories">Danh mục món ăn</NavLink>, "12"),
      hasPermission("VIEW_MEAL") && getItem(<NavLink to="/admin/meals">Tất cả món ăn</NavLink>, "13"),
      hasPermission("CREATE_MEAL") && getItem(<NavLink to="/admin/add-meal">Thêm món ăn mới</NavLink>, "14"),
    ].filter(Boolean) as MenuItem[];
    if (menuItems.length > 0) items.push(getItem("Quản lý Thực đơn", "sub5", <MenuOutlined />, menuItems));

    const tableItems = [
      hasPermission("VIEW_TABLE_TYPE") && getItem(<NavLink to="/admin/table-types">Loại bàn</NavLink>, "15"),
      hasPermission("VIEW_TABLE") && getItem(<NavLink to="/admin/tables">Tất cả bàn</NavLink>, "16"),
      hasPermission("CREATE_TABLE") && getItem(<NavLink to="/admin/add-table">Thêm bàn mới</NavLink>, "17"),
    ].filter(Boolean) as MenuItem[];
    if (tableItems.length > 0) items.push(getItem("Quản lý Bàn", "sub6", <EnvironmentOutlined />, tableItems));

    const voucherItems = [
      hasPermission("VIEW_VOUCHER") && getItem(<NavLink to="/admin/vouchers">Danh sách voucher</NavLink>, "18"),
      hasPermission("CREATE_VOUCHER") && getItem(<NavLink to="/admin/add-voucher">Thêm voucher mới</NavLink>, "19"),
      hasPermission("VIEW_CUSTOMER_VOUCHER") && getItem(<NavLink to="/admin/customer-vouchers">Voucher của khách hàng</NavLink>, "20"),
    ].filter(Boolean) as MenuItem[];
    if (voucherItems.length > 0) items.push(getItem("Quản lý Voucher", "sub7", <GiftOutlined />, voucherItems));

    const orderItems = [
      hasPermission("VIEW_ORDER") && getItem(<NavLink to="/admin/orders">Danh sách đơn hàng</NavLink>, "21"),
      hasPermission("VIEW_ORDER") && getItem(<NavLink to="/admin/order-details">Chi tiết đơn hàng</NavLink>, "22"),
      hasPermission("CREATE_ORDER") && getItem(<NavLink to="/admin/add-order">Thêm đơn hàng mới</NavLink>, "23"),
    ].filter(Boolean) as MenuItem[];
    if (orderItems.length > 0) items.push(getItem("Quản lý Đơn hàng", "sub8", <ShoppingCartOutlined />, orderItems));

    const billItems = [
      hasPermission("VIEW_BILL") && getItem(<NavLink to="/admin/bills">Danh sách hóa đơn</NavLink>, "24"),
      hasPermission("CREATE_BILL") && getItem(<NavLink to="/admin/add-bill">Thêm hóa đơn mới</NavLink>, "25"),
      hasPermission("VIEW_PAYMENT") && getItem(<NavLink to="/admin/bill-payments">Thanh toán hóa đơn</NavLink>, "26"),
    ].filter(Boolean) as MenuItem[];
    if (billItems.length > 0) items.push(getItem("Quản lý Hóa đơn", "sub9", <DollarOutlined />, billItems));

    const notiItems = [
      hasPermission("VIEW_NOTIFICATION") && getItem(<NavLink to="/admin/notifications">Danh sách thông báo</NavLink>, "27"),
      hasPermission("CREATE_NOTIFICATION") && getItem(<NavLink to="/admin/send-notification">Gửi thông báo mới</NavLink>, "28"),
    ].filter(Boolean) as MenuItem[];
    if (notiItems.length > 0) items.push(getItem("Quản lý Thông báo", "sub10", <BellOutlined />, notiItems));

    const reportItems = [
      hasPermission("VIEW_BOOKING") && getItem(<NavLink to="/admin/statistics">Thống kê nhà hàng</NavLink>, "29"), // Giả sử dùng VIEW_BOOKING cho report
      hasPermission("VIEW_BOOKING") && getItem(<NavLink to="/admin/reports/bookings">Báo cáo đặt bàn</NavLink>, "30"),
      hasPermission("VIEW_ORDER") && getItem(<NavLink to="/admin/reports/revenue">Báo cáo doanh thu</NavLink>, "31"),
      hasPermission("VIEW_ORDER") && getItem(<NavLink to="/admin/reports/orders">Báo cáo đơn hàng</NavLink>, "32"),
    ].filter(Boolean) as MenuItem[];
    if (reportItems.length > 0) items.push(getItem("Phân tích & Báo cáo", "sub11", <BarChartOutlined />, reportItems));

    if (hasPermission("VIEW_LOG")) {
      items.push(getItem("Lịch sử Hệ thống", "sub12", <HistoryOutlined />, [
        getItem(<NavLink to="/admin/logs">Xem logs</NavLink>, "33"),
      ]));
    }

    const systemItems = [
      hasPermission("VIEW_PERMISSION") && getItem(<NavLink to="/admin/settings">Cài đặt hệ thống</NavLink>, "34"),
      hasPermission("VIEW_PERMISSION") && getItem(<NavLink to="/admin/permissions">Quản lý quyền</NavLink>, "35"),
    ].filter(Boolean) as MenuItem[];
    if (systemItems.length > 0) items.push(getItem("Hệ thống", "sub13", <SettingOutlined />, systemItems));

    const emailItems = [
      hasPermission("SEND_EMAIL") && getItem(<NavLink to="/admin/emails">Xem lịch sử gửi Email</NavLink>, "36"),
      hasPermission("SEND_EMAIL") && getItem(<NavLink to="/admin/emails/send">Gửi Email</NavLink>, "37"),
    ].filter(Boolean) as MenuItem[];
    if (emailItems.length > 0) items.push(getItem("Quản lý gửi Email", "sub14", <SettingOutlined />, emailItems));

    return items;
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys as string[]);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (!e.key.startsWith("sub")) {
      setSelectedKeys([e.key]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenKeys([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultAvatar = "https://ui-avatars.com/api/?name=Admin&background=random";

  if (loading) {
    return (
      <div className="w-[15%] h-screen bg-white flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div ref={sidebarRef} className="w-[16%] h-screen text-gray-300 flex flex-col bg-white">
      <div className="flex items-center h-[8%] ml-[9%] box-border">
        <Avatar size={32} src={defaultAvatar} className="mr-[4%]" />
        <span className="text-sm font-medium text-black">MediAdmin</span>
      </div>

      <Menu
        onClick={onClick}
        style={{ borderRight: 0, height: "calc(100vh - 64px)" }}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        className="text-gray-300 overflow-y-auto custom-menu antd-wave-shadow mt-[20%]"
        items={buildMenuItems()}
      />
    </div>
  );
};

export default AdminSidebar;