import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { layoutRoutes, standaloneRoutes, adminRoutes } from './routes/routes';
import AdminDashboard from './admin/pages/AdminDashboard';
import NotFoundPage from './admin/pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {layoutRoutes.map((route, index) => {
          const Element = route.component;
            return (
              <Route key={index} path={route.path} element={<Element />} />
            );
        })}

          {/* Các route không dùng chung layout home */}
          {standaloneRoutes.map((route, index) => {
            const Element = route.component;
            return (
              <Route key={index} path={route.path} element={<Element />} />
            );
          })}
        {/* Các route dùng chung layout home, là các frame trong sidebar ở admin*/}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {adminRoutes.map((route, index) => {
              const Element = route.component;
              return (
                <Route key={index} path={route.path} element={<Element />} />
              );
            })}
        </Route>
        {/* Route catch-all để xử lý link không tồn tại */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;