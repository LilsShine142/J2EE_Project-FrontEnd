const routes = {
  /*// Auth (Đăng nhập, Đăng ký)
    login
    register
    */

  // Client
  client_dashboard: "/client/dashboard",
  // client_appointments: '/client/appointments',
  // client_appointment_detail: '/client/appointments/:id',
  // client_profile: '/client/profile',
  // client_notifications: '/client/notifications',
  // Admin
  admin_dashboard: "/admin/dashboard",
  // Admin role
  user_list: "/admin/users",
  test_default: "/admin/test_default",
  // admin_users: '/admin/users',
  not_found: "*",
  // Table Management
  table_type_list: "/admin/table-types",
  table_type_add: "/admin/table-types/add",
  table_list: "/admin/tables",
};

export default routes;
