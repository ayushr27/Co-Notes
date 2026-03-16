import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const name = e.target.name.value;
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                name,
                username,
                email,
                password
            })
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert(response.data.message)
            navigate('/dashboard')
            setLoading(false)
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed')
            setLoading(false)
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form" aria-labelledby="auth-title" aria-describedby="auth-subtitle">
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
                    <label htmlFor="username">Username</label>
                    <div className="input-icon-wrapper">
                        <AtSign size={18} className="input-icon" />
                        <input
                            type="text"
                            id="username"
                            placeholder="janedoe"
                            required
                            minLength={3}
                            maxLength={30}
                            pattern="[a-zA-Z0-9_]+"
                            title="Letters, numbers, and underscores only"
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
