import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Star, File, Flame, Plus, Users, Lock, Globe } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // Mock recent documents
    const recentDocs = [
        { id: 'project-vision', title: 'Project Vision', icon: '📄', edited: '2h ago', permission: 'private' },
        { id: 'meeting-notes', title: 'Meeting Notes', icon: '📝', edited: '5h ago', permission: 'collaborative' },
        { id: 'launch-plan', title: 'Launch Plan', icon: '🚀', edited: 'yesterday', permission: 'public' },
    ];

    // Mock favorites
    const favorites = [
        { id: 'product-roadmap', title: 'Product Roadmap' },
        { id: 'quarterly-goals', title: 'Quarterly Goals' },
    ];

    const handleCreateNote = () => {
        // Navigate to new document page
        const newId = `new-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const getPermissionIcon = (permission) => {
        switch (permission) {
            case 'public': return <Globe size={12} className="perm-icon-small" />;
            case 'collaborative': return <Users size={12} className="perm-icon-small" />;
            default: return <Lock size={12} className="perm-icon-small" />;
        }
    };

    return (
        <div className="dashboard-home">
            <header className="page-header">
                <h1>{greeting}, Jane</h1>
                <button className="btn btn-primary create-note-btn" onClick={handleCreateNote}>
                    <Plus size={18} />
                    <span>New Note</span>
                </button>
            </header>

            <div className="dashboard-widgets">
                {/* Quick Actions */}
                <section className="widget quick-actions-widget">
                    <div className="quick-actions-grid">
                        <button className="quick-action-card" onClick={handleCreateNote}>
                            <div className="quick-action-icon">
                                <Plus size={24} />
                            </div>
                            <span>New Note</span>
                        </button>
                        <Link to="/community" className="quick-action-card">
                            <div className="quick-action-icon">
                                <Globe size={24} />
                            </div>
                            <span>Explore Community</span>
                        </Link>
                        <button className="quick-action-card">
                            <div className="quick-action-icon">
                                <Users size={24} />
                            </div>
                            <span>Invite Team</span>
                        </button>
                    </div>
                </section>

                {/* Recently Visited */}
                <section className="widget">
                    <div className="widget-header">
                        <Clock size={16} />
                        <h2>Recently Visited</h2>
                    </div>
                    <div className="docs-grid">
                        {recentDocs.map((doc) => (
                            <Link to={`/doc/${doc.id}`} key={doc.id} className="doc-card">
                                <div className="doc-card-header">
                                    <div className="doc-icon">{doc.icon}</div>
                                    {getPermissionIcon(doc.permission)}
                                </div>
                                <div className="doc-title">{doc.title}</div>
                                <div className="doc-meta">Edited {doc.edited}</div>
                            </Link>
                        ))}
                        {/* Add New Card */}
                        <button className="doc-card doc-card-new" onClick={handleCreateNote}>
                            <div className="doc-card-new-inner">
                                <Plus size={24} />
                                <span>New Note</span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Favorites */}
                <section className="widget">
                    <div className="widget-header">
                        <Star size={16} />
                        <h2>Favorites</h2>
                    </div>
                    <div className="docs-list">
                        {favorites.map((doc) => (
                            <Link to={`/doc/${doc.id}`} key={doc.id} className="doc-list-item">
                                <File size={16} />
                                <span>{doc.title}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Daily Streak */}
                <section className="widget">
                    <div className="widget-header">
                        <Flame size={16} />
                        <h2>Daily Streak</h2>
                    </div>
                    <div className="streak-card">
                        <div className="streak-count">
                            <span className="count">12</span>
                            <span className="label">days</span>
                        </div>
                        <div className="streak-message">
                            🔥 You're on fire! Keep writing to maintain your streak.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
