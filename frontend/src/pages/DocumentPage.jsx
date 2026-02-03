import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import SharePopover from '../components/SharePopover';
import {
    Image as ImageIcon, MoreHorizontal, Star, Clock,
    MessageSquare, ChevronDown, Plus, Hash, Trash2, Copy,
    ArrowLeft, History, Users, Lock, Globe, Calendar,
    CheckCircle2, X, Settings, Download,
    FileText, AlignLeft, Table, CheckSquare, Code,
    Quote, Minus, Columns, Video,
    MapPin, Calculator, Sparkles,
    PanelRightOpen, PanelRightClose,
    Maximize2, Minimize2, Type, Heading1, Heading2, Heading3,
    List, ListOrdered, ToggleRight,
    AlertCircle, Info, Lightbulb, Zap,
    BarChart3, Database, FileCode, Image
} from 'lucide-react';

// Block type options for slash command menu
const BLOCK_TYPES = [
    {
        category: 'Basic Blocks', items: [
            { icon: <Type size={18} />, label: 'Text', description: 'Plain text block', command: 'text' },
            { icon: <Heading1 size={18} />, label: 'Heading 1', description: 'Large section heading', command: 'h1' },
            { icon: <Heading2 size={18} />, label: 'Heading 2', description: 'Medium section heading', command: 'h2' },
            { icon: <Heading3 size={18} />, label: 'Heading 3', description: 'Small section heading', command: 'h3' },
            { icon: <List size={18} />, label: 'Bullet List', description: 'Create a bulleted list', command: 'bullet' },
            { icon: <ListOrdered size={18} />, label: 'Numbered List', description: 'Create a numbered list', command: 'numbered' },
            { icon: <CheckSquare size={18} />, label: 'To-do List', description: 'Track tasks with checkboxes', command: 'todo' },
            { icon: <ToggleRight size={18} />, label: 'Toggle', description: 'Collapsible content block', command: 'toggle' },
        ]
    },
    {
        category: 'Media', items: [
            { icon: <Image size={18} />, label: 'Image', description: 'Upload or embed an image', command: 'image' },
            { icon: <Video size={18} />, label: 'Video', description: 'Embed a video', command: 'video' },
            { icon: <FileCode size={18} />, label: 'Code Block', description: 'Add code with syntax highlighting', command: 'code' },
            { icon: <FileText size={18} />, label: 'File', description: 'Upload a file', command: 'file' },
        ]
    },
    {
        category: 'Advanced', items: [
            { icon: <Table size={18} />, label: 'Table', description: 'Create a table', command: 'table' },
            { icon: <Columns size={18} />, label: 'Columns', description: 'Split into columns', command: 'columns' },
            { icon: <Quote size={18} />, label: 'Quote', description: 'Capture a quote', command: 'quote' },
            { icon: <Minus size={18} />, label: 'Divider', description: 'Visual separator', command: 'divider' },
        ]
    },
    {
        category: 'Callouts', items: [
            { icon: <Info size={18} />, label: 'Info Callout', description: 'Informational callout', command: 'callout-info' },
            { icon: <AlertCircle size={18} />, label: 'Warning Callout', description: 'Warning callout', command: 'callout-warning' },
            { icon: <Lightbulb size={18} />, label: 'Tip Callout', description: 'Helpful tip', command: 'callout-tip' },
            { icon: <Zap size={18} />, label: 'Important Callout', description: 'Important information', command: 'callout-important' },
        ]
    },
    {
        category: 'Embeds', items: [
            { icon: <Database size={18} />, label: 'Database', description: 'Create inline database', command: 'database' },
            { icon: <BarChart3 size={18} />, label: 'Chart', description: 'Visualize data', command: 'chart' },
            { icon: <MapPin size={18} />, label: 'Map', description: 'Embed a map', command: 'map' },
            { icon: <Calculator size={18} />, label: 'Math Equation', description: 'LaTeX math block', command: 'math' },
        ]
    },
];

const DocumentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Document state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [icon, setIcon] = useState(null);
    const [permission, setPermission] = useState('private');
    const [isFavorite, setIsFavorite] = useState(false);
    const [lastSaved, setLastSaved] = useState('Just now');
    const [tags, setTags] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [readTime, setReadTime] = useState('0 min');

    // UI state
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition] = useState({ top: 0, left: 0 });
    const [slashFilter, setSlashFilter] = useState('');
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [isFullWidth, setIsFullWidth] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagInputValue, setTagInputValue] = useState('');
    const [activeTab, setActiveTab] = useState('properties');
    const [documentOutline, setDocumentOutline] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const titleRef = useRef(null);
    const editorContainerRef = useRef(null);

    const iconOptions = [
        '📄', '📝', '📋', '📊', '🎯', '💡', '🚀', '⭐', '📚', '🔥',
        '💼', '🎨', '🔧', '📌', '✅', '🏠', '💻', '🎮', '🎵', '📷',
        '🌟', '💎', '🔮', '🌈', '🌙', '☀️', '⚡', '🎉', '🎁', '💪',
        '🧠', '❤️', '🔑', '📦', '🎬', '🎤', '🎧', '📱', '🖥️', '⌨️'
    ];

    const coverGradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
    ];

    const coverImages = [
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
        'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    ];

    // Document templates
    const documentTemplates = {
        'project-vision': {
            title: 'Project Vision',
            icon: '📄',
            cover: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200',
            content: '<h2>Vision Statement</h2><p>Our vision is to create the most intuitive note-taking and collaboration platform...</p><h2>Goals</h2><ul><li>Build a seamless experience</li><li>Enable real-time collaboration</li><li>Foster a community of creators</li></ul>',
            tags: ['work', 'vision']
        },
        'meeting-notes': {
            title: 'Meeting Notes',
            icon: '📝',
            content: '<h2>Weekly Standup - Feb 3, 2024</h2><p><strong>Attendees:</strong> Jane, John, Sarah</p><h3>Discussion Points</h3><ul><li>Sprint progress review</li><li>Blockers and dependencies</li><li>Next sprint planning</li></ul>',
            tags: ['meeting', 'sprint']
        },
        'getting-started': {
            title: 'Welcome to Co-Notes',
            icon: '👋',
            content: '<h2>Welcome to Co-Notes! 🎉</h2><p>This is your personal workspace for notes, ideas, and collaboration.</p><h3>Quick Tips</h3><ul><li>Use the toolbar above to format your text</li><li>Click the icon to personalize your page</li><li>Add a cover image to make it beautiful</li><li>Use tags to organize your notes</li></ul>',
            tags: ['onboarding', 'tutorial']
        }
    };

    // Initialize document
    useEffect(() => {
        const template = documentTemplates[id];
        if (template) {
            setTitle(template.title);
            setIcon(template.icon);
            setCoverImage(template.cover || null);
            setContent(template.content || '');
            setTags(template.tags || []);
        } else if (id?.startsWith('new-')) {
            setTitle('');
            setIcon('📄');
            setContent('');
            setTags([]);
            setTimeout(() => titleRef.current?.focus(), 100);
        } else {
            setTitle('Untitled');
            setContent('<p></p>');
            setIcon('📄');
            setTags([]);
        }
    }, [id]);

    // Auto-save simulation
    useEffect(() => {
        if (content || title) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                setLastSaved('Just now');
                setIsSaving(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [content, title, tags]);

    // Calculate document stats
    useEffect(() => {
        const text = content.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const minutes = Math.ceil(words / 200);

        setWordCount(words);
        setCharCount(chars);
        setReadTime(`${minutes} min read`);
    }, [content]);

    // Extract headings for outline
    useEffect(() => {
        const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
        const headings = [];
        let match;
        while ((match = headingRegex.exec(content)) !== null) {
            headings.push({
                level: parseInt(match[1]),
                text: match[2].replace(/<[^>]*>/g, ''),
                id: `heading-${headings.length}`
            });
        }
        setDocumentOutline(headings);
    }, [content]);

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editorContainerRef.current?.querySelector('.ProseMirror')?.focus();
        }
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
            setTagInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleDuplicate = () => {
        const newId = `copy-${Date.now()}`;
        navigate(`/doc/${newId}`);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to move this to trash?')) {
            navigate('/dashboard');
        }
    };

    const handleExport = (format) => {
        alert(`Exporting as ${format}... (Simulated)`);
    };

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
            case 'collaborative': return 'Shared';
            default: return 'Private';
        }
    };

    // Filter blocks based on slash command input
    const filteredBlocks = BLOCK_TYPES.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
            item.description.toLowerCase().includes(slashFilter.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className={`document-page-v2 ${isFullWidth ? 'full-width' : ''}`}>
            {/* Top Navigation Bar */}
            <header className="doc-header">
                <div className="doc-header-left">
                    <button className="header-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </button>
                    <div className="doc-breadcrumb">
                        <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
                        <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                        <span className="breadcrumb-current">
                            {icon} {title || 'Untitled'}
                        </span>
                    </div>
                </div>

                <div className="doc-header-center">
                    <div className={`save-indicator ${isSaving ? 'saving' : 'saved'}`}>
                        {isSaving ? (
                            <>
                                <div className="saving-spinner"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={14} />
                                <span>Saved {lastSaved}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="doc-header-right">
                    <div className="permission-indicator">
                        {getPermissionIcon()}
                        <span>{getPermissionLabel()}</span>
                    </div>

                    <button
                        className={`header-btn icon-btn ${isFavorite ? 'active' : ''}`}
                        onClick={() => setIsFavorite(!isFavorite)}
                        title="Add to favorites"
                    >
                        <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    <button
                        className="header-btn icon-btn"
                        onClick={() => setShowComments(!showComments)}
                        title="Comments"
                    >
                        <MessageSquare size={18} />
                    </button>

                    <Link to={`/doc/${id}/history`} className="header-btn icon-btn" title="Version history">
                        <History size={18} />
                    </Link>

                    <SharePopover
                        currentPermission={permission}
                        onPermissionChange={setPermission}
                    />

                    <button
                        className="header-btn icon-btn"
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        title={showRightPanel ? 'Hide panel' : 'Show panel'}
                    >
                        {showRightPanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                    </button>

                    <div className="header-dropdown">
                        <button className="header-btn icon-btn">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="doc-main-container">
                <main className={`doc-content-area ${showRightPanel ? 'with-panel' : ''}`}>
                    {/* Cover Image */}
                    {coverImage && (
                        <div
                            className="doc-cover"
                            style={{
                                backgroundImage: coverImage.startsWith('linear')
                                    ? coverImage
                                    : `url(${coverImage})`
                            }}
                        >
                            <div className="cover-actions">
                                <button onClick={() => setShowCoverPicker(true)}>
                                    <ImageIcon size={14} /> Change cover
                                </button>
                                <button onClick={() => setCoverImage(null)}>
                                    <X size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cover Picker Modal */}
                    {showCoverPicker && (
                        <div className="cover-picker-overlay" onClick={() => setShowCoverPicker(false)}>
                            <div className="cover-picker-modal" onClick={e => e.stopPropagation()}>
                                <h3>Choose a cover</h3>
                                <div className="cover-section">
                                    <h4>Gradients</h4>
                                    <div className="cover-grid">
                                        {coverGradients.map((gradient, i) => (
                                            <button
                                                key={i}
                                                className="cover-option gradient"
                                                style={{ background: gradient }}
                                                onClick={() => { setCoverImage(gradient); setShowCoverPicker(false); }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="cover-section">
                                    <h4>Images</h4>
                                    <div className="cover-grid">
                                        {coverImages.map((img, i) => (
                                            <button
                                                key={i}
                                                className="cover-option image"
                                                style={{ backgroundImage: `url(${img})` }}
                                                onClick={() => { setCoverImage(img); setShowCoverPicker(false); }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Document Editor Container */}
                    <div className="doc-editor-container">
                        {/* Icon and Quick Actions */}
                        <div className="doc-meta-section">
                            {!coverImage && (
                                <button
                                    className="add-cover-btn"
                                    onClick={() => setShowCoverPicker(true)}
                                >
                                    <ImageIcon size={14} />
                                    <span>Add cover</span>
                                </button>
                            )}

                            <div className="doc-icon-wrapper">
                                <button
                                    className="doc-icon-btn"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                >
                                    <span className="doc-icon">{icon || '📄'}</span>
                                </button>

                                {showIconPicker && (
                                    <div className="icon-picker-dropdown">
                                        <div className="picker-header">
                                            <span>Choose icon</span>
                                            <button onClick={() => { setIcon(null); setShowIconPicker(false); }}>
                                                Remove
                                            </button>
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
                        </div>

                        {/* Title */}
                        <input
                            ref={titleRef}
                            type="text"
                            className="doc-title"
                            placeholder="Untitled"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                        />

                        {/* Tags */}
                        <div className="doc-tags">
                            {tags.map(tag => (
                                <span key={tag} className="doc-tag">
                                    <Hash size={12} />
                                    {tag}
                                    <button onClick={() => removeTag(tag)}>
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                            {showTagInput ? (
                                <input
                                    className="tag-input"
                                    placeholder="Add tag..."
                                    autoFocus
                                    value={tagInputValue}
                                    onChange={(e) => setTagInputValue(e.target.value)}
                                    onKeyDown={submitTag}
                                    onBlur={() => { setShowTagInput(false); setTagInputValue(''); }}
                                />
                            ) : (
                                <button className="add-tag-btn" onClick={handleAddTag}>
                                    <Plus size={12} />
                                    Add tag
                                </button>
                            )}
                        </div>

                        {/* Editor */}
                        <div className="editor-section" ref={editorContainerRef}>
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Start writing, or use the toolbar above..."
                            />
                        </div>

                        {/* Floating Add Block Button */}
                        <div className="floating-add-block">
                            <button className="add-block-btn" title="Add a block">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Panel */}
                {showRightPanel && (
                    <aside className="doc-right-panel">
                        <div className="panel-tabs">
                            <button
                                className={`panel-tab ${activeTab === 'properties' ? 'active' : ''}`}
                                onClick={() => setActiveTab('properties')}
                            >
                                <Settings size={14} />
                                Properties
                            </button>
                            <button
                                className={`panel-tab ${activeTab === 'outline' ? 'active' : ''}`}
                                onClick={() => setActiveTab('outline')}
                            >
                                <AlignLeft size={14} />
                                Outline
                            </button>
                        </div>

                        {activeTab === 'properties' && (
                            <div className="panel-content">
                                {/* Document Stats */}
                                <div className="panel-section">
                                    <h4>Document Stats</h4>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-value">{wordCount}</span>
                                            <span className="stat-label">Words</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-value">{charCount}</span>
                                            <span className="stat-label">Characters</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-value">{readTime}</span>
                                            <span className="stat-label">Read time</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Properties */}
                                <div className="panel-section">
                                    <h4>Properties</h4>
                                    <div className="property-list">
                                        <div className="property-item">
                                            <span className="property-label">
                                                <Calendar size={14} /> Created
                                            </span>
                                            <span className="property-value">Feb 3, 2024</span>
                                        </div>
                                        <div className="property-item">
                                            <span className="property-label">
                                                <Clock size={14} /> Updated
                                            </span>
                                            <span className="property-value">{lastSaved}</span>
                                        </div>
                                        <div className="property-item">
                                            <span className="property-label">
                                                {getPermissionIcon()} Sharing
                                            </span>
                                            <span className="property-value">{getPermissionLabel()}</span>
                                        </div>
                                        <div className="property-item">
                                            <span className="property-label">
                                                <Users size={14} /> Owner
                                            </span>
                                            <span className="property-value">You</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="panel-section">
                                    <h4>Actions</h4>
                                    <div className="action-list">
                                        <button className="panel-action" onClick={handleDuplicate}>
                                            <Copy size={14} />
                                            Duplicate
                                        </button>
                                        <button className="panel-action" onClick={() => handleExport('pdf')}>
                                            <Download size={14} />
                                            Export PDF
                                        </button>
                                        <button className="panel-action" onClick={() => handleExport('markdown')}>
                                            <FileCode size={14} />
                                            Export Markdown
                                        </button>
                                        <button className="panel-action" onClick={() => setIsFullWidth(!isFullWidth)}>
                                            {isFullWidth ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                            {isFullWidth ? 'Default width' : 'Full width'}
                                        </button>
                                        <button className="panel-action delete" onClick={handleDelete}>
                                            <Trash2 size={14} />
                                            Move to trash
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'outline' && (
                            <div className="panel-content">
                                <div className="panel-section">
                                    <h4>Table of Contents</h4>
                                    {documentOutline.length > 0 ? (
                                        <nav className="outline-nav">
                                            {documentOutline.map((heading, index) => (
                                                <a
                                                    key={index}
                                                    href={`#${heading.id}`}
                                                    className={`outline-item level-${heading.level}`}
                                                >
                                                    {heading.text}
                                                </a>
                                            ))}
                                        </nav>
                                    ) : (
                                        <p className="outline-empty">
                                            Add headings to your document to see an outline here.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                )}
            </div>

            {/* Slash Command Menu */}
            {showSlashMenu && (
                <div
                    className="slash-menu"
                    style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
                >
                    <div className="slash-menu-header">
                        <input
                            type="text"
                            placeholder="Search blocks..."
                            value={slashFilter}
                            onChange={(e) => setSlashFilter(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="slash-menu-content">
                        {filteredBlocks.map((category) => (
                            <div key={category.category} className="slash-category">
                                <div className="category-label">{category.category}</div>
                                {category.items.map((item) => (
                                    <button
                                        key={item.command}
                                        className="slash-item"
                                        onClick={() => {
                                            console.log(`Insert ${item.command} block`);
                                            setShowSlashMenu(false);
                                        }}
                                    >
                                        <span className="slash-icon">{item.icon}</span>
                                        <div className="slash-info">
                                            <span className="slash-label">{item.label}</span>
                                            <span className="slash-desc">{item.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentPage;
