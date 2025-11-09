import React, { useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ClientSidebar from '../Sidebar'; 
import Header from '../Header';

const ClientLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentSection = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    return pathParts[1] || 'profile'; // /client/[section]
  }, [location.pathname]);

  // Memoize hàm để tránh re-create
  const handleSectionChange = useCallback(
    (section: string) => {
      navigate(`/client/${section}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <ClientSidebar
            activeSection={currentSection}
            onSectionChange={handleSectionChange}
          />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;