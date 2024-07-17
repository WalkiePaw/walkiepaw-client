import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useParams, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { nickname } = useParams();

  return (
    <DashboardLayout nickname={nickname}>
      <Outlet context={{ nickname}} />
    </DashboardLayout>
  );
};

export default Dashboard;