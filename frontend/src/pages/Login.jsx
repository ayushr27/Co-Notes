import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
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
