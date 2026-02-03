import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import {
    Image as ImageIcon, Eye, Save, Send, ArrowLeft, X, ChevronDown,
    Tag, Folder, Code, Briefcase, TrendingUp, Palette, BookOpen,
    Heart, Cpu, Globe, Mic, MicOff, Clock, Users, Lock, Sparkles,
    Check, Plus, Search, Zap, Target, Award, Coffee
} from 'lucide-react';

// Article Categories with subcategories
const ARTICLE_CATEGORIES = [
    {
        id: 'coding',
        name: 'Coding & Development',
        icon: <Code size={18} />,
        color: '#667eea',
        subcategories: ['Web Development', 'Mobile Development', 'Backend', 'DevOps', 'Data Science', 'Machine Learning', 'Game Development', 'Blockchain']
    },
    {
        id: 'business',
        name: 'Business & Entrepreneurship',
        icon: <Briefcase size={18} />,
        color: '#f59e0b',
        subcategories: ['Startups', 'Leadership', 'Strategy', 'Finance', 'E-commerce', 'Freelancing', 'Remote Work']
    },
    {
        id: 'marketing',
        name: 'Marketing & Growth',
        icon: <TrendingUp size={18} />,
        color: '#10b981',
        subcategories: ['Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Email Marketing', 'Analytics', 'Branding']
    },
    {
        id: 'design',
        name: 'Design & UX',
        icon: <Palette size={18} />,
        color: '#ec4899',
        subcategories: ['UI Design', 'UX Research', 'Product Design', 'Graphic Design', 'Motion Design', 'Design Systems', 'Accessibility']
    },
    {
        id: 'productivity',
        name: 'Productivity & Self-Improvement',
        icon: <Zap size={18} />,
        color: '#8b5cf6',
        subcategories: ['Time Management', 'Habits', 'Mental Health', 'Learning', 'Career Growth', 'Work-Life Balance']
    },
    {
        id: 'technology',
        name: 'Technology & Innovation',
        icon: <Cpu size={18} />,
        color: '#06b6d4',
        subcategories: ['AI & ML', 'Cloud Computing', 'Cybersecurity', 'IoT', 'AR/VR', 'Tech News', 'Future Tech']
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle & Wellness',
        icon: <Heart size={18} />,
        color: '#ef4444',
        subcategories: ['Health', 'Fitness', 'Nutrition', 'Travel', 'Personal Finance', 'Mindfulness']
    },
    {
        id: 'education',
        name: 'Education & Tutorials',
        icon: <BookOpen size={18} />,
        color: '#14b8a6',
        subcategories: ['Tutorials', 'Courses', 'Resources', 'Career Advice', 'Study Tips', 'Online Learning']
    }
];

// Programming Languages for Coding articles
const PROGRAMMING_LANGUAGES = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'R', 'SQL', 'HTML/CSS', 'Shell/Bash'
];

// Frameworks & Tools
const FRAMEWORKS_TOOLS = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Rails', 'Flutter', 'React Native', 'Docker', 'Kubernetes',
    'AWS', 'Firebase', 'MongoDB', 'PostgreSQL', 'GraphQL', 'TensorFlow', 'PyTorch'
];

// Experience Levels
const EXPERIENCE_LEVELS = [
    { id: 'beginner', label: 'Beginner', icon: <Coffee size={16} />, description: 'New to the topic' },
    { id: 'intermediate', label: 'Intermediate', icon: <Target size={16} />, description: 'Some experience' },
    { id: 'advanced', label: 'Advanced', icon: <Zap size={16} />, description: 'Experienced readers' },
    { id: 'expert', label: 'Expert', icon: <Award size={16} />, description: 'Deep expertise required' }
];

// Voice Recognition Hook
const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(finalTranscript);
                }
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
        return () => recognitionRef.current?.stop();
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return { isListening, transcript, isSupported, toggleListening, setTranscript };
};

const WriteArticle = () => {
    const navigate = useNavigate();

    // Basic article state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');

    // Categorization state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Coding-specific state
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedFrameworks, setSelectedFrameworks] = useState([]);

    // Article options
    const [experienceLevel, setExperienceLevel] = useState('intermediate');
    const [estimatedReadTime, setEstimatedReadTime] = useState(5);
    const [visibility, setVisibility] = useState('public'); // public, unlisted, members
    const [allowComments, setAllowComments] = useState(true);
    const [isSeriesPart, setIsSeriesPart] = useState(false);
    const [seriesName, setSeriesName] = useState('');

    // UI state
    const [isSaving, setIsSaving] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [languageSearch, setLanguageSearch] = useState('');
    const [frameworkSearch, setFrameworkSearch] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const { isListening, transcript, isSupported, toggleListening, setTranscript } = useVoiceRecognition();

    // Update title with voice transcript
    useEffect(() => {
        if (transcript) {
            setTitle(prev => prev + ' ' + transcript);
            setTranscript('');
        }
    }, [transcript]);

    // Calculate read time based on content
    useEffect(() => {
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length;
        const time = Math.max(1, Math.ceil(words / 200));
        setEstimatedReadTime(time);
    }, [content]);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim().toLowerCase()) && tags.length < 5) {
                setTags([...tags, tagInput.trim().toLowerCase()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const toggleLanguage = (lang) => {
        if (selectedLanguages.includes(lang)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
        } else if (selectedLanguages.length < 5) {
            setSelectedLanguages([...selectedLanguages, lang]);
        }
    };

    const toggleFramework = (framework) => {
        if (selectedFrameworks.includes(framework)) {
            setSelectedFrameworks(selectedFrameworks.filter(f => f !== framework));
        } else if (selectedFrameworks.length < 5) {
            setSelectedFrameworks([...selectedFrameworks, framework]);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory('');
        setShowCategoryDropdown(false);
        // Clear coding-specific selections if not coding category
        if (category.id !== 'coding') {
            setSelectedLanguages([]);
            setSelectedFrameworks([]);
        }
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Draft saved successfully!');
        }, 1000);
    };

    const handlePublish = () => {
        if (!title.trim()) {
            alert('Please add a title');
            return;
        }
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }
        setShowPublishModal(true);
    };

    const confirmPublish = () => {
        // Mock publish with all metadata
        const articleData = {
            title,
            subtitle,
            content,
            coverImage,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            tags,
            languages: selectedLanguages,
            frameworks: selectedFrameworks,
            experienceLevel,
            estimatedReadTime,
            visibility,
            allowComments,
            isSeriesPart,
            seriesName,
            publishedAt: new Date().toISOString()
        };
        console.log('Publishing article:', articleData);
        alert('Article published successfully!');
        navigate('/my-articles');
    };

    const handlePreview = () => {
        alert('Preview functionality coming soon!');
    };

    const filteredLanguages = PROGRAMMING_LANGUAGES.filter(lang =>
        lang.toLowerCase().includes(languageSearch.toLowerCase())
    );

    const filteredFrameworks = FRAMEWORKS_TOOLS.filter(fw =>
        fw.toLowerCase().includes(frameworkSearch.toLowerCase())
    );

    return (
        <div className="write-article-page-v2">
            {/* Header */}
            <header className="write-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-center">
                    <span className="draft-status">
                        <Clock size={14} />
                        Draft • Auto-saved
                    </span>
                </div>
                <div className="write-actions">
                    <button className="btn btn-outline" onClick={handlePreview}>
                        <Eye size={16} /> Preview
                    </button>
                    <button className="btn btn-outline" onClick={handleSaveDraft} disabled={isSaving}>
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button className="btn btn-primary" onClick={handlePublish}>
                        <Send size={16} /> Publish
                    </button>
                </div>
            </header>

            <div className="write-layout">
                {/* Main Editor */}
                <div className="write-main">
                    {/* Cover Image */}
                    <div className="cover-upload">
                        {coverImage ? (
                            <div className="cover-preview" style={{ backgroundImage: `url(${coverImage})` }}>
                                <button className="remove-cover" onClick={() => setCoverImage('')}>
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                className="cover-placeholder"
                                onClick={() => setCoverImage('https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=1200')}
                            >
                                <ImageIcon size={24} />
                                <span>Add cover image</span>
                            </button>
                        )}
                    </div>

                    {/* Title with Voice */}
                    <div className="title-with-voice">
                        <input
                            type="text"
                            className="article-title-input"
                            placeholder="Article title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {isSupported && (
                            <button
                                className={`voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                title="Voice input"
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                        )}
                    </div>
                    {isListening && (
                        <div className="voice-indicator">
                            <span className="pulse-dot"></span> Listening...
                        </div>
                    )}

                    {/* Subtitle */}
                    <input
                        type="text"
                        className="article-subtitle-input"
                        placeholder="Add a subtitle (optional)..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                    />

                    {/* Editor */}
                    <div className="article-editor">
                        <TiptapEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write your article... Share your knowledge with the community!"
                        />
                    </div>
                </div>

                {/* Right Sidebar - Article Settings */}
                <aside className="write-sidebar">
                    <div className="sidebar-section">
                        <h3 className="section-title">
                            <Folder size={16} /> Category *
                        </h3>
                        <div className="category-selector">
                            <button
                                className="category-trigger"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                {selectedCategory ? (
                                    <span className="selected-category" style={{ '--cat-color': selectedCategory.color }}>
                                        {selectedCategory.icon}
                                        {selectedCategory.name}
                                    </span>
                                ) : (
                                    <span className="placeholder">Select a category</span>
                                )}
                                <ChevronDown size={16} />
                            </button>

                            {showCategoryDropdown && (
                                <div className="category-dropdown">
                                    {ARTICLE_CATEGORIES.map(category => (
                                        <button
                                            key={category.id}
                                            className={`category-option ${selectedCategory?.id === category.id ? 'active' : ''}`}
                                            onClick={() => handleCategorySelect(category)}
                                            style={{ '--cat-color': category.color }}
                                        >
                                            {category.icon}
                                            <span>{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Subcategory */}
                        {selectedCategory && (
                            <div className="subcategory-selector">
                                <select
                                    value={selectedSubcategory}
                                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                                >
                                    <option value="">Select subcategory</option>
                                    {selectedCategory.subcategories.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Coding-specific options */}
                    {selectedCategory?.id === 'coding' && (
                        <>
                            <div className="sidebar-section">
                                <h3 className="section-title">
                                    <Code size={16} /> Programming Languages
                                </h3>
                                <div className="search-input">
                                    <Search size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search languages..."
                                        value={languageSearch}
                                        onChange={(e) => setLanguageSearch(e.target.value)}
                                    />
                                </div>
                                <div className="pills-container">
                                    {filteredLanguages.slice(0, 12).map(lang => (
                                        <button
                                            key={lang}
                                            className={`pill ${selectedLanguages.includes(lang) ? 'active' : ''}`}
                                            onClick={() => toggleLanguage(lang)}
                                        >
                                            {selectedLanguages.includes(lang) && <Check size={12} />}
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                                {selectedLanguages.length > 0 && (
                                    <p className="selection-count">{selectedLanguages.length}/5 selected</p>
                                )}
                            </div>

                            <div className="sidebar-section">
                                <h3 className="section-title">
                                    <Cpu size={16} /> Frameworks & Tools
                                </h3>
                                <div className="search-input">
                                    <Search size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search frameworks..."
                                        value={frameworkSearch}
                                        onChange={(e) => setFrameworkSearch(e.target.value)}
                                    />
                                </div>
                                <div className="pills-container">
                                    {filteredFrameworks.slice(0, 12).map(fw => (
                                        <button
                                            key={fw}
                                            className={`pill ${selectedFrameworks.includes(fw) ? 'active' : ''}`}
                                            onClick={() => toggleFramework(fw)}
                                        >
                                            {selectedFrameworks.includes(fw) && <Check size={12} />}
                                            {fw}
                                        </button>
                                    ))}
                                </div>
                                {selectedFrameworks.length > 0 && (
                                    <p className="selection-count">{selectedFrameworks.length}/5 selected</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Tags */}
                    <div className="sidebar-section">
                        <h3 className="section-title">
                            <Tag size={16} /> Tags
                        </h3>
                        <div className="tags-input-container">
                            <div className="tags-list">
                                {tags.map((tag) => (
                                    <span key={tag} className="tag-chip">
                                        #{tag}
                                        <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder={tags.length < 5 ? "Add tag (press Enter)" : "Max 5 tags"}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                disabled={tags.length >= 5}
                            />
                        </div>
                        <p className="helper-text">Add up to 5 tags to help readers find your article</p>
                    </div>

                    {/* Experience Level */}
                    <div className="sidebar-section">
                        <h3 className="section-title">
                            <Target size={16} /> Experience Level
                        </h3>
                        <div className="experience-options">
                            {EXPERIENCE_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    className={`experience-btn ${experienceLevel === level.id ? 'active' : ''}`}
                                    onClick={() => setExperienceLevel(level.id)}
                                >
                                    {level.icon}
                                    <div>
                                        <strong>{level.label}</strong>
                                        <span>{level.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Article Stats */}
                    <div className="sidebar-section stats-section">
                        <div className="stat-item">
                            <Clock size={16} />
                            <span>{estimatedReadTime} min read</span>
                        </div>
                        <div className="stat-item">
                            <Tag size={16} />
                            <span>{tags.length} tags</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
                    <div className="publish-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><Sparkles size={20} /> Ready to Publish?</h2>
                            <button onClick={() => setShowPublishModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {/* Preview Summary */}
                            <div className="publish-preview">
                                {coverImage && (
                                    <div className="preview-cover" style={{ backgroundImage: `url(${coverImage})` }} />
                                )}
                                <h3>{title}</h3>
                                {subtitle && <p className="preview-subtitle">{subtitle}</p>}
                                <div className="preview-meta">
                                    {selectedCategory && (
                                        <span className="category-badge" style={{ '--cat-color': selectedCategory.color }}>
                                            {selectedCategory.icon}
                                            {selectedCategory.name}
                                        </span>
                                    )}
                                    <span className="read-time">
                                        <Clock size={12} /> {estimatedReadTime} min read
                                    </span>
                                </div>
                                {tags.length > 0 && (
                                    <div className="preview-tags">
                                        {tags.map(tag => (
                                            <span key={tag}>#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Visibility Options */}
                            <div className="publish-option">
                                <h4>Visibility</h4>
                                <div className="visibility-options">
                                    <button
                                        className={`visibility-btn ${visibility === 'public' ? 'active' : ''}`}
                                        onClick={() => setVisibility('public')}
                                    >
                                        <Globe size={18} />
                                        <div>
                                            <strong>Public</strong>
                                            <span>Anyone can find and read</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`visibility-btn ${visibility === 'unlisted' ? 'active' : ''}`}
                                        onClick={() => setVisibility('unlisted')}
                                    >
                                        <Link size={18} />
                                        <div>
                                            <strong>Unlisted</strong>
                                            <span>Only people with link</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`visibility-btn ${visibility === 'members' ? 'active' : ''}`}
                                        onClick={() => setVisibility('members')}
                                    >
                                        <Users size={18} />
                                        <div>
                                            <strong>Members Only</strong>
                                            <span>Registered users only</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Comments Toggle */}
                            <div className="publish-option inline">
                                <label className="toggle-option">
                                    <span>Allow comments</span>
                                    <input
                                        type="checkbox"
                                        checked={allowComments}
                                        onChange={(e) => setAllowComments(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>

                            {/* Series Option */}
                            <div className="publish-option">
                                <label className="toggle-option">
                                    <span>Part of a series</span>
                                    <input
                                        type="checkbox"
                                        checked={isSeriesPart}
                                        onChange={(e) => setIsSeriesPart(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                {isSeriesPart && (
                                    <input
                                        type="text"
                                        className="series-input"
                                        placeholder="Series name..."
                                        value={seriesName}
                                        onChange={(e) => setSeriesName(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowPublishModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmPublish}>
                                <Send size={16} /> Publish Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Missing Link import fix
const Link = ({ size, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

export default WriteArticle;
