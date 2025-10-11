const routes = {
  /*// Auth (Đăng nhập, Đăng ký)
    login
    register
    */

  // Client
  client_dashboard: "/client/dashboard",
  
  // Admin
  admin_dashboard: "/admin/dashboard",
  // Admin role
  user_list: "/admin/users",
  customer_list: "/admin/customers",
  test_default: "/admin/test_default",
  // admin_users: '/admin/users',
  not_found: "*",
  // Table Management
  table_type_list: "/admin/table-types",
  table_type_add: "/admin/table-types/add",
  table_list: "/admin/tables",
  // revenue statistics
  revenue_statistics: "/admin/statistics",
};

export default routes;
