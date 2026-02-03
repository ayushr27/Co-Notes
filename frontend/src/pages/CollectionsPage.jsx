import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Folder, Plus, Search, MoreHorizontal, Star, Clock, Users,
    Grid, List, FolderPlus, X, Palette, Lock, Globe, Trash2,
    Edit2, ChevronRight, FileText, Image, Hash, Sparkles,
    Lightbulb, CheckSquare, Zap, BookOpen, Code, Music, Camera,
    Heart, Briefcase, GraduationCap, Home, Plane, Coffee
} from 'lucide-react';

const CollectionsPage = () => {
    const navigate = useNavigate();

    const [collections, setCollections] = useState([
        {
            id: 1,
            name: 'Work Projects',
            description: 'All work-related documents and notes',
            icon: '💼',
            color: '#667eea',
            itemCount: 12,
            isPrivate: false,
            starred: true,
            createdAt: new Date(Date.now() - 604800000)
        },
        {
            id: 2,
            name: 'Personal Notes',
            description: 'My personal thoughts and journals',
            icon: '📝',
            color: '#f093fb',
            itemCount: 8,
            isPrivate: true,
            starred: false,
            createdAt: new Date(Date.now() - 1209600000)
        },
        {
            id: 3,
            name: 'Learning Resources',
            description: 'Courses, tutorials, and study materials',
            icon: '📚',
            color: '#4facfe',
            itemCount: 24,
            isPrivate: false,
            starred: true,
            createdAt: new Date(Date.now() - 2592000000)
        },
        {
            id: 4,
            name: 'Travel Plans',
            description: 'Trip itineraries and travel ideas',
            icon: '✈️',
            color: '#43e97b',
            itemCount: 5,
            isPrivate: true,
            starred: false,
            createdAt: new Date(Date.now() - 259200000)
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filterStarred, setFilterStarred] = useState(false);

    // Create collection form state
    const [newCollectionStep, setNewCollectionStep] = useState(1);
    const [newCollection, setNewCollection] = useState({
        name: '',
        description: '',
        icon: '📁',
        color: '#667eea',
        isPrivate: true,
        template: null
    });

    const iconOptions = [
        '📁', '📂', '💼', '📝', '📚', '✈️', '🎨', '🎵', '📷', '🎮',
        '💡', '⭐', '❤️', '🚀', '🔥', '💎', '🌟', '🎯', '⚡', '🌈',
        '☕', '🏠', '🎓', '💻', '📊', '🔧', '🎁', '🌙', '☀️', '🌺'
    ];

    const colorOptions = [
        '#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a',
        '#fee140', '#a8edea', '#ff9a9e', '#fbc2eb', '#84fab0'
    ];

    const templates = [
        { id: 'blank', name: 'Blank Collection', icon: <Folder size={24} />, description: 'Start fresh with an empty collection' },
        { id: 'project', name: 'Project Hub', icon: <Briefcase size={24} />, description: 'Organize a project with docs, tasks, and notes' },
        { id: 'learning', name: 'Learning Path', icon: <GraduationCap size={24} />, description: 'Track courses and study materials' },
        { id: 'journal', name: 'Personal Journal', icon: <BookOpen size={24} />, description: 'Daily reflections and thoughts' },
        { id: 'ideas', name: 'Idea Board', icon: <Lightbulb size={24} />, description: 'Collect and organize ideas' },
        { id: 'travel', name: 'Travel Planner', icon: <Plane size={24} />, description: 'Plan trips and save destinations' }
    ];

    const handleCreateCollection = () => {
        if (newCollection.name.trim()) {
            const created = {
                id: Date.now(),
                name: newCollection.name,
                description: newCollection.description,
                icon: newCollection.icon,
                color: newCollection.color,
                itemCount: 0,
                isPrivate: newCollection.isPrivate,
                starred: false,
                createdAt: new Date()
            };
            setCollections([created, ...collections]);
            resetCreateModal();
            navigate(`/collection/${created.id}`);
        }
    };

    const resetCreateModal = () => {
        setShowCreateModal(false);
        setNewCollectionStep(1);
        setNewCollection({
            name: '',
            description: '',
            icon: '📁',
            color: '#667eea',
            isPrivate: true,
            template: null
        });
    };

    const toggleStar = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setCollections(collections.map(c =>
            c.id === id ? { ...c, starred: !c.starred } : c
        ));
    };

    const deleteCollection = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this collection?')) {
            setCollections(collections.filter(c => c.id !== id));
        }
    };

    const filteredCollections = collections.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = !filterStarred || c.starred;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="collections-page">
            <header className="collections-header">
                <div className="header-title">
                    <Folder size={28} className="header-icon" />
                    <div>
                        <h1>Collections</h1>
                        <p>Organize your notes into meaningful groups</p>
                    </div>
                </div>
                <button className="btn-create-collection" onClick={() => setShowCreateModal(true)}>
                    <FolderPlus size={18} />
                    New Collection
                </button>
            </header>

            {/* Toolbar */}
            <div className="collections-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button
                        className={`filter-btn ${filterStarred ? 'active' : ''}`}
                        onClick={() => setFilterStarred(!filterStarred)}
                    >
                        <Star size={16} fill={filterStarred ? 'currentColor' : 'none'} />
                        Starred
                    </button>
                    <div className="view-toggle">
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links-section">
                <h2 className="section-label">Quick Links</h2>
                <div className="quick-links-grid">
                    <Link to="/ideas" className="quick-link-card ideas">
                        <Lightbulb size={24} />
                        <span>Ideas</span>
                    </Link>
                    <Link to="/quick-notes" className="quick-link-card notes">
                        <Zap size={24} />
                        <span>Quick Notes</span>
                    </Link>
                    <Link to="/todos" className="quick-link-card todos">
                        <CheckSquare size={24} />
                        <span>To-Do List</span>
                    </Link>
                </div>
            </div>

            {/* Collections Grid/List */}
            <div className="collections-section">
                <h2 className="section-label">Your Collections</h2>
                <div className={`collections-container ${viewMode}`}>
                    {/* Add Collection Card */}
                    <button className="add-collection-card" onClick={() => setShowCreateModal(true)}>
                        <div className="add-icon">
                            <Plus size={24} />
                        </div>
                        <span>Create Collection</span>
                    </button>

                    {filteredCollections.map(collection => (
                        <Link
                            key={collection.id}
                            to={`/collection/${collection.id}`}
                            className="collection-card"
                            style={{ '--collection-color': collection.color }}
                        >
                            <div className="collection-header">
                                <span className="collection-icon">{collection.icon}</span>
                                <div className="collection-actions">
                                    <button
                                        className={`star-btn ${collection.starred ? 'starred' : ''}`}
                                        onClick={(e) => toggleStar(collection.id, e)}
                                    >
                                        <Star size={16} fill={collection.starred ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => deleteCollection(collection.id, e)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="collection-name">{collection.name}</h3>
                            <p className="collection-description">{collection.description}</p>
                            <div className="collection-meta">
                                <span className="item-count">
                                    <FileText size={14} />
                                    {collection.itemCount} items
                                </span>
                                <span className="privacy-badge">
                                    {collection.isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                                    {collection.isPrivate ? 'Private' : 'Shared'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {filteredCollections.length === 0 && !searchQuery && (
                <div className="empty-state">
                    <Folder size={48} />
                    <h3>No collections yet</h3>
                    <p>Create your first collection to organize your notes</p>
                    <button onClick={() => setShowCreateModal(true)}>
                        <FolderPlus size={18} /> Create Collection
                    </button>
                </div>
            )}

            {/* Create Collection Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={resetCreateModal}>
                    <div className="create-collection-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <Sparkles size={20} />
                                {newCollectionStep === 1 ? 'Choose a Template' : 'Create Collection'}
                            </h2>
                            <button onClick={resetCreateModal}><X size={20} /></button>
                        </div>

                        {/* Step 1: Choose Template */}
                        {newCollectionStep === 1 && (
                            <div className="modal-body">
                                <div className="templates-grid">
                                    {templates.map(template => (
                                        <button
                                            key={template.id}
                                            className={`template-card ${newCollection.template === template.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setNewCollection({ ...newCollection, template: template.id });
                                                setNewCollectionStep(2);
                                            }}
                                        >
                                            <div className="template-icon">{template.icon}</div>
                                            <h4>{template.name}</h4>
                                            <p>{template.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Customize Collection */}
                        {newCollectionStep === 2 && (
                            <div className="modal-body">
                                {/* Name & Description */}
                                <div className="form-group">
                                    <label>Collection Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter collection name..."
                                        value={newCollection.name}
                                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description (optional)</label>
                                    <textarea
                                        placeholder="What's this collection about?"
                                        value={newCollection.description}
                                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                {/* Icon Picker */}
                                <div className="form-group">
                                    <label>Icon</label>
                                    <div className="icon-picker">
                                        <span className="selected-icon">{newCollection.icon}</span>
                                        <div className="icon-options">
                                            {iconOptions.map(icon => (
                                                <button
                                                    key={icon}
                                                    className={`icon-option ${newCollection.icon === icon ? 'active' : ''}`}
                                                    onClick={() => setNewCollection({ ...newCollection, icon })}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color Picker */}
                                <div className="form-group">
                                    <label>Color</label>
                                    <div className="color-picker">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color}
                                                className={`color-option ${newCollection.color === color ? 'active' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewCollection({ ...newCollection, color })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Privacy */}
                                <div className="form-group">
                                    <label>Privacy</label>
                                    <div className="privacy-options">
                                        <button
                                            className={`privacy-option ${newCollection.isPrivate ? 'active' : ''}`}
                                            onClick={() => setNewCollection({ ...newCollection, isPrivate: true })}
                                        >
                                            <Lock size={18} />
                                            <div>
                                                <strong>Private</strong>
                                                <span>Only you can access</span>
                                            </div>
                                        </button>
                                        <button
                                            className={`privacy-option ${!newCollection.isPrivate ? 'active' : ''}`}
                                            onClick={() => setNewCollection({ ...newCollection, isPrivate: false })}
                                        >
                                            <Globe size={18} />
                                            <div>
                                                <strong>Shared</strong>
                                                <span>Invite others to collaborate</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="modal-footer">
                            {newCollectionStep === 2 && (
                                <button className="btn-back" onClick={() => setNewCollectionStep(1)}>
                                    Back
                                </button>
                            )}
                            <button className="btn-cancel" onClick={resetCreateModal}>
                                Cancel
                            </button>
                            {newCollectionStep === 2 && (
                                <button
                                    className="btn-create"
                                    onClick={handleCreateCollection}
                                    disabled={!newCollection.name.trim()}
                                >
                                    <FolderPlus size={18} />
                                    Create Collection
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;
