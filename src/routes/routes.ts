import config from "../config";
import type { AppRoute } from '../types/index';

// Pages
import ClientDashboard from "../client/pages/ClientDashboard";
import ClientLayout from "../client/components/Orther/ClientLayout";
import ProfilePage from "../client/pages/ProfilePage";

import AuthPage from "../client/pages/AuthPage";
import DishDetailsPage from "../client/pages/DishDetailsPage";
import CartPage from "../client/pages/CartPage";
import OAuthCallback from "../client/components/OAuthCallback";

import AdminDashboard from "../admin/pages/AdminDashboard";
import DefaultPage from "../admin/pages/DefaultPage";
import UserList from "../admin/pages/Admin/UserManagement/userList";
import CustomerList from "../admin/pages/Admin/UserManagement/customerList";
import TableTypeList from "../admin/pages/Admin/TableManagement/TableType/tableTypeList";
import TableList from "../admin/pages/Admin/TableManagement/tableList";
import RevenueDashboard from "../admin/pages/Admin/RevenueStatistics/revenueStatisticsList";
import NotFoundPage from "../admin/pages/NotFoundPage";
import MyReservations from "../client/pages/MyReservations";
import MealList from "../admin/pages/Manager/MealManagement/mealList";
import BookingList from "../admin/pages/Admin/BookingManagement/BookingList";
import OrderList from "../admin/pages/Manager/OrderManagement/orderList";
import BillList from "../admin/pages/Manager/BillManagement/billList";
import AddNewBill from "../admin/pages/Manager/BillManagement/addNewBill";
import RoleList from "../admin/pages/Admin/Role_Permission/Role/RoleList";
import PermissionList from "../admin/pages/Admin/Role_Permission/Permission/PermissionList";
import RolePermissionList from "../admin/pages/Admin/Role_Permission/RolePermission/RolePermissionList";

// Layout Routes (dùng ClientLayout cho dashboard)
export const layoutRoutes: AppRoute[] = [
  {
    path: config.routes.client_dashboard,
    component: ClientDashboard,
  },
];

// Standalone Routes (không dùng layout)
export const standaloneRoutes: AppRoute[] = [
  { path: config.routes.authPage, component: AuthPage },
  { path: config.routes.callback_login, component: OAuthCallback },
  { path: config.routes.dish_detail, component: DishDetailsPage },
  { path: config.routes.cart, component: CartPage },
  { path: config.routes.not_found, component: NotFoundPage },
];

// Admin Nested Routes
export const adminRoutes: AppRoute[] = [
  { path: config.routes.admin_dashboard, component: AdminDashboard },
  { path: config.routes.test_default, component: DefaultPage },
  { path: config.routes.user_list, component: UserList },
  { path: config.routes.customer_list, component: CustomerList },
  { path: config.routes.table_type_list, component: TableTypeList },
  { path: config.routes.table_list, component: TableList },
  { path: config.routes.revenue_statistics, component: RevenueDashboard },
  { path: config.routes.meal_list, component: MealList },
  { path: config.routes.booking_list, component: BookingList }, 
  { path: config.routes.order_list, component: OrderList },
  { path: config.routes.bill_list, component: BillList },
  { path: config.routes.add_new_bill, component: AddNewBill },
  { path: config.routes.role_list, component: RoleList }, 
  { path: config.routes.permission_list, component: PermissionList },
  { path: config.routes.role_permission, component: RolePermissionList }, 
];

// Client Profile Nested Routes (dùng Outlet)
export const profileRoutes: AppRoute[] = [
  { path: config.routes.profile, component: ProfilePage },
  { path: config.routes.myreservations, component: MyReservations },
  // { path: config.routes.profile_orders, component: Orders },
  // { path: config.routes.profile_notifications, component: Notifications },
  // { path: config.routes.profile_favorites, component: Favorites },
  // { path: config.routes.profile_vouchers, component: Vouchers },
  // { path: config.routes.profile_addresses, component: Addresses },
  // { path: config.routes.profile_password, component: Password },
  // { path: config.routes.profile_settings, component: Settings },
];