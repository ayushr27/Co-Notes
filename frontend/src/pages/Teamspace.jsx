import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, FileText, Plus, Settings, MoreHorizontal } from 'lucide-react';

const Teamspace = () => {
    const { teamId } = useParams();

    // Mock teamspace data
    const teamspaces = {
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

    const team = teamspaces[teamId] || {
        name: 'Unknown Team',
        icon: '👥',
        description: 'Team not found',
        members: 0,
        docs: []
    };

    return (
        <div className="teamspace-page">
            <div className="teamspace-header">
                <div className="teamspace-title-row">
                    <div className="teamspace-icon">{team.icon}</div>
                    <div className="teamspace-info">
                        <h1>{team.name}</h1>
                        <p>{team.description}</p>
                    </div>
                </div>
                <div className="teamspace-actions">
                    <button className="btn btn-outline">
                        <Users size={16} />
                        <span>{team.members} members</span>
                    </button>
                    <button className="btn btn-outline">
                        <Settings size={16} />
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={16} />
                        <span>New Page</span>
                    </button>
                </div>
            </div>

            <div className="teamspace-content">
                <div className="teamspace-section">
                    <h2>Pages</h2>
                    <div className="teamspace-docs-grid">
                        {team.docs.map((doc) => (
                            <Link to={`/doc/${doc.id}`} key={doc.id} className="teamspace-doc-card">
                                <div className="doc-card-top">
                                    <span className="doc-icon-lg">{doc.icon}</span>
                                    <button className="doc-menu-btn">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <h3>{doc.title}</h3>
                                <p className="doc-meta">Edited {doc.lastEdited}</p>
                            </Link>
                        ))}
                        <button className="teamspace-doc-card add-new-card">
                            <Plus size={32} />
                            <span>Add a page</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teamspace;
