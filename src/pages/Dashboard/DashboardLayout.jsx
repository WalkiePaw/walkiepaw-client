// src/pages/Dashboard/DashboardLayout.jsx

import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-auto overflow-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
