import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API signup
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-icon-wrapper">
                        <User size={18} className="input-icon" />
                        <input
                            type="text"
                            id="name"
                            placeholder="Jane Doe"
                            required
                        />
                    </div>
                </div>

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
                            minLength={6}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? <><Loader2 size={18} className="spin" /> Creating Account...</> : 'Sign Up'}
                </button>
            </form>

            <div className="auth-footer">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    );
};

export default Signup;
