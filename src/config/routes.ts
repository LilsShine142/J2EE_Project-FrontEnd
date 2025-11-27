const routes = {
  /*// Auth (Đăng nhập, Đăng ký)
    login
    register
    */
  //Callback login
  callback_login: '/oauth/:provider/callback',
  
  
  // Client
  client_dashboard: "/client/dashboard",
  authPage: "/client/auth",
  // Client Notifications
  client_notifications: "/client/notifications",
  client_notification_detail: "/client/notifications/:id",

  // Dish & Cart routes
  dish_detail: "/client/dish/:slug",  // Dynamic route với slug
  cart: "/client/cart",
  vnPayCallback: "/client/payment/callback",
  vnPayIPN: "/client/payment/ipn",

  // User Profile
  profile: "/client/profile",

  // My Reservations
  myreservations: "/client/my-reservations",
  
  client_layout: "/client",

  // Admin
  admin_dashboard: "/admin/dashboard",
  admin_profile: "/admin/profile",
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
  // Meal Management
  meal_list: "/admin/meals",
  // Booking Management
  booking_list: "/admin/bookings",
  // Order Management
  order_list: "/admin/orders",
  // Bill Management
  bill_list: "/admin/bills",
  add_new_bill: "/admin/bills/add",
  // Role & Permission Management
  role_list: "/admin/roles",
  permission_list: "/admin/permissions",
  role_permission: "/admin/role-permissions",
  // Email Management
  email_list: "/admin/emails",
  email_send: "/admin/emails/send",
  // Log list manager
  logs_list: "/admin/logs",
  // Notifications management
  notification_list: "/admin/notifications",
  send_notification: "/admin/send-notification",
  notification_update: "/admin/notifications/update/:id",
  notification_view: "/admin/notifications/view/:id",
  // Statistics
  // revenue statistics
  revenue_statistics: "/admin/statistics",
};

export default routes;
