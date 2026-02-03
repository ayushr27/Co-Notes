import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Clock, Star, File, Flame, Plus, Users, Lock, Globe,
    TrendingUp, Zap, Calendar, Award, Target, ChevronRight,
    Sparkles, BookOpen, Lightbulb, CheckSquare, ArrowUpRight,
    BarChart3, Folder, PenTool, Trophy, Rocket, Brain,
    Coffee, Sun, Moon, Sunrise
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

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 6 : today - 1;

    // Mock recent documents
    const recentDocs = [
        { id: 'project-vision', title: 'Project Vision', icon: '📄', edited: '2h ago', permission: 'private', color: '#667eea' },
        { id: 'meeting-notes', title: 'Meeting Notes', icon: '📝', edited: '5h ago', permission: 'collaborative', color: '#f59e0b' },
        { id: 'launch-plan', title: 'Launch Plan', icon: '🚀', edited: 'yesterday', permission: 'public', color: '#22c55e' },
        { id: 'design-system', title: 'Design System', icon: '🎨', edited: '2 days ago', permission: 'private', color: '#ec4899' },
    ];

    // Quick stats
    const quickStats = [
        { label: 'Notes', value: '47', icon: <File size={20} />, color: '#667eea', trend: '+5 this week' },
        { label: 'Ideas', value: '23', icon: <Lightbulb size={20} />, color: '#fbbf24', trend: '+3 this week' },
        { label: 'Tasks Done', value: '89', icon: <CheckSquare size={20} />, color: '#22c55e', trend: '12 pending' },
        { label: 'Articles', value: '8', icon: <PenTool size={20} />, color: '#ec4899', trend: '2 drafts' },
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

    const getStreakLevel = (days) => {
        if (days >= 30) return { level: 'Legendary', color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', icon: '🏆' };
        if (days >= 14) return { level: 'On Fire', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔥' };
        if (days >= 7) return { level: 'Rising Star', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⭐' };
        if (days >= 3) return { level: 'Getting Started', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', icon: '🌱' };
        return { level: 'Beginner', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '✨' };
    };

    const streakLevel = getStreakLevel(streakData.currentStreak);
    const nextMilestone = streakData.milestones.find(m => !m.reached);

    return (
        <div className="dashboard-v2">
            {/* Hero Section */}
            <div className="dashboard-hero">
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

                {/* Streak Hero Card */}
                <div className="streak-hero-card" style={{ '--streak-gradient': streakLevel.gradient }}>
                    <div className="streak-main">
                        <div className="streak-flame">
                            <Flame size={40} />
                            <div className="flame-glow"></div>
                        </div>
                        <div className="streak-numbers">
                            <span className="streak-count">{streakData.currentStreak}</span>
                            <span className="streak-label">Day Streak</span>
                        </div>
                        <div className="streak-badge-hero">
                            <span>{streakLevel.icon}</span>
                            <span>{streakLevel.level}</span>
                        </div>
                    </div>

                    <div className="streak-week-visual">
                        {weekDays.map((day, index) => (
                            <div
                                key={day}
                                className={`day-block ${streakData.thisWeek[index] ? 'active' : ''} ${index === adjustedToday ? 'today' : ''}`}
                            >
                                <span className="day-name">{day}</span>
                                <div className="day-indicator">
                                    {streakData.thisWeek[index] && <Flame size={14} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {nextMilestone && (
                        <div className="next-milestone">
                            <Trophy size={16} />
                            <span>Next: {nextMilestone.label} ({nextMilestone.days - streakData.currentStreak} days to go)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="stats-row">
                {quickStats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
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
                            <h2><Rocket size={20} /> Quick Actions</h2>
                        </div>
                        <div className="quick-actions-v2">
                            <button className="action-tile" onClick={handleCreateNote}>
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                                    <Plus size={24} />
                                </div>
                                <span>New Note</span>
                            </button>
                            <Link to="/ideas" className="action-tile">
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                                    <Lightbulb size={24} />
                                </div>
                                <span>Capture Idea</span>
                            </Link>
                            <Link to="/todos" className="action-tile">
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                                    <CheckSquare size={24} />
                                </div>
                                <span>Add Task</span>
                            </Link>
                            <Link to="/write" className="action-tile">
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                                    <PenTool size={24} />
                                </div>
                                <span>Write Article</span>
                            </Link>
                            <Link to="/collections" className="action-tile">
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                                    <Folder size={24} />
                                </div>
                                <span>Collections</span>
                            </Link>
                            <Link to="/community" className="action-tile">
                                <div className="tile-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                                    <Globe size={24} />
                                </div>
                                <span>Explore</span>
                            </Link>
                        </div>
                    </section>

                    {/* Recent Documents */}
                    <section className="dashboard-card">
                        <div className="card-header">
                            <h2><Clock size={20} /> Recently Edited</h2>
                            <Link to="/search" className="view-all">View all <ChevronRight size={14} /></Link>
                        </div>
                        <div className="recent-docs-grid">
                            {recentDocs.map((doc) => (
                                <Link to={`/doc/${doc.id}`} key={doc.id} className="doc-card-v2" style={{ '--doc-color': doc.color }}>
                                    <div className="doc-card-header">
                                        <span className="doc-emoji">{doc.icon}</span>
                                        <span className="doc-permission">{getPermissionIcon(doc.permission)}</span>
                                    </div>
                                    <h3>{doc.title}</h3>
                                    <span className="doc-time">Edited {doc.edited}</span>
                                    <ArrowUpRight size={14} className="doc-arrow" />
                                </Link>
                            ))}
                            <button className="doc-card-v2 new-doc-card" onClick={handleCreateNote}>
                                <Plus size={28} />
                                <span>Create New</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right Column - Streak Details */}
                <div className="content-sidebar">
                    {/* Detailed Streak Stats */}
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

                        {/* Milestones */}
                        <div className="milestones-section">
                            <h4>Milestones</h4>
                            <div className="milestones-list">
                                {streakData.milestones.map((milestone, index) => (
                                    <div key={index} className={`milestone-item ${milestone.reached ? 'reached' : ''}`}>
                                        <div className="milestone-icon">
                                            {milestone.reached ? <Trophy size={16} /> : <Target size={16} />}
                                        </div>
                                        <span className="milestone-label">{milestone.label}</span>
                                        <span className="milestone-days">{milestone.days} days</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="streak-cta-btn" onClick={handleCreateNote}>
                            <Sparkles size={18} />
                            Keep the Streak Alive!
                        </button>
                    </section>

                    {/* Pro Tip */}
                    <section className="dashboard-card tip-card">
                        <Coffee size={24} />
                        <h4>Pro Tip</h4>
                        <p>Write for just 10 minutes each day to build a lasting habit. Consistency beats intensity!</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
