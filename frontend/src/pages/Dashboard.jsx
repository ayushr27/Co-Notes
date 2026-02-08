import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Clock, Star, File, Plus, Users, Lock, Globe,
    Zap, ChevronRight, Sparkles, BookOpen, Lightbulb,
    CheckSquare, ArrowUpRight, BarChart3, Folder, PenTool,
    Sun, Moon, Sunrise, Calendar, Award, Brain, Trophy, Target
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const greetingIcon = hour < 12 ? <Sunrise size={28} /> : hour < 18 ? <Sun size={28} /> : <Moon size={28} />;

    // Streak data
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

    // Mock recent documents
    const recentDocs = [
        { id: 'project-vision', title: 'Project Vision', icon: '📄', edited: '2h ago', permission: 'private' },
        { id: 'meeting-notes', title: 'Meeting Notes', icon: '📝', edited: '5h ago', permission: 'collaborative' },
        { id: 'launch-plan', title: 'Launch Plan', icon: '🚀', edited: 'yesterday', permission: 'public' },
        { id: 'design-system', title: 'Design System', icon: '🎨', edited: '2 days ago', permission: 'private' },
    ];

    // Quick stats - monochrome
    const quickStats = [
        { label: 'Notes', value: '47', icon: <File size={20} />, trend: '+5 this week' },
        { label: 'Ideas', value: '23', icon: <Lightbulb size={20} />, trend: '+3 this week' },
        { label: 'Tasks Done', value: '89', icon: <CheckSquare size={20} />, trend: '12 pending' },
        { label: 'Articles', value: '8', icon: <PenTool size={20} />, trend: '2 drafts' },
    ];

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

    return (
        <div className="dashboard-v2" role="main">
            {/* Hero Section */}
            <header className="dashboard-hero" aria-label="Welcome section">
                <div className="hero-content">
                    <div className="greeting-area">
                        <div className="greeting-icon">{greetingIcon}</div>
                        <div>
                            <h1>{greeting}, Jane!</h1>
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
