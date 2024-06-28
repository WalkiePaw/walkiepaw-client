// src/pages/Dashboard/DashboardLayout.jsx

import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
