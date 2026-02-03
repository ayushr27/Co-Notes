import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Folder, FileText, Plus, MoreHorizontal, Grid, List, ChevronRight, ArrowLeft, Trash2, Edit2 } from 'lucide-react';

const Collections = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');

    // Mock folders/collections
    const initialCollections = [
        {
            id: 'work',
            name: 'Work',
            icon: '💼',
            color: '#3b82f6',
            docsCount: 3,
            lastUpdated: '2 hours ago',
            docs: [
                { id: 'project-vision', title: 'Project Vision', icon: '📄' },
                { id: 'meeting-notes', title: 'Meeting Notes', icon: '📝' },
                { id: 'launch-plan', title: 'Launch Plan', icon: '🚀' },
            ]
        },
        {
            id: 'personal',
            name: 'Personal',
            icon: '🏠',
            color: '#10b981',
            docsCount: 2,
            lastUpdated: 'yesterday',
            docs: [
                { id: 'personal-home', title: 'Personal Home', icon: '🏠' },
                { id: 'journal', title: 'Journal', icon: '📓' },
            ]
        },
        {
            id: 'learning',
            name: 'Learning',
            icon: '📚',
            color: '#8b5cf6',
            docsCount: 1,
            lastUpdated: '3 days ago',
            docs: [
                { id: 'getting-started', title: 'Getting Started', icon: '📚' },
            ]
        },
        {
            id: 'projects',
            name: 'Projects',
            icon: '🚀',
            color: '#f59e0b',
            docsCount: 0,
            lastUpdated: '1 week ago',
            docs: []
        },
    ];

    const [collections, setCollections] = useState(initialCollections);

    // Mock documents without folder
    const unorganized = [
        { id: 'quick-notes', title: 'Quick Notes', icon: '📝' },
        { id: 'ideas', title: 'Ideas', icon: '💡' },
        { id: 'todo', title: 'To-Do List', icon: '✅' },
    ];

    const currentCollection = collectionId ? collections.find(c => c.id === collectionId) : null;

    const handleCreateCollection = () => {
        const name = prompt('Enter collection name:');
        if (name) {
            const newCol = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name,
                icon: '📁',
                color: '#6366f1',
                docsCount: 0,
                lastUpdated: 'Just now',
                docs: []
            };
            setCollections([...collections, newCol]);
        }
    };

    if (collectionId && !currentCollection) {
        return (
            <div className="collections-page">
                <div className="collections-container">
                    <button className="back-link" onClick={() => navigate('/collections')}>
                        <ArrowLeft size={16} /> Back to Collections
                    </button>
                    <div className="error-state">
                        <h2>Collection not found</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (currentCollection) {
        return (
            <div className="collections-page">
                <div className="collections-container">
                    <header className="collections-header">
                        <div className="collection-title-area">
                            <button className="back-btn" onClick={() => navigate('/collections')}>
                                <ArrowLeft size={18} />
                            </button>
                            <div className="collection-icon-large" style={{ backgroundColor: currentCollection.color + '20', color: currentCollection.color }}>
                                {currentCollection.icon}
                            </div>
                            <div>
                                <h1>{currentCollection.name}</h1>
                                <p>{currentCollection.docsCount} documents recorded</p>
                            </div>
                        </div>
                        <div className="collections-actions">
                            <button className="btn btn-outline">
                                <Edit2 size={16} /> Edit
                            </button>
                            <button className="btn btn-primary">
                                <Plus size={18} /> Add Document
                            </button>
                        </div>
                    </header>

                    <div className="collections-content">
                        {currentCollection.docs.length === 0 ? (
                            <div className="empty-state">
                                <Folder size={48} />
                                <h2>This collection is empty</h2>
                                <p>Start adding documents to organize your work</p>
                            </div>
                        ) : (
                            <div className={`docs-grid ${viewMode}`}>
                                {currentCollection.docs.map((doc) => (
                                    <Link to={`/doc/${doc.id}`} key={doc.id} className="doc-card">
                                        <div className="doc-card-header">
                                            <span className="doc-emoji">{doc.icon}</span>
                                            <button className="doc-more-btn"><MoreHorizontal size={16} /></button>
                                        </div>
                                        <div className="doc-card-body">
                                            <h3>{doc.title}</h3>
                                            <p className="doc-meta">Updated 2h ago</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="collections-page">
            <div className="collections-container">
                <header className="collections-header">
                    <div>
                        <h1>Collections</h1>
                        <p>Organize your documents into folders</p>
                    </div>
                    <div className="collections-actions">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button className="btn btn-primary" onClick={handleCreateCollection}>
                            <Plus size={18} /> New Collection
                        </button>
                    </div>
                </header>

                <div className="collections-content">
                    <section className="collections-section">
                        <h2 className="section-label">Folders</h2>
                        <div className={`collections-grid ${viewMode}`}>
                            {collections.map((collection) => (
                                <Link to={`/collection/${collection.id}`} key={collection.id} className="collection-card">
                                    <div className="collection-icon" style={{ backgroundColor: collection.color + '20', color: collection.color }}>
                                        {collection.icon}
                                    </div>
                                    <div className="collection-info">
                                        <h3>{collection.name}</h3>
                                        <span className="collection-meta">{collection.docsCount} items</span>
                                    </div>
                                    <ChevronRight size={18} className="collection-arrow" />
                                </Link>
                            ))}
                            <button className="collection-card add-collection" onClick={handleCreateCollection}>
                                <div className="add-icon-wrapper">
                                    <Plus size={24} />
                                </div>
                                <span>Create Collection</span>
                            </button>
                        </div>
                    </section>

                    <section className="collections-section">
                        <h2 className="section-label">Unorganized</h2>
                        <div className="unorganized-list">
                            {unorganized.map((doc) => (
                                <Link to={`/doc/${doc.id}`} key={doc.id} className="unorganized-item">
                                    <span className="doc-emoji">{doc.icon}</span>
                                    <span>{doc.title}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Collections;
