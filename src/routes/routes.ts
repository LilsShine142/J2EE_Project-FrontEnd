// import config from "../config";
// import type { AppRoute } from '../types/index';
// import NotFoundPage from "../admin/pages/NotFoundPage";
// import ClientDashboard from "../client/pages/ClientDashboard";
// import AdminDashboard from "../admin/pages/AdminDashboard";
// import DefaultPage from "../admin/pages/DefaultPage";
// import UserList from "../admin/pages/Admin/UserManagement/userList";
// import CustomerList from "../admin/pages/Admin/UserManagement/customerList";
// import TableTypeList from "../admin/pages/Admin/TableManagement/TableType/tableTypeList";
// import TableList from "../admin/pages/Admin/TableManagement/tableList";
// import RevenueDashboard from "../admin/pages/Admin/RevenueStatistics/revenueStatisticsList";
// import AuthPage from "../client/pages/AuthPage";
// import DishDetailsPage from "../client/pages/DishDetailsPage";
// import CartPage from "../client/pages/CartPage";
// import OAuthCallback from "../client/components/OAuthCallback";
// import ProfilePage from "../client/pages/ProfilePage";
// import MyReservations from "../client/pages/MyReservations";
// import ClientLayout from "../client/components/Orther/ClientLayout";
// // Các route sử dụng layout HomeLayout
// const layoutRoutes: AppRoute[] = [
//   {
//     path: config.routes.client_dashboard,
//     component: ClientDashboard,
//   },
//   {
//     path: config.routes.client_layout,
//     component: ClientLayout,
//   }
// ];

// // Các route không sử dụng layout
// const standaloneRoutes: AppRoute[] = [
//   {
//     path: config.routes.callback_login,
//     component: OAuthCallback
//   },
//   {
//     path: config.routes.not_found,
//     component: NotFoundPage,
//   },
//   {
//     path: config.routes.authPage,
//     component: AuthPage
//   },
//   {
//     path: config.routes.dish_detail,  // /client/dish/:slug
//     component: DishDetailsPage
//   },
//   {
//     path: config.routes.cart,  // /client/cart
//     component: CartPage
//   },
//   {
//     path: config.routes.profile,
//     component: ProfilePage
//   },
//   {
//     path: config.routes.myreservations,
//     component: MyReservations
//   }
//   // { path: config.routes.register, component: Register },
//   // { path: config.routes.account, component: Account },
//   // { path: config.routes.account_profile, component: Profile },
//   // { path: config.routes.default_page, component: DefaultPage },
// ];

// // Admin routes
// const adminRoutes: AppRoute[] = [
//   {
//     path: config.routes.admin_dashboard,
//     component: AdminDashboard,
//   },
//   {
//     path: config.routes.test_default,
//     component: DefaultPage,
//   },
//   {
//     path: config.routes.user_list,
//     component: UserList,
//   },
//   {
//     path: config.routes.customer_list,
//     component: CustomerList,
//   },

//   {
//     path: config.routes.table_type_list,
//     component: TableTypeList,
//   },
//   {
//     path: config.routes.table_list,
//     component: TableList,
//   },
//   {
//     path: config.routes.revenue_statistics,
//     component: RevenueDashboard,
//   },
// ];

// export { layoutRoutes, standaloneRoutes, adminRoutes };













// src/routes/routes.ts
import config from "../config";
import type { AppRoute } from '../types/index';

// Pages
import ClientDashboard from "../client/pages/ClientDashboard";
import ClientLayout from "../client/components/Orther/ClientLayout";
import ProfilePage from "../client/pages/ProfilePage";
// import Reservations from "../client/pages/ClientProfile/Reservations";
// import Orders from "../client/pages/ClientProfile/Orders";
// import Notifications from "../client/pages/ClientProfile/Notifications";
// import Favorites from "../client/pages/ClientProfile/Favorites";
// import Vouchers from "../client/pages/ClientProfile/Vouchers";
// import Addresses from "../client/pages/ClientProfile/Addresses";
// import Password from "../client/pages/ClientProfile/Password";
// import Settings from "../client/pages/ClientProfile/Settings";

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