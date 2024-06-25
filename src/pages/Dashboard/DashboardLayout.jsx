// src/pages/Dashboard/DashboardLayout.jsx

import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
