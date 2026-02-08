import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API login
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form" aria-labelledby="auth-title" aria-describedby="auth-subtitle">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-icon-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-icon-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="form-footer-link">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? <><Loader2 size={18} className="spin" /> Logging in...</> : 'Log In'}
                </button>
            </form>

            <div className="auth-footer">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;
