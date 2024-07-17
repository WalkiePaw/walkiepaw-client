import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from "./AdminLayout";
import ProtectedAdminRoute from "../store/ProtectedAdminRoute";

const Admin = () => {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default Admin;
