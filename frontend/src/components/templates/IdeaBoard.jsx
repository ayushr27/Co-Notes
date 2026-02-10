import React, { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { getAvatarColor } from '../MemberStack';

const NOTE_COLORS = [
    '#667eea33', '#f093fb33', '#4facfe33', '#43e97b33', '#fa709a33',
    '#fee14033', '#a8edea33', '#ff9a9e33', '#fbc2eb33', '#84fab033'
];

const IdeaBoard = ({ activeMembers }) => {
    const [notes, setNotes] = useState([
        { id: 'n1', text: 'Create a mobile-first landing page with 3D animations', color: NOTE_COLORS[0], creatorId: 'owner' },
        { id: 'n2', text: 'Explore WebSocket integration for real-time collaboration', color: NOTE_COLORS[1], creatorId: 'owner' },
        { id: 'n3', text: 'Research AI-powered note summarization feature', color: NOTE_COLORS[2], creatorId: 'owner' },
        { id: 'n4', text: 'Design a gamification system with XP and badges', color: NOTE_COLORS[3], creatorId: 'owner' },
        { id: 'n5', text: 'Add dark/light theme toggle with system preference detection', color: NOTE_COLORS[4], creatorId: 'owner' },
        { id: 'n6', text: 'Build a Markdown-to-PDF export feature', color: NOTE_COLORS[5], creatorId: 'owner' },
    ]);

    const [newNote, setNewNote] = useState('');
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

    const addNote = () => {
        if (!newNote.trim()) return;
        setNotes(prev => [{
            id: `n${Date.now()}`,
            text: newNote,
            color: selectedColor,
            creatorId: 'owner'
        }, ...prev]);
        setNewNote('');
        setSelectedColor(NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const getCreator = (id) => activeMembers.find(m => m.id === id);

    return (
        <div className="idea-board">
            <div className="idea-board-input">
                <div className="idea-input-wrapper">
                    <Sparkles size={18} />
                    <input
                        type="text"
                        placeholder="Drop an idea here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    />
                    <div className="idea-color-picks">
                        {NOTE_COLORS.slice(0, 6).map(c => (
                            <button
                                key={c}
                                className={`idea-color-dot ${selectedColor === c ? 'active' : ''}`}
                                style={{ backgroundColor: c.replace('33', 'aa') }}
                                onClick={() => setSelectedColor(c)}
                            />
                        ))}
                    </div>
                    <button className="idea-add-btn" onClick={addNote}><Plus size={18} /></button>
                </div>
            </div>

            <div className="idea-masonry">
                {notes.map(note => {
                    const creator = getCreator(note.creatorId);
                    return (
                        <div
                            key={note.id}
                            className="idea-sticky"
                            style={{ backgroundColor: note.color }}
                        >
                            <p className="idea-sticky-text">{note.text}</p>
                            <div className="idea-sticky-footer">
                                {creator && (
                                    <div className="idea-creator">
                                        <div
                                            className="idea-creator-avatar"
                                            style={{ backgroundColor: getAvatarColor(creator.id) }}
                                        >
                                            {creator.name.charAt(0)}
                                        </div>
                                        <span>{creator.name.split(' ')[0]}</span>
                                    </div>
                                )}
                                <button className="idea-delete" onClick={() => deleteNote(note.id)}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IdeaBoard;
