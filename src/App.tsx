import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { layoutRoutes, standaloneRoutes, adminRoutes } from './routes/routes';
import AdminDashboard from './admin/pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Các route dùng chung layout home*/}
          {/* <Route path="/" element={<HomeLayout />}> */}
            {/* <Route index element={<Navigate to="/home" replace />} /> */}
            {layoutRoutes.map((route, index) => {
              const Element = route.component;
              return (
                <Route key={index} path={route.path} element={<Element />} />
              );
            })}
          {/* </Route> */}

          {/* Các route không dùng chung layout home */}
          {/* {standaloneRoutes.map((route, index) => {
            const Element = route.component;
            return (
              <Route key={index} path={route.path} element={<Element />} />
            );
          })} */}
          {/* Admin routes */}
          {/* {adminRoutes.map((route, index) => {
            const Element = route.component;
            return (
              <Route key={index} path={route.path} element={<Element />} />
            );
          })} */}
        {/* Các route dùng chung layout home*/}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {adminRoutes.map((route, index) => {
              const Element = route.component;
              return (
                <Route key={index} path={route.path} element={<Element />} />
              );
            })}
          </Route>
          
      </Routes>
    </div>
  );
};

export default App;