import config from "../config";
import NotFoundPage from "../admin/pages/NotFoundPage";
import ClientDashboard from "../client/pages/ClientDashboard";
import AdminDashboard from "../admin/pages/AdminDashboard";
import DefaultPage from "../admin/pages/DefaultPage";
import UserList from "../admin/pages/Admin/UserManagement/userList";
import CustomerList from "../admin/pages/Admin/UserManagement/customerList";
import TableTypeList from "../admin/pages/Admin/TableManagement/TableType/tableTypeList";
import TableList from "../admin/pages/Admin/TableManagement/tableList";
// Các route sử dụng layout HomeLayout
const layoutRoutes = [
  {
    path: config.routes.client_dashboard,
    component: ClientDashboard,
  },
];

// Các route không sử dụng layout
const standaloneRoutes = [
  {
    path: config.routes.not_found,
    component: NotFoundPage,
  },
  // { path: config.routes.login, component: Login },
  // { path: config.routes.register, component: Register },
  // { path: config.routes.account, component: Account },
  // { path: config.routes.account_profile, component: Profile },
  // { path: config.routes.default_page, component: DefaultPage },
];

// Admin routes
const adminRoutes = [
  {
    path: config.routes.admin_dashboard,
    component: AdminDashboard,
  },
  {
    path: config.routes.test_default,
    component: DefaultPage,
  },
  {
    path: config.routes.user_list,
    component: UserList,
  },
  {
    path: config.routes.customer_list,
    component: CustomerList,
  },

  {
    path: config.routes.table_type_list,
    component: TableTypeList,
  },
  {
    path: config.routes.table_list,
    component: TableList,
  },
];

export { layoutRoutes, standaloneRoutes, adminRoutes };
