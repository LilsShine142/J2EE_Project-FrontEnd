import config from "../config";
import NotFoundPage from "../admin/pages/NotFoundPage";
import ClientDashboard from "../client/pages/ClientDashboard";
import AdminDashboard from "../admin/pages/AdminDashboard";
import DefaultPage from "../admin/pages/DefaultPage";
// Các route sử dụng layout HomeLayout
const layoutRoutes = [
    {
        path: config.routes.client_dashboard,
        component: ClientDashboard,
    }
];

// Các route không sử dụng layout
const standaloneRoutes = [
    {
        path: config.routes.not_found,
        component: NotFoundPage
    }
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
        component: AdminDashboard
    },
    {
        path: config.routes.test_default,
        component: DefaultPage
    }
];

export { layoutRoutes, standaloneRoutes, adminRoutes };