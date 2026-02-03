import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, RotateCcw, Eye, User } from 'lucide-react';

const DocumentHistory = () => {
    const { id } = useParams();

    // Mock version history
    const versions = [
        {
            id: 'v5',
            version: 5,
            date: 'Today, 3:45 PM',
            author: 'You',
            changes: 'Updated project timeline and added new section',
            isCurrent: true
        },
        {
            id: 'v4',
            version: 4,
            date: 'Today, 11:30 AM',
            author: 'Sarah Lin',
            changes: 'Added meeting notes summary',
            isCurrent: false
        },
        {
            id: 'v3',
            version: 3,
            date: 'Yesterday, 5:00 PM',
            author: 'You',
            changes: 'Fixed typos and formatting',
            isCurrent: false
        },
        {
            id: 'v2',
            version: 2,
            date: 'Yesterday, 2:15 PM',
            author: 'John Doe',
            changes: 'Added initial content structure',
            isCurrent: false
        },
        {
            id: 'v1',
            version: 1,
            date: '2 days ago',
            author: 'You',
            changes: 'Document created',
            isCurrent: false
        },
    ];

    return (
        <div className="history-page">
            <div className="history-container">
                <header className="history-header">
                    <div>
                        <Link to={`/doc/${id}`} className="back-link">← Back to document</Link>
                        <h1>Version History</h1>
                        <p>Document ID: {id}</p>
                    </div>
                </header>

                <div className="history-content">
                    <div className="versions-timeline">
                        {versions.map((version, index) => (
                            <div key={version.id} className={`version-item ${version.isCurrent ? 'current' : ''}`}>
                                <div className="version-line">
                                    <div className="version-dot"></div>
                                    {index < versions.length - 1 && <div className="version-connector"></div>}
                                </div>
                                <div className="version-card">
                                    <div className="version-header">
                                        <span className="version-number">Version {version.version}</span>
                                        {version.isCurrent && <span className="current-badge">Current</span>}
                                    </div>
                                    <p className="version-changes">{version.changes}</p>
                                    <div className="version-meta">
                                        <span><User size={14} /> {version.author}</span>
                                        <span><Clock size={14} /> {version.date}</span>
                                    </div>
                                    <div className="version-actions">
                                        <button className="btn btn-sm btn-outline">
                                            <Eye size={14} /> Preview
                                        </button>
                                        {!version.isCurrent && (
                                            <button className="btn btn-sm btn-outline">
                                                <RotateCcw size={14} /> Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentHistory;
