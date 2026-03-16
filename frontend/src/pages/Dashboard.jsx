import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Clock, Star, File, Plus, Users, Lock, Globe,
    Zap, ChevronRight, Sparkles, BookOpen, Lightbulb,
    CheckSquare, ArrowUpRight, BarChart3, Folder, PenTool,
    Sun, Moon, Sunrise, Calendar, Award, Brain, Trophy, Target,
    Loader2
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentDocs, setRecentDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const greetingIcon = hour < 12 ? <Sunrise size={28} /> : hour < 18 ? <Sun size={28} /> : <Moon size={28} />;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user profile, stats, and recent docs in parallel
                const [profileRes, statsRes, docsRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/users/me/stats'),
                    api.get('/documents') // We can slice the first few
                ]);

                setUser(profileRes.data);
                setStats(statsRes.data);
                // The documents API returns an object with a documents array
                setRecentDocs(docsRes.data.documents ? docsRes.data.documents.slice(0, 4) : []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // If unauthorized, redirect to login
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Streak data (Keeping mock for now since backend doesn't track streaks yet)
    const streakData = {
        currentStreak: 12,
        longestStreak: 28,
        totalDays: 156,
        thisWeek: [true, true, true, true, true, false, false],
        lastMonthStats: {
            notesCreated: 24,
            wordsWritten: 12500,
            articlesPublished: 3
        },
        milestones: [
            { days: 7, reached: true, label: '1 Week' },
            { days: 14, reached: false, label: '2 Weeks' },
            { days: 30, reached: false, label: '1 Month' },
            { days: 100, reached: false, label: '100 Days' }
        ]
    };

    // Quick stats using backend data
    const quickStats = stats ? [
        { label: 'Notes', value: stats.documents.toString(), icon: <File size={20} />, trend: 'Active' },
        { label: 'Ideas', value: stats.ideas.toString(), icon: <Lightbulb size={20} />, trend: 'Active' },
        { label: 'Tasks Done', value: stats.todosCompleted.toString(), icon: <CheckSquare size={20} />, trend: `${stats.todosPending} pending` },
        { label: 'Quick Notes', value: stats.quickNotes.toString(), icon: <PenTool size={20} />, trend: 'Captured' },
    ] : [];

    const handleCreateNote = () => {
        const newId = `new-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const getPermissionIcon = (permission) => {
        switch (permission) {
            case 'public': return <Globe size={12} className="perm-icon" />;
            case 'collaborative': return <Users size={12} className="perm-icon" />;
            default: return <Lock size={12} className="perm-icon" />;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-v2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: '#667eea' }} />
            </div>
        );
    }

    return (
        <div className="dashboard-v2" role="main">
            {/* Hero Section */}
            <header className="dashboard-hero" aria-label="Welcome section">
                <div className="hero-content">
                    <div className="greeting-area">
                        <div className="greeting-icon">{greetingIcon}</div>
                        <div>
                            <h1>{greeting}, {user?.name?.split(' ')[0] || 'User'}!</h1>
                            <p>Ready to capture your thoughts and ideas today?</p>
                        </div>
                    </div>
                    <button className="btn-create-primary" onClick={handleCreateNote}>
                        <Plus size={20} />
                        <span>New Note</span>
                    </button>
                </div>
            </header>

            {/* Quick Stats Row */}
            <div className="stats-row">
                {quickStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <span className="stat-trend">{stat.trend}</span>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content-grid">
                {/* Left Column */}
                <div className="content-main">
                    {/* Quick Actions */}
                    <section className="dashboard-card">
                        <div className="card-header">
                            <h2><Zap size={20} /> Quick Actions</h2>
                        </div>
                        <div className="quick-actions-v2">
                            <button className="action-tile" onClick={handleCreateNote}>
                                <div className="tile-icon">
                                    <Plus size={24} />
                                </div>
                                <span>New Note</span>
                            </button>
                            <Link to="/ideas" className="action-tile">
                                <div className="tile-icon">
                                    <Lightbulb size={24} />
                                </div>
                                <span>Capture Idea</span>
                            </Link>
                            <Link to="/todos" className="action-tile">
                                <div className="tile-icon">
                                    <CheckSquare size={24} />
                                </div>
                                <span>Add Task</span>
                            </Link>
                            <Link to="/write" className="action-tile">
                                <div className="tile-icon">
                                    <PenTool size={24} />
                                </div>
                                <span>Write Article</span>
                            </Link>
                            <Link to="/collections" className="action-tile">
                                <div className="tile-icon">
                                    <Folder size={24} />
                                </div>
                                <span>Collections</span>
                            </Link>
                            <Link to="/community" className="action-tile">
                                <div className="tile-icon">
                                    <Globe size={24} />
                                </div>
                                <span>Explore</span>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Right Column - Progress */}
                <div className="content-sidebar">
                    {/* Progress Stats */}
                    <section className="dashboard-card streak-details-card">
                        <div className="card-header">
                            <h2><BarChart3 size={20} /> Your Progress</h2>
                        </div>

                        <div className="streak-stats-grid">
                            <div className="streak-stat">
                                <Award size={24} />
                                <div>
                                    <span className="value">{streakData.longestStreak}</span>
                                    <span className="label">Best Streak</span>
                                </div>
                            </div>
                            <div className="streak-stat">
                                <Calendar size={24} />
                                <div>
                                    <span className="value">{streakData.totalDays}</span>
                                    <span className="label">Total Days</span>
                                </div>
                            </div>
                        </div>

                        <div className="monthly-breakdown">
                            <h4>This Month</h4>
                            <div className="breakdown-items">
                                <div className="breakdown-item">
                                    <File size={18} />
                                    <span className="breakdown-value">{streakData.lastMonthStats.notesCreated}</span>
                                    <span className="breakdown-label">Notes Created</span>
                                </div>
                                <div className="breakdown-item">
                                    <Brain size={18} />
                                    <span className="breakdown-value">{(streakData.lastMonthStats.wordsWritten / 1000).toFixed(1)}k</span>
                                    <span className="breakdown-label">Words Written</span>
                                </div>
                                <div className="breakdown-item">
                                    <PenTool size={18} />
                                    <span className="breakdown-value">{streakData.lastMonthStats.articlesPublished}</span>
                                    <span className="breakdown-label">Articles</span>
                                </div>
                            </div>
                        </div>

                        <button className="streak-cta-btn" onClick={handleCreateNote}>
                            <Sparkles size={18} />
                            Keep Writing!
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
