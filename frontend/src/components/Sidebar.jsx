import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Search,
    Settings,
    PlusCircle,
    FileText,
    ChevronRight,
    ChevronDown,
    Hash,
    BookOpen,
    Globe,
    Flame,
    Bell,
    Folder,
    Trash2,
    Pen,
    Lightbulb,
    Zap,
    CheckSquare,
    Star,
    Plus,
    Users
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Track which sections are expanded
    const [expandedSections, setExpandedSections] = useState({
        private: true,
        teamspaces: true
    });

    // Teamspace State
    const [teamspaces, setTeamspaces] = useState(() => {
        const saved = localStorage.getItem('co-notes-teamspaces');
        return saved ? JSON.parse(saved) : {
            'engineering': { name: 'Engineering', icon: '⚙️' },
            'marketing': { name: 'Marketing', icon: '📣' }
        };
    });

    // Create Modal State
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamIcon, setNewTeamIcon] = useState('👥');
    const [newTeamDesc, setNewTeamDesc] = useState('');
    const [newTeamMembers, setNewTeamMembers] = useState('');

    const handleNewPage = () => {
        const newId = `new-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCreateTeamspace = () => {
        if (!newTeamName.trim()) return;

        const teamId = newTeamName.toLowerCase().replace(/\s+/g, '-');
        const newTeam = {
            name: newTeamName,
            icon: newTeamIcon,
            description: newTeamDesc || `Workspace for ${newTeamName}`,
            members: newTeamMembers.split(',').filter(m => m.trim()).length + 1, // +1 for creator
            memberList: newTeamMembers.split(',').map(m => m.trim()).filter(m => m),
            docs: []
        };

        const updatedTeamspaces = { ...teamspaces, [teamId]: newTeam };
        setTeamspaces(updatedTeamspaces);
        localStorage.setItem('co-notes-teamspaces', JSON.stringify(updatedTeamspaces));

        // Also update full teamspace data in localStorage for the Teamspace page to pick up
        const existingFullData = JSON.parse(localStorage.getItem('co-notes-teamspaces-full') || '{}');
        const defaultFullData = {
            'engineering': {
                name: 'Engineering',
                icon: '⚙️',
                description: 'Technical documentation and engineering resources',
                members: 12,
                docs: [
                    { id: 'api-docs', title: 'API Documentation', icon: '📚', lastEdited: '2h ago' },
                    { id: 'architecture', title: 'System Architecture', icon: '🏗️', lastEdited: '1 day ago' },
                    { id: 'coding-standards', title: 'Coding Standards', icon: '📋', lastEdited: '3 days ago' },
                    { id: 'sprint-planning', title: 'Sprint Planning', icon: '🎯', lastEdited: '5h ago' },
                ]
            },
            'marketing': {
                name: 'Marketing',
                icon: '📣',
                description: 'Marketing strategies, campaigns and brand guidelines',
                members: 8,
                docs: [
                    { id: 'brand-guide', title: 'Brand Guidelines', icon: '🎨', lastEdited: '1 day ago' },
                    { id: 'campaign-q1', title: 'Q1 Campaign Plan', icon: '📊', lastEdited: '4h ago' },
                    { id: 'social-calendar', title: 'Social Media Calendar', icon: '📅', lastEdited: 'today' },
                    { id: 'competitor-analysis', title: 'Competitor Analysis', icon: '🔍', lastEdited: '2 days ago' },
                ]
            }
        };

        const mergedFullData = { ...defaultFullData, ...existingFullData, [teamId]: newTeam };
        localStorage.setItem('co-notes-teamspaces-full', JSON.stringify(mergedFullData));

        setShowCreateTeamModal(false);
        setNewTeamName('');
        setNewTeamDesc('');
        setNewTeamMembers('');
        navigate(`/teamspace/${teamId}`);
    };

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
                <button className="sidebar-item new-page-btn" onClick={handleNewPage}>
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
                    <Link to="/ideas" className={`tree-item ${isActive('/ideas') ? 'active' : ''}`}>
                        <Lightbulb size={16} />
                        <span>Ideas</span>
                    </Link>
                    <Link to="/quick-notes" className={`tree-item ${isActive('/quick-notes') ? 'active' : ''}`}>
                        <Zap size={16} />
                        <span>Quick Notes</span>
                    </Link>
                    <Link to="/todos" className={`tree-item ${isActive('/todos') ? 'active' : ''}`}>
                        <CheckSquare size={16} />
                        <span>To-Do List</span>
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
                <div
                    className="section-header-toggle"
                    onClick={() => toggleSection('private')}
                >
                    <h3 className="section-title">Private</h3>
                    {expandedSections.private ?
                        <ChevronDown size={14} /> :
                        <ChevronRight size={14} />
                    }
                </div>
                {expandedSections.private && (
                    <div className="sidebar-tree">
                        <Link to="/doc/getting-started" className={`tree-item ${isActive('/doc/getting-started') ? 'active' : ''}`}>
                            <FileText size={16} />
                            <span>Getting Started</span>
                        </Link>
                        <Link to="/doc/personal-home" className={`tree-item ${isActive('/doc/personal-home') ? 'active' : ''}`}>
                            <Home size={16} />
                            <span>Personal Home</span>
                        </Link>
                        <button className="tree-item add-page-btn" onClick={handleNewPage}>
                            <Plus size={16} />
                            <span>Add a page</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="sidebar-section">
                <div
                    className="section-header-toggle"
                    onClick={() => toggleSection('teamspaces')}
                >
                    <h3 className="section-title">Teamspaces</h3>
                    {expandedSections.teamspaces ?
                        <ChevronDown size={14} /> :
                        <ChevronRight size={14} />
                    }
                </div>
                {expandedSections.teamspaces && (
                    <div className="sidebar-tree">
                        {Object.entries(teamspaces).map(([id, team]) => (
                            <Link key={id} to={`/teamspace/${id}`} className={`tree-item ${isActive(`/teamspace/${id}`) ? 'active' : ''}`}>
                                <Hash size={16} />
                                <span>{team.name}</span>
                            </Link>
                        ))}
                        <button className="tree-item add-page-btn" onClick={() => setShowCreateTeamModal(true)}>
                            <Users size={16} />
                            <span>Create Teamspace</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Create Teamspace Modal */}
            {showCreateTeamModal && (
                <div className="modal-overlay" onClick={() => setShowCreateTeamModal(false)}>
                    <div className="idea-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><Users size={20} /> Create Teamspace</h2>
                            <button onClick={() => setShowCreateTeamModal(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="team-icon-select" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '60px', height: '60px', fontSize: '2rem',
                                    background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {newTeamIcon}
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Team Name"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="idea-title-input"
                                autoFocus
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newTeamDesc}
                                onChange={(e) => setNewTeamDesc(e.target.value)}
                                className="idea-description-input"
                                rows={3}
                                style={{ minHeight: '80px' }}
                            />
                            <div className="invite-section">
                                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                                    Invite Members (usernames comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. alice, bob, charlie"
                                    value={newTeamMembers}
                                    onChange={(e) => setNewTeamMembers(e.target.value)}
                                    className="idea-tags-input"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowCreateTeamModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-save" onClick={handleCreateTeamspace}>
                                <Plus size={18} />
                                Create Team
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
