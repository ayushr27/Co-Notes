import React, { useState, useRef, useEffect } from 'react';
import {
    Zap, Plus, Mic, MicOff, Trash2, Clock, Edit2, Check, X,
    Pin, PinOff, Search, Palette
} from 'lucide-react';

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
    const [notes, setNotes] = useState([
        {
            id: 1,
            content: 'Remember to review the quarterly report before Friday meeting 📊',
            pinned: true,
            color: '#667eea',
            createdAt: new Date(Date.now() - 3600000)
        },
        {
            id: 2,
            content: 'Call Mom at 5 PM - her birthday next week! 🎂',
            pinned: true,
            color: '#f093fb',
            createdAt: new Date(Date.now() - 7200000)
        },
        {
            id: 3,
            content: 'Grocery list: milk, eggs, bread, coffee, avocados',
            pinned: false,
            color: '#43e97b',
            createdAt: new Date(Date.now() - 86400000)
        },
        {
            id: 4,
            content: 'New podcast recommendations: The Daily, How I Built This, Masters of Scale',
            pinned: false,
            color: '#4facfe',
            createdAt: new Date(Date.now() - 172800000)
        }
    ]);

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

    const handleAddNote = (e) => {
        e.preventDefault();
        if (newNoteContent.trim()) {
            const newNote = {
                id: Date.now(),
                content: newNoteContent.trim(),
                pinned: false,
                color: selectedColor,
                createdAt: new Date()
            };
            setNotes([newNote, ...notes]);
            setNewNoteContent('');
            if (isListening) stopListening();
        }
    };

    const togglePin = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
        ));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const startEditing = (note) => {
        setEditingNote(note.id);
        setEditContent(note.content);
    };

    const saveEdit = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, content: editContent } : note
        ));
        setEditingNote(null);
        setEditContent('');
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setEditContent('');
    };

    const changeNoteColor = (id, color) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, color } : note
        ));
    };

    const formatTime = (date) => {
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
