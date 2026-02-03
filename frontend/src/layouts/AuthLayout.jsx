import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = ({ title, subtitle }) => {
    return (
        <div className="auth-layout">
            <Link to="/" className="auth-back-link">
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">Co-Notes</Link>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
