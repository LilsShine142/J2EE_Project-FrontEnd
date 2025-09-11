import React, { useState, useEffect, useRef } from "react";
import { Menu, Avatar } from "antd";
import { NavLink } from "react-router-dom";
import { 
  UserOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  BarChartOutlined, 
  SettingOutlined
} from "@ant-design/icons";
import { MedicineBoxOutlined } from "@ant-design/icons";
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
    getItem('Quản lý bệnh nhân', 'sub1', <UserOutlined />, [
      getItem(<NavLink to="/admin/test_default">Test default page</NavLink>, '0'),
      getItem(<NavLink to="/admin/patients">Tất cả bệnh nhân</NavLink>, '1'),
      getItem(<NavLink to="/admin/add-patient">Thêm bệnh nhân mới</NavLink>, '2'),
    ]),

    getItem('Quản lý lịch hẹn', 'sub2', <CalendarOutlined />, [
      getItem('Lịch hẹn', 'g1', <CalendarOutlined />, [
        getItem(<NavLink to="/admin/appointments">Danh sách lịch hẹn</NavLink>, '3'),
        getItem(<NavLink to="/admin/schedule-appointment">Lịch hẹn mới</NavLink>, '4'),
      ], 'group'),
      getItem(<NavLink to="/admin/cancel-appointments">Hủy lịch hẹn</NavLink>, '5'),
    ]),

    getItem('Quản lý bác sĩ', 'sub3', <MedicineBoxOutlined />, [
      getItem(<NavLink to="/admin/doctors">Tất cả bác sĩ</NavLink>, '6'),
      getItem(<NavLink to="/admin/add-doctor">Thêm bác sĩ mới</NavLink>, '7'),
      getItem(<NavLink to="/admin/doctor-verification">Xác thực bác sĩ</NavLink>, '8'),
    ]),

    getItem('Thanh toán & Dịch vụ', 'sub4', <DollarOutlined />, [
      getItem(<NavLink to="/admin/payments">Lịch sử thanh toán</NavLink>, '9'),
      getItem(<NavLink to="/admin/add-payment">Thêm thanh toán</NavLink>, '10'),
      getItem(<NavLink to="/admin/services">Quản lý dịch vụ</NavLink>, '11'),
    ]),

    getItem('Phân tích & Báo cáo', 'sub5', <BarChartOutlined />, [
      getItem(<NavLink to="/admin/statistics">Thống kê bệnh viện</NavLink>, '12'),
      getItem(<NavLink to="/admin/reports/appointments">Báo cáo lịch hẹn</NavLink>, '13'),
      getItem(<NavLink to="/admin/reports/revenue">Báo cáo doanh thu</NavLink>, '14'),
    ]),

    getItem('Hệ thống', 'sub6', <SettingOutlined />, [
      getItem(<NavLink to="/admin/settings">Cài đặt hệ thống</NavLink>, '15'),
      getItem(<NavLink to="/admin/permissions">Quản lý quyền</NavLink>, '16'),
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
      className="w-[15%] h-screen bg-gray-900 text-gray-300 flex flex-col"
    >
      {/* Tiêu đề sidebar */}
      <div className="flex items-center h-[8%] ml-[9%] box-border">
        <Avatar size={32} src={defaultAvatar} className="mr-[4%]" />
        <span className="text-sm font-medium text-white">MediAdmin</span>
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
        className="bg-gray-900 text-gray-300 overflow-y-auto custom-menu antd-wave-shadow"
        items={items}
      />
    </div>
  );
};

export default AdminSidebar;