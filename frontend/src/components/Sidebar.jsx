import { useState } from 'react';
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
    Globe,
    Bell,
    Folder,
    Pen,
    Plus,
    Users,
    User,
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose = () => { }, isMobile = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Handle navigation click - close on mobile
    const handleNavClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    // Track which sections are expanded
    const [expandedSections, setExpandedSections] = useState({
        workspace: true,
        publishing: true,
        private: true,
        teamspaces: false
    });

    // Teamspace State
    const [teamspaces, setTeamspaces] = useState(() => {
        const saved = localStorage.getItem('co-notes-teamspaces');
        return saved ? JSON.parse(saved) : {
            'engineering': { name: 'Engineering', icon: '⚙️' },
            'marketing': { name: 'Marketing', icon: '📣' }
        };
    });

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
            members: newTeamMembers.split(',').filter(m => m.trim()).length + 1,
            memberList: newTeamMembers.split(',').map(m => m.trim()).filter(m => m),
            docs: []
        };

        const updatedTeamspaces = { ...teamspaces, [teamId]: newTeam };
        setTeamspaces(updatedTeamspaces);
        localStorage.setItem('co-notes-teamspaces', JSON.stringify(updatedTeamspaces));

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
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation" role="navigation">
            {/* User Profile Header */}
            <div className="sidebar-header">
                <Link to="/dashboard" className="user-profile-summary">
                    <div className="avatar">J</div>
                    <span className="username">Jane's Workspace</span>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="sidebar-actions">
                <Link to="/search" className={`sidebar-item`}>
                    <Search size={18} />
                    <span>Search</span>
                </Link>
                <button className="sidebar-item new-page-btn" onClick={handleNewPage}>
                    <PlusCircle size={18} />
                    <span>New Page</span>
                </button>
            </div>

            {/* User & System */}
            <div className="sidebar-section">
                <h3 className="section-title">Account</h3>
                <div className="sidebar-tree">
                   
                    <Link to="/u/jane" className={`tree-item ${isActive('/u') ? 'active' : ''}`}>
                        <User size={16} />
                        <span>My Profile</span>
                    </Link>
                    <Link to="/notifications" className={`tree-item ${isActive('/notifications') ? 'active' : ''}`}>
                        <Bell size={16} />
                        <span>Notifications</span>
                    </Link>
                     <Link to="/settings" className={`tree-item ${isActive('/settings') ? 'active' : ''}`}>
                        <Settings size={16} />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>

            {/* Notion-Lite Core - Workspace */}
            <div className="sidebar-section">
                <div
                    className="section-header-toggle"
                    onClick={() => toggleSection('workspace')}
                >
                    <h3 className="section-title">Workspace</h3>
                    {expandedSections.workspace ?
                        <ChevronDown size={14} /> :
                        <ChevronRight size={14} />
                    }
                </div>
                {expandedSections.workspace && (
                    <div className="sidebar-tree">
                        <Link to="/dashboard" className={`tree-item ${isActive('/dashboard') ? 'active' : ''}`}>
                            <Home size={16} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/collections" className={`tree-item ${isActive('/collections') ? 'active' : ''}`}>
                            <Folder size={16} />
                            <span>Collections</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Community / Publishing */}
            <div className="sidebar-section">
                <div
                    className="section-header-toggle"
                    onClick={() => toggleSection('publishing')}
                >
                    <h3 className="section-title">Publishing</h3>
                    {expandedSections.publishing ?
                        <ChevronDown size={14} /> :
                        <ChevronRight size={14} />
                    }
                </div>
                {expandedSections.publishing && (
                    <div className="sidebar-tree">
                        <Link to="/community" className={`tree-item ${isActive('/community') ? 'active' : ''}`}>
                            <Globe size={16} />
                            <span>Community Feed</span>
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
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
