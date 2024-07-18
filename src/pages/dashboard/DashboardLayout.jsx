// src/pages/Dashboard/DashboardLayout.jsx
import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardReview from './DashboardReview';
import PostList from './PostList';
import Introduction from './Introduction';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nickname = searchParams.get('nickname');
  const [activeTab, setActiveTab] = useState('introduction');
  
    return (
      <div className="flex h-screen">
        <DashboardSidebar nickname={nickname} />
        <div className="flex-auto overflow-auto p-6">
          {activeTab === 'introduction' && <Introduction nickname={nickname} />}
          {activeTab === 'review' && <DashboardReview nickname={nickname} />}
          {activeTab === 'posts' && <PostList nickname={nickname} />}
        </div>
      </div>
    );
  };

export default DashboardLayout;