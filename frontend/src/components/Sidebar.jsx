import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Search,
    Settings,
    PlusCircle,
    FileText,
    ChevronRight,
    Hash,
    BookOpen,
    Globe,
    Flame,
    Bell,
    Folder,
    Trash2,
    Pen
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNewPage = () => {
        const newId = `new-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/dashboard" className="user-profile-summary">
                    <div className="avatar">J</div>
                    <span className="username">Jane's Notion</span>
                </Link>
                <div className="streak-badge" title="Daily Streak">
                    <Flame size={14} className="streak-icon" />
                    <span>12</span>
                </div>
            </div>

            <div className="sidebar-actions">
                <Link to="/search" className={`sidebar-item ${isActive('/search') ? 'active' : ''}`}>
                    <Search size={18} />
                    <span>Search</span>
                    <kbd className="shortcut">Ctrl K</kbd>
                </Link>
                <Link to="/notifications" className={`sidebar-item ${isActive('/notifications') ? 'active' : ''}`}>
                    <Bell size={18} />
                    <span>Notifications</span>
                </Link>
                <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
                <button className="sidebar-item" onClick={handleNewPage}>
                    <PlusCircle size={18} />
                    <span>New Page</span>
                </button>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">Quick Links</h3>
                <div className="sidebar-tree">
                    <Link to="/collections" className={`tree-item ${isActive('/collections') ? 'active' : ''}`}>
                        <Folder size={16} />
                        <span>Collections</span>
                    </Link>
                    <Link to="/trash" className={`tree-item ${isActive('/trash') ? 'active' : ''}`}>
                        <Trash2 size={16} />
                        <span>Trash</span>
                    </Link>
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">Community</h3>
                <div className="sidebar-tree">
                    <Link to="/community" className={`tree-item ${isActive('/community') ? 'active' : ''}`}>
                        <Globe size={16} />
                        <span>Explore</span>
                    </Link>
                    <Link to="/write" className={`tree-item ${isActive('/write') ? 'active' : ''}`}>
                        <Pen size={16} />
                        <span>Write Article</span>
                    </Link>
                    <Link to="/my-articles" className={`tree-item ${isActive('/my-articles') ? 'active' : ''}`}>
                        <FileText size={16} />
                        <span>My Articles</span>
                    </Link>
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">Favorites</h3>
                <div className="sidebar-tree">
                    <Link to="/doc/product-roadmap" className="tree-item">
                        <FileText size={16} />
                        <span>Product Roadmap</span>
                    </Link>
                    <Link to="/doc/journal" className="tree-item">
                        <BookOpen size={16} />
                        <span>Journal</span>
                    </Link>
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">Private</h3>
                <div className="sidebar-tree">
                    <Link to="/doc/getting-started" className="tree-item">
                        <ChevronRight size={16} />
                        <FileText size={16} />
                        <span>Getting Started</span>
                    </Link>
                    <Link to="/doc/personal-home" className="tree-item">
                        <ChevronRight size={16} />
                        <FileText size={16} />
                        <span>Personal Home</span>
                    </Link>
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">Teamspaces</h3>
                <div className="sidebar-tree">
                    <Link to="/teamspace/engineering" className="tree-item">
                        <Hash size={16} />
                        <span>Engineering</span>
                    </Link>
                    <Link to="/teamspace/marketing" className="tree-item">
                        <Hash size={16} />
                        <span>Marketing</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
