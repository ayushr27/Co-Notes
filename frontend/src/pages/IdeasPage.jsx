import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Lightbulb, Plus, Mic, MicOff, Trash2, Star, Clock,
    Sparkles, Tag, MoreHorizontal, Search, Filter, X,
    ChevronDown, ArrowUpRight, Loader2
} from 'lucide-react';
import api from '../services/api';

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
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return { isListening, transcript, isSupported, toggleListening, setTranscript };
};

const IdeasPage = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewIdea, setShowNewIdea] = useState(false);
    const [newIdeaTitle, setNewIdeaTitle] = useState('');
    const [newIdeaDescription, setNewIdeaDescription] = useState('');
    const [newIdeaTags, setNewIdeaTags] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStarred, setFilterStarred] = useState(false);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const res = filterStarred
                    ? await api.get('/ideas?starred=true')
                    : await api.get('/ideas');
                setIdeas(res.data);
            } catch (error) {
                console.error('Failed to load ideas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIdeas();
    }, [filterStarred]);

    const { isListening, transcript, isSupported, toggleListening, setTranscript } = useVoiceRecognition();
    const inputRef = useRef(null);

    // Update description with voice transcript
    useEffect(() => {
        if (transcript) {
            setNewIdeaDescription(prev => prev + transcript);
            setTranscript('');
        }
    }, [transcript]);

    const colorOptions = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

    const handleAddIdea = async () => {
        if (newIdeaTitle.trim()) {
            try {
                const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
                const tags = newIdeaTags.split(',').map(t => t.trim()).filter(t => t);
                const res = await api.post('/ideas', {
                    title: newIdeaTitle,
                    description: newIdeaDescription,
                    tags,
                    color
                });

                // If we are showing starred only, new idea might not be starred (it's not by default)
                // We just safely unshift if we're not filtering or if we want to add to local state
                if (!filterStarred) {
                    setIdeas([res.data, ...ideas]);
                }

                setNewIdeaTitle('');
                setNewIdeaDescription('');
                setNewIdeaTags('');
                setShowNewIdea(false);
            } catch (error) {
                console.error('Failed to create idea:', error);
            }
        }
    };

    const toggleStar = async (id) => {
        try {
            const res = await api.patch(`/ideas/${id}/star`);
            if (filterStarred && !res.data.starred) {
                // Remove from local trace if unstarred and filter is on
                setIdeas(ideas.filter(idea => idea.id !== id));
            } else {
                setIdeas(ideas.map(idea => idea.id === id ? { ...idea, starred: res.data.starred } : idea));
            }
        } catch (error) {
            console.error('Failed to star idea:', error);
        }
    };

    const deleteIdea = async (id) => {
        try {
            await api.delete(`/ideas/${id}`);
            setIdeas(ideas.filter(idea => idea.id !== id));
        } catch (error) {
            console.error('Failed to delete idea:', error);
        }
    };

    const filteredIdeas = ideas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = !filterStarred || idea.starred;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        if (diff < 86400000) return 'Today';
        if (diff < 172800000) return 'Yesterday';
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="ideas-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="ideas-page">
            <header className="ideas-header">
                <div className="header-title">
                    <Lightbulb size={28} className="header-icon" />
                    <div>
                        <h1>Ideas</h1>
                        <p>Capture your brilliant thoughts before they fade away</p>
                    </div>
                </div>
                <button className="btn-add-idea" onClick={() => setShowNewIdea(true)}>
                    <Sparkles size={18} />
                    Capture Idea
                </button>
            </header>

            {/* Search and Filter */}
            <div className="ideas-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    className={`filter-btn ${filterStarred ? 'active' : ''}`}
                    onClick={() => setFilterStarred(!filterStarred)}
                >
                    <Star size={16} fill={filterStarred ? 'currentColor' : 'none'} />
                    Starred
                </button>
            </div>

            {/* New Idea Modal */}
            {showNewIdea && (
                <div className="modal-overlay" onClick={() => setShowNewIdea(false)}>
                    <div className="idea-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><Sparkles size={20} /> Capture New Idea</h2>
                            <button onClick={() => setShowNewIdea(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="What's your big idea?"
                                value={newIdeaTitle}
                                onChange={(e) => setNewIdeaTitle(e.target.value)}
                                className="idea-title-input"
                                autoFocus
                            />
                            <div className="textarea-with-voice">
                                <textarea
                                    placeholder="Describe your idea... (or use voice)"
                                    value={newIdeaDescription}
                                    onChange={(e) => setNewIdeaDescription(e.target.value)}
                                    className="idea-description-input"
                                    rows={4}
                                />
                                {isSupported && (
                                    <button
                                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                                        onClick={toggleListening}
                                        title={isListening ? 'Stop recording' : 'Start voice input'}
                                    >
                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                )}
                            </div>
                            {isListening && (
                                <div className="voice-indicator">
                                    <span className="pulse-dot"></span>
                                    Listening... Speak your idea
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={newIdeaTags}
                                onChange={(e) => setNewIdeaTags(e.target.value)}
                                className="idea-tags-input"
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowNewIdea(false)}>
                                Cancel
                            </button>
                            <button className="btn-save" onClick={handleAddIdea}>
                                <Plus size={18} />
                                Save Idea
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ideas Grid */}
            <div className="ideas-grid">
                {filteredIdeas.map(idea => (
                    <div
                        key={idea.id}
                        className="idea-card"
                        style={{ '--accent-color': idea.color }}
                    >
                        <div className="idea-card-header">
                            <span className="idea-date">
                                <Clock size={12} />
                                {formatDate(idea.createdAt)}
                            </span>
                            <div className="idea-actions">
                                <button
                                    className={`star-btn ${idea.starred ? 'starred' : ''}`}
                                    onClick={() => toggleStar(idea.id)}
                                >
                                    <Star size={16} fill={idea.starred ? 'currentColor' : 'none'} />
                                </button>
                                <button className="delete-btn" onClick={() => deleteIdea(idea.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="idea-title">{idea.title}</h3>
                        <p className="idea-description">{idea.description}</p>
                        {idea.tags.length > 0 && (
                            <div className="idea-tags">
                                {idea.tags.map(tag => (
                                    <span key={tag} className="idea-tag">
                                        <Tag size={10} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <Link to={`/doc/idea-${idea.id}`} className="expand-idea">
                            <ArrowUpRight size={14} />
                            Expand
                        </Link>
                    </div>
                ))}
            </div>

            {filteredIdeas.length === 0 && (
                <div className="empty-state">
                    <Lightbulb size={48} />
                    <h3>No ideas yet</h3>
                    <p>Start capturing your brilliant thoughts!</p>
                    <button onClick={() => setShowNewIdea(true)}>
                        <Plus size={18} /> Capture First Idea
                    </button>
                </div>
            )}
        </div>
    );
};

export default IdeasPage;
