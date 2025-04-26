
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
