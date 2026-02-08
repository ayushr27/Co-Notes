import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            {/* Background gradient orbs */}
            <div className="app-background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
            <Sidebar />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
