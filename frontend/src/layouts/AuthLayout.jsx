import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = ({ title, subtitle }) => {
    return (
        <div className="auth-layout" role="main">
            <Link to="/" className="auth-back-link" aria-label="Back to home">
                <ArrowLeft size={20} aria-hidden />
                Back to Home
            </Link>

            <div className="auth-card">
                <header className="auth-header">
                    <Link to="/" className="auth-logo">Co-Notes</Link>
                    <h2 id="auth-title">{title}</h2>
                    <p id="auth-subtitle">{subtitle}</p>
                </header>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
