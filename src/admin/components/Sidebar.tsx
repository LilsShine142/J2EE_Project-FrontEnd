import React, { useState, useEffect, useRef } from "react";
import { Menu, Avatar } from "antd";
import { NavLink } from "react-router-dom";
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
  TeamOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const AdminSidebar: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

const items: MenuProps['items'] = [
    getItem('Quản lý Người dùng', 'sub1', <UserOutlined />, [
      getItem(<NavLink to="/admin/test_default">Test default page</NavLink>, '0'),
      getItem(<NavLink to="/admin/customers">Tất cả khách hàng</NavLink>, '1'),
      getItem(<NavLink to="/admin/users">Tất cả nhân viên</NavLink>, '2'),
    ]),
    getItem('Quản lý Vai trò và Quyền', 'sub2', <SettingOutlined />, [
      getItem(<NavLink to="/admin/roles">Danh sách vai trò</NavLink>, '3'),
      getItem(<NavLink to="/admin/permissions">Danh sách quyền</NavLink>, '4'),
      getItem(<NavLink to="/admin/role-permissions">Gán quyền cho vai trò</NavLink>, '5'),
      getItem(<NavLink to="/admin/user-roles">Gán vai trò cho người dùng</NavLink>, '6'),
    ]),
    getItem('Quản lý Đặt bàn', 'sub3', <CalendarOutlined />, [
      getItem(<NavLink to="/admin/bookings">Danh sách đặt bàn</NavLink>, '7'),
      getItem(<NavLink to="/admin/cancel-bookings">Hủy đặt bàn</NavLink>, '8'),
    ]),
    getItem('Quản lý Nhân viên', 'sub4', <TeamOutlined />, [
      getItem(<NavLink to="/admin/staff">Tất cả nhân viên</NavLink>, '9'),
      getItem(<NavLink to="/admin/add-staff">Thêm nhân viên mới</NavLink>, '10'),
      getItem(<NavLink to="/admin/staff-verification">Xác thực nhân viên</NavLink>, '11'),
    ]),
    getItem('Quản lý Thực đơn', 'sub5', <MenuOutlined />, [
      getItem(<NavLink to="/admin/categories">Danh mục món ăn</NavLink>, '12'),
      getItem(<NavLink to="/admin/meals">Tất cả món ăn</NavLink>, '13'),
      getItem(<NavLink to="/admin/add-meal">Thêm món ăn mới</NavLink>, '14'),
    ]),
    getItem('Quản lý Bàn', 'sub6', <EnvironmentOutlined />, [
      getItem(<NavLink to="/admin/table-types">Loại bàn</NavLink>, '15'),
      getItem(<NavLink to="/admin/tables">Tất cả bàn</NavLink>, '16'),
      getItem(<NavLink to="/admin/add-table">Thêm bàn mới</NavLink>, '17'),
    ]),
    getItem('Quản lý Voucher', 'sub7', <GiftOutlined />, [
      getItem(<NavLink to="/admin/vouchers">Danh sách voucher</NavLink>, '18'),
      getItem(<NavLink to="/admin/add-voucher">Thêm voucher mới</NavLink>, '19'),
      getItem(<NavLink to="/admin/customer-vouchers">Voucher của khách hàng</NavLink>, '20'),
    ]),
    getItem('Quản lý Đơn hàng', 'sub8', <ShoppingCartOutlined />, [
    getItem(<NavLink to="/admin/orders">Danh sách đơn hàng</NavLink>, '21'),
    getItem(<NavLink to="/admin/order-details">Chi tiết đơn hàng</NavLink>, '22'),
    getItem(<NavLink to="/admin/add-order">Thêm đơn hàng mới</NavLink>, '23'),
    ]),
    getItem('Quản lý Hóa đơn', 'sub9', <DollarOutlined />, [
    getItem(<NavLink to="/admin/bills">Danh sách hóa đơn</NavLink>, '24'),
    getItem(<NavLink to="/admin/add-bill">Thêm hóa đơn mới</NavLink>, '25'),
    getItem(<NavLink to="/admin/bill-payments">Thanh toán hóa đơn</NavLink>, '26'),
    ]),
    getItem('Quản lý Thông báo', 'sub10', <BellOutlined />, [
      getItem(<NavLink to="/admin/notifications">Danh sách thông báo</NavLink>, '27'),
      getItem(<NavLink to="/admin/send-notification">Gửi thông báo mới</NavLink>, '28'),
    ]),
    getItem('Phân tích & Báo cáo', 'sub11', <BarChartOutlined />, [
      getItem(<NavLink to="/admin/statistics">Thống kê nhà hàng</NavLink>, '29'),
      getItem(<NavLink to="/admin/reports/bookings">Báo cáo đặt bàn</NavLink>, '30'),
      getItem(<NavLink to="/admin/reports/revenue">Báo cáo doanh thu</NavLink>, '31'),
      getItem(<NavLink to="/admin/reports/orders">Báo cáo đơn hàng</NavLink>, '32'),
    ]),
    // Xem logs các thay đổi trong hệ thống, nếu không hát triển tính năng này có thể xóa sau
    getItem('Lịch sử Hệ thống', 'sub12', <HistoryOutlined />, [
      getItem(<NavLink to="/admin/logs">Xem logs</NavLink>, '33'),
    ]),
    getItem('Hệ thống', 'sub13', <SettingOutlined />, [
      getItem(<NavLink to="/admin/settings">Cài đặt hệ thống</NavLink>, '34'),
      getItem(<NavLink to="/admin/permissions">Quản lý quyền</NavLink>, '35'),
    ]),
  ];

// Xử lý mở/đóng menu
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys as string[]);
  };

  // Xử lý click menu item để cập nhật selectedKeys
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    if (!e.key.startsWith('sub') && !e.key.startsWith('g')) {
      setSelectedKeys([e.key]); // Cập nhật item con được chọn
    }
    // Nếu click vào sub menu title, không đóng các menu khác
    if (e.key.startsWith('sub')) {
      return;
    }
  };

  // State để theo dõi item được chọn
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Đóng menu nếu click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenKeys([]);
        setSelectedKeys([]); // Reset selected khi click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  // Avatar mặc định
  const defaultAvatar = "https://ui-avatars.com/api/?name=Admin&background=random";

  return (
    <div
      ref={sidebarRef}
      className="w-[15%] h-screen text-gray-300 flex flex-col bg-white"
    >
      {/* Tiêu đề sidebar */}
      <div className="flex items-center h-[8%] ml-[9%] box-border">
        <Avatar size={32} src={defaultAvatar} className="mr-[4%]" />
        <span className="text-sm font-medium text-black">MediAdmin</span>
      </div>

      {/* Menu với Ant Design */}
      <Menu
        onClick={onClick}
        style={{ 
          borderRight: 0, 
          height: 'calc(100vh - 64px)',
        }}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        className="text-gray-300 overflow-y-auto custom-menu antd-wave-shadow"
        items={items}
      />
    </div>
  );
};

export default AdminSidebar;