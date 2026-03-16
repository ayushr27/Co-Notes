import React, { useState, useRef, useEffect } from 'react';
import {
    Zap, Plus, Mic, MicOff, Trash2, Clock, Edit2, Check, X,
    Pin, PinOff, Search, Palette, Loader2
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
                    setTranscript(finalTranscript);
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

    return { isListening, transcript, isSupported, startListening, stopListening, setTranscript };
};

const QuickNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/quick-notes');
                setNotes(res.data);
            } catch (error) {
                console.error('Failed to fetch quick notes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedColor, setSelectedColor] = useState('#667eea');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const { isListening, transcript, isSupported, startListening, stopListening, setTranscript } = useVoiceRecognition();
    const inputRef = useRef(null);

    const colors = [
        '#667eea', '#f093fb', '#4facfe', '#43e97b',
        '#fa709a', '#fee140', '#a8edea', '#ff9a9e'
    ];

    // Update input with voice transcript
    useEffect(() => {
        if (transcript) {
            setNewNoteContent(prev => prev + ' ' + transcript);
            setTranscript('');
        }
    }, [transcript]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (newNoteContent.trim()) {
            try {
                const res = await api.post('/quick-notes', {
                    content: newNoteContent.trim(),
                    color: selectedColor
                });
                setNotes([res.data, ...notes]);
                setNewNoteContent('');
                if (isListening) stopListening();
            } catch (error) {
                console.error('Failed to add note:', error);
            }
        }
    };

    const togglePin = async (id) => {
        try {
            const res = await api.patch(`/quick-notes/${id}/pin`);
            setNotes(notes.map(note =>
                note.id === id ? res.data : note
            ));
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await api.delete(`/quick-notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const startEditing = (note) => {
        setEditingNote(note.id);
        setEditContent(note.content);
    };

    const saveEdit = async (id) => {
        try {
            const res = await api.put(`/quick-notes/${id}`, { content: editContent });
            setNotes(notes.map(note =>
                note.id === id ? res.data : note
            ));
            setEditingNote(null);
            setEditContent('');
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setEditContent('');
    };

    const changeNoteColor = async (id, color) => {
        try {
            const res = await api.patch(`/quick-notes/${id}/color`, { color });
            setNotes(notes.map(note =>
                note.id === id ? res.data : note
            ));
            setSelectedColor('#667eea'); // Reset after applying? Or keep selected.
        } catch (error) {
            console.error('Failed to change color:', error);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const pinnedNotes = notes.filter(n => n.pinned && n.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const unpinnedNotes = notes.filter(n => !n.pinned && n.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="quick-notes-page">
            <header className="quick-notes-header">
                <div className="header-title">
                    <Zap size={28} className="header-icon" />
                    <div>
                        <h1>Quick Notes</h1>
                        <p>Capture thoughts instantly, organize later</p>
                    </div>
                </div>
            </header>

            {/* Quick Add Form */}
            <form className="quick-add-form" onSubmit={handleAddNote}>
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Jot down a quick note... ✍️"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="quick-input"
                    />
                    <div className="input-actions">
                        <div className="color-picker-wrapper">
                            <button
                                type="button"
                                className="color-indicator"
                                style={{ backgroundColor: selectedColor }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            >
                                <Palette size={14} />
                            </button>
                            {showColorPicker && (
                                <div className="color-picker-dropdown">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`color-option ${selectedColor === color ? 'active' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => { setSelectedColor(color); setShowColorPicker(false); }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {isSupported && (
                            <button
                                type="button"
                                className={`voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={isListening ? stopListening : startListening}
                                title={isListening ? 'Stop recording' : 'Voice input'}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                        )}
                        <button type="submit" className="add-btn" disabled={!newNoteContent.trim()}>
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                {isListening && (
                    <div className="voice-indicator">
                        <span className="pulse-dot"></span>
                        Listening... speak your note
                    </div>
                )}
            </form>

            {/* Search */}
            <div className="notes-search">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
                <div className="notes-section">
                    <h2 className="section-label">
                        <Pin size={16} /> Pinned
                    </h2>
                    <div className="notes-grid">
                        {pinnedNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                isEditing={editingNote === note.id}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                onTogglePin={() => togglePin(note.id)}
                                onDelete={() => deleteNote(note.id)}
                                onStartEdit={() => startEditing(note)}
                                onSaveEdit={() => saveEdit(note.id)}
                                onCancelEdit={cancelEdit}
                                onColorChange={(color) => changeNoteColor(note.id, color)}
                                formatTime={formatTime}
                                colors={colors}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Notes */}
            {unpinnedNotes.length > 0 && (
                <div className="notes-section">
                    <h2 className="section-label">
                        <Clock size={16} /> Recent
                    </h2>
                    <div className="notes-grid">
                        {unpinnedNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                isEditing={editingNote === note.id}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                onTogglePin={() => togglePin(note.id)}
                                onDelete={() => deleteNote(note.id)}
                                onStartEdit={() => startEditing(note)}
                                onSaveEdit={() => saveEdit(note.id)}
                                onCancelEdit={cancelEdit}
                                onColorChange={(color) => changeNoteColor(note.id, color)}
                                formatTime={formatTime}
                                colors={colors}
                            />
                        ))}
                    </div>
                </div>
            )}

            {notes.length === 0 && (
                <div className="empty-state">
                    <Zap size={48} />
                    <h3>No notes yet</h3>
                    <p>Start jotting down quick thoughts!</p>
                </div>
            )}
        </div>
    );
};

// Note Card Component
const NoteCard = ({
    note, isEditing, editContent, setEditContent,
    onTogglePin, onDelete, onStartEdit, onSaveEdit, onCancelEdit,
    onColorChange, formatTime, colors
}) => {
    const [showColors, setShowColors] = useState(false);

    return (
        <div className="note-card" style={{ '--note-color': note.color }}>
            {isEditing ? (
                <div className="note-edit">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                    />
                    <div className="edit-actions">
                        <button className="save-btn" onClick={onSaveEdit}>
                            <Check size={16} /> Save
                        </button>
                        <button className="cancel-btn" onClick={onCancelEdit}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="note-header">
                        <span className="note-time">
                            <Clock size={12} />
                            {formatTime(note.createdAt)}
                        </span>
                        <div className="note-actions">
                            <button
                                className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
                                onClick={onTogglePin}
                                title={note.pinned ? 'Unpin' : 'Pin'}
                            >
                                {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                            </button>
                            <button className="edit-btn" onClick={onStartEdit} title="Edit">
                                <Edit2 size={14} />
                            </button>
                            <div className="color-menu">
                                <button
                                    className="color-btn"
                                    onClick={() => setShowColors(!showColors)}
                                    title="Change color"
                                >
                                    <Palette size={14} />
                                </button>
                                {showColors && (
                                    <div className="color-dropdown">
                                        {colors.map(color => (
                                            <button
                                                key={color}
                                                className="color-swatch"
                                                style={{ backgroundColor: color }}
                                                onClick={() => { onColorChange(color); setShowColors(false); }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="delete-btn" onClick={onDelete} title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <p className="note-content">{note.content}</p>
                </>
            )}
        </div>
    );
};

export default QuickNotesPage;
