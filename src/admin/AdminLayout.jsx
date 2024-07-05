import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
