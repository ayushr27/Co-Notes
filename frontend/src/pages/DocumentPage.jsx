import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import SharePopover from '../components/SharePopover';
import {
    Smile, Image as ImageIcon, MoreHorizontal, Star, Clock,
    MessageSquare, ChevronDown, Plus, Hash, Trash2, Copy,
    ArrowLeft, History, Users, Lock, Globe, Calendar, Target,
    CheckCircle2, Circle, ArrowRight, X
} from 'lucide-react';

const DocumentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [icon, setIcon] = useState(null);
    const [permission, setPermission] = useState('private');
    const [isFavorite, setIsFavorite] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [lastSaved, setLastSaved] = useState('Just now');
    const [docType, setDocType] = useState('default');
    const [tags, setTags] = useState([]);
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagInputValue, setTagInputValue] = useState('');

    const iconOptions = ['📄', '📝', '📋', '📊', '🎯', '💡', '🚀', '⭐', '📚', '🔥', '💼', '🎨', '🔧', '📌', '✅', '🏠'];

    // Document templates
    const documentTemplates = {
        'product-roadmap': {
            title: 'Product Roadmap',
            icon: '📊',
            cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
            type: 'roadmap',
            isFavorite: true,
            tags: ['product', 'roadmap', '2024']
        },
        'journal': {
            title: 'Journal',
            icon: '📓',
            cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200',
            type: 'journal',
            isFavorite: true,
            tags: ['personal', 'daily']
        },
        'project-vision': {
            title: 'Project Vision',
            icon: '📄',
            cover: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200',
            type: 'default',
            content: '<h2>Vision Statement</h2><p>Our vision is to create the most intuitive note-taking and collaboration platform...</p>',
            tags: ['work', 'vision']
        },
        'meeting-notes': {
            title: 'Meeting Notes',
            icon: '📝',
            type: 'default',
            content: '<h2>Weekly Standup - Feb 3, 2024</h2><p><strong>Attendees:</strong> Jane, John, Sarah</p><h3>Discussion Points</h3><ul><li>Sprint progress review</li><li>Blockers and dependencies</li><li>Next sprint planning</li></ul>',
            tags: ['meeting', 'sprint']
        },
        'launch-plan': {
            title: 'Launch Plan',
            icon: '🚀',
            cover: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200',
            type: 'default',
            content: '<h2>Product Launch Plan</h2><p>Target launch date: Q2 2024</p>',
            tags: ['launch', 'marketing']
        },
        'getting-started': {
            title: 'Getting Started',
            icon: '📚',
            type: 'default',
            content: '<h2>Welcome to Co-Notes! 🎉</h2><p>This is your personal workspace for notes, ideas, and collaboration.</p><h3>Quick Tips</h3><ul><li>Use <code>/</code> to access quick commands</li><li>Click the icon to change it</li><li>Add a cover image to personalize your page</li></ul>',
            tags: ['onboarding', 'tutorial']
        },
        'personal-home': {
            title: 'Personal Home',
            icon: '🏠',
            type: 'default',
            content: '<h2>My Personal Dashboard</h2><p>Organize your life here...</p>',
            tags: ['personal']
        },
        'quarterly-goals': {
            title: 'Quarterly Goals',
            icon: '🎯',
            type: 'goals',
            content: '',
            tags: ['goals', 'q1']
        }
    };

    useEffect(() => {
        const template = documentTemplates[id];
        if (template) {
            setTitle(template.title);
            setIcon(template.icon);
            setCoverImage(template.cover || null);
            setContent(template.content || '');
            setDocType(template.type || 'default');
            setIsFavorite(template.isFavorite || false);
            setTags(template.tags || []);
        } else if (id?.startsWith('new-')) {
            setTitle('');
            setIcon(null);
            setContent('');
            setDocType('default');
            setTags([]);
        } else {
            setTitle('Untitled');
            setContent('<p>Start writing here...</p>');
            setDocType('default');
            setTags([]);
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => setLastSaved('Just now'), 2000);
        return () => clearTimeout(timer);
    }, [content, title, tags]);

    const getPermissionIcon = () => {
        switch (permission) {
            case 'public': return <Globe size={14} />;
            case 'collaborative': return <Users size={14} />;
            default: return <Lock size={14} />;
        }
    };

    const getPermissionLabel = () => {
        switch (permission) {
            case 'public': return 'Public';
            case 'collaborative': return 'Collaborative';
            default: return 'Private';
        }
    };

    // Quick Action Handlers
    const handleAddBlock = () => {
        setContent(prev => prev + '<p>New block...</p>');
    };

    const handleAddTag = () => {
        setShowTagInput(true);
    };

    const submitTag = (e) => {
        if (e.key === 'Enter' && tagInputValue.trim()) {
            if (!tags.includes(tagInputValue.trim())) {
                setTags([...tags, tagInputValue.trim()]);
            }
            setTagInputValue('');
            setShowTagInput(false);
        } else if (e.key === 'Escape') {
            setShowTagInput(false);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleDuplicate = () => {
        alert('Document duplicated! (Simulated)');
        const newId = `copy-${id}-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            alert('Document deleted! (Simulated)');
            navigate('/dashboard');
        }
    };

    // Roadmap and Journal data (kept as is for mock) ... [omitted for brevity in thinking but included in full code]
    const roadmapData = {
        quarters: [
            {
                name: 'Q1 2024',
                status: 'completed',
                items: [
                    { title: 'User Authentication', status: 'done' },
                    { title: 'Basic Editor', status: 'done' },
                    { title: 'Dashboard UI', status: 'done' }
                ]
            },
            {
                name: 'Q2 2024',
                status: 'current',
                items: [
                    { title: 'Real-time Collaboration', status: 'in-progress' },
                    { title: 'Community Features', status: 'in-progress' },
                    { title: 'Mobile App', status: 'planned' }
                ]
            }
        ]
    };

    const journalEntries = [
        {
            date: 'February 3, 2024',
            weekday: 'Monday',
            mood: '😊',
            content: 'Started working on the new project features. Feeling productive and excited about the progress we made today.',
            tags: ['work', 'productive']
        }
    ];

    const renderRoadmap = () => (
        <div className="roadmap-view">
            <div className="roadmap-header">
                <h2>Product Roadmap 2024</h2>
                <p>Track our progress and upcoming features</p>
            </div>
            <div className="roadmap-timeline">
                {roadmapData.quarters.map((quarter, index) => (
                    <div key={quarter.name} className={`roadmap-quarter ${quarter.status}`}>
                        <div className="quarter-header">
                            <span className="quarter-name">{quarter.name}</span>
                            <span className={`quarter-badge ${quarter.status}`}>
                                {quarter.status === 'completed' ? 'Completed' :
                                    quarter.status === 'current' ? 'In Progress' : 'Upcoming'}
                            </span>
                        </div>
                        <div className="quarter-items">
                            {quarter.items.map((item, i) => (
                                <div key={i} className={`roadmap-item ${item.status}`}>
                                    {item.status === 'done' ? (
                                        <CheckCircle2 size={18} className="item-icon done" />
                                    ) : item.status === 'in-progress' ? (
                                        <div className="item-icon in-progress-icon"></div>
                                    ) : (
                                        <Circle size={18} className="item-icon" />
                                    )}
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderJournal = () => (
        <div className="journal-view">
            <div className="journal-header">
                <div className="journal-date-display">
                    <Calendar size={24} />
                    <div>
                        <h2>February 2024</h2>
                        <p>Your daily reflections</p>
                    </div>
                </div>
            </div>
            <div className="journal-entries">
                {journalEntries.map((entry, index) => (
                    <div key={index} className="journal-entry">
                        <div className="entry-date-col">
                            <span className="entry-weekday">{entry.weekday}</span>
                            <span className="entry-date">{entry.date}</span>
                        </div>
                        <div className="entry-content-col">
                            <div className="entry-mood">{entry.mood}</div>
                            <p className="entry-text">{entry.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="document-page">
            <div className="doc-top-bar">
                <div className="doc-nav-left">
                    <button className="nav-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={18} />
                    </button>
                    <div className="breadcrumbs">
                        <Link to="/dashboard">Dashboard</Link>
                        <ChevronDown size={14} className="breadcrumb-separator" style={{ transform: 'rotate(-90deg)' }} />
                        <span className="current-doc">{icon} {title || 'Untitled'}</span>
                    </div>
                </div>
                <div className="doc-actions">
                    <div className="save-status">
                        <Clock size={12} />
                        <span>{lastSaved}</span>
                    </div>
                    <div className="permission-badge">
                        {getPermissionIcon()}
                        <span>{getPermissionLabel()}</span>
                    </div>
                    <button
                        className={`action-icon-btn ${isFavorite ? 'active' : ''}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <Link to={`/doc/${id}/history`} className="action-icon-btn">
                        <History size={18} />
                    </Link>
                    <SharePopover
                        currentPermission={permission}
                        onPermissionChange={setPermission}
                    />
                    <button className="action-icon-btn">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            {coverImage && (
                <div className="doc-cover-image" style={{ backgroundImage: `url(${coverImage})` }}>
                    <div className="cover-overlay">
                        <button className="cover-action-btn" onClick={() => setCoverImage(null)}>
                            Remove cover
                        </button>
                    </div>
                </div>
            )}

            <div className="document-container">
                {icon && (
                    <div className="doc-icon-section">
                        <div className="doc-icon-large" onClick={() => setShowIconPicker(!showIconPicker)}>
                            {icon}
                        </div>
                        {showIconPicker && (
                            <div className="icon-picker">
                                <div className="icon-picker-header">
                                    <span>Choose an icon</span>
                                    <button onClick={() => { setIcon(null); setShowIconPicker(false); }}>Remove</button>
                                </div>
                                <div className="icon-grid">
                                    {iconOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="icon-option"
                                            onClick={() => { setIcon(emoji); setShowIconPicker(false); }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <input
                    type="text"
                    className="doc-title-input"
                    placeholder="Untitled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Display Tags */}
                <div className="doc-tags-display">
                    {tags.map(tag => (
                        <span key={tag} className="doc-tag">
                            <Hash size={12} />
                            {tag}
                            <button className="remove-tag-btn" onClick={() => removeTag(tag)}>
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                    {showTagInput && (
                        <input
                            type="text"
                            className="doc-tag-input"
                            placeholder="Add tag..."
                            autoFocus
                            value={tagInputValue}
                            onChange={(e) => setTagInputValue(e.target.value)}
                            onKeyDown={submitTag}
                            onBlur={() => setShowTagInput(false)}
                        />
                    )}
                </div>

                {docType === 'roadmap' ? (
                    renderRoadmap()
                ) : docType === 'journal' ? (
                    renderJournal()
                ) : (
                    <>
                        <div className="doc-quick-actions">
                            <button className="quick-action-btn" onClick={handleAddBlock}>
                                <Plus size={14} /> Add block
                            </button>
                            <button className="quick-action-btn" onClick={handleAddTag}>
                                <Hash size={14} /> Add tag
                            </button>
                            <button className="quick-action-btn" onClick={handleDuplicate}>
                                <Copy size={14} /> Duplicate
                            </button>
                            <button className="quick-action-btn danger" onClick={handleDelete}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                        <div className="editor-wrapper">
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Start writing, or press '/' for commands..."
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DocumentPage;
