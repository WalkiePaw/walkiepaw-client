import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from "./AdminLayout";
import ProtectedAdminRoute from "../store/ProtectedAdminRoute";

const Admin = () => {
  return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
  );
};

export default Admin;
