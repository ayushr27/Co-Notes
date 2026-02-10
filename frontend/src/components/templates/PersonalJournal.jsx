import React, { useState } from 'react';
import { Plus, Trash2, Lock, MessageCircle, Heart, Calendar, Send } from 'lucide-react';
import { getAvatarColor } from '../MemberStack';

const PersonalJournal = ({ activeMembers, isShared }) => {
    const [entries, setEntries] = useState([
        {
            id: 'j1',
            title: 'Reflections on Productivity',
            content: 'Today I discovered that time-blocking really works. I managed to complete three major tasks before lunch by dedicating focused 25-minute intervals. The key insight is that context switching is the real productivity killer.',
            date: new Date(Date.now() - 86400000),
            authorId: 'owner',
            liked: false,
            comments: [
                { id: 'c1', authorId: 'user_1', text: 'Great insight! I should try this.', date: new Date(Date.now() - 43200000) }
            ]
        },
        {
            id: 'j2',
            title: 'A Walk in the Park',
            content: 'Took an afternoon walk and noticed how the change of environment completely shifted my perspective on the project. Fresh air and movement are underrated problem-solving tools.',
            date: new Date(Date.now() - 172800000),
            authorId: 'owner',
            liked: false,
            comments: []
        },
        {
            id: 'j3',
            title: 'Learning New Frameworks',
            content: 'Started exploring the new version. The developer experience has improved significantly. Hot module replacement and better error messages make the learning curve much smoother.',
            date: new Date(Date.now() - 345600000),
            authorId: 'owner',
            liked: false,
            comments: []
        }
    ]);

    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const [showCompose, setShowCompose] = useState(false);
    const [commentText, setCommentText] = useState({});

    const addEntry = () => {
        if (!newEntry.title.trim() || !newEntry.content.trim()) return;
        setEntries(prev => [{
            id: `j${Date.now()}`,
            title: newEntry.title,
            content: newEntry.content,
            date: new Date(),
            authorId: 'owner',
            liked: false,
            comments: []
        }, ...prev]);
        setNewEntry({ title: '', content: '' });
        setShowCompose(false);
    };

    const toggleLike = (entryId) => {
        setEntries(prev => prev.map(e =>
            e.id === entryId ? { ...e, liked: !e.liked } : e
        ));
    };

    const addComment = (entryId) => {
        const text = (commentText[entryId] || '').trim();
        if (!text) return;
        setEntries(prev => prev.map(e => {
            if (e.id !== entryId) return e;
            return {
                ...e,
                comments: [...e.comments, {
                    id: `c${Date.now()}`,
                    authorId: 'owner',
                    text,
                    date: new Date()
                }]
            };
        }));
        setCommentText(prev => ({ ...prev, [entryId]: '' }));
    };

    const deleteEntry = (entryId) => {
        setEntries(prev => prev.filter(e => e.id !== entryId));
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getMember = (id) => activeMembers.find(m => m.id === id);

    return (
        <div className="journal-feed">
            {!isShared && (
                <div className="journal-private-banner">
                    <Lock size={16} />
                    <span>Private Journal — Only you can see these entries</span>
                </div>
            )}

            <div className="journal-compose-toggle">
                <button onClick={() => setShowCompose(!showCompose)}>
                    <Plus size={16} /> New Entry
                </button>
            </div>

            {showCompose && (
                <div className="journal-compose">
                    <input
                        type="text"
                        placeholder="Entry title..."
                        value={newEntry.title}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                        className="journal-compose-title"
                    />
                    <textarea
                        placeholder="Write your thoughts..."
                        value={newEntry.content}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="journal-compose-body"
                    />
                    <div className="journal-compose-actions">
                        <button className="journal-cancel-btn" onClick={() => setShowCompose(false)}>Cancel</button>
                        <button className="journal-publish-btn" onClick={addEntry}>Publish</button>
                    </div>
                </div>
            )}

            <div className="journal-entries">
                {entries.map(entry => {
                    const author = getMember(entry.authorId);
                    return (
                        <article key={entry.id} className="journal-entry">
                            <div className="journal-entry-header">
                                <div className="journal-author">
                                    {author && (
                                        <div className="journal-author-avatar" style={{ backgroundColor: getAvatarColor(author.id) }}>
                                            {author.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <span className="journal-author-name">{author?.name || 'You'}</span>
                                        <span className="journal-date">
                                            <Calendar size={12} /> {formatDate(entry.date)}
                                        </span>
                                    </div>
                                </div>
                                <button className="journal-delete" onClick={() => deleteEntry(entry.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <h3 className="journal-entry-title">{entry.title}</h3>
                            <p className="journal-entry-content">{entry.content}</p>

                            <div className="journal-entry-actions">
                                <button className={`journal-like-btn ${entry.liked ? 'liked' : ''}`} onClick={() => toggleLike(entry.id)}>
                                    <Heart size={15} fill={entry.liked ? 'currentColor' : 'none'} />
                                    {entry.liked ? 'Liked' : 'Like'}
                                </button>
                                {isShared && (
                                    <span className="journal-comment-count">
                                        <MessageCircle size={15} /> {entry.comments.length}
                                    </span>
                                )}
                            </div>

                            {isShared && (
                                <div className="journal-comments">
                                    {entry.comments.map(comment => {
                                        const commenter = getMember(comment.authorId);
                                        return (
                                            <div key={comment.id} className="journal-comment">
                                                <div className="journal-comment-avatar" style={{ backgroundColor: getAvatarColor(comment.authorId) }}>
                                                    {commenter?.name.charAt(0) || '?'}
                                                </div>
                                                <div className="journal-comment-body">
                                                    <span className="journal-comment-author">{commenter?.name || 'Unknown'}</span>
                                                    <p>{comment.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="journal-comment-input">
                                        <input
                                            placeholder="Write a comment..."
                                            value={commentText[entry.id] || ''}
                                            onChange={(e) => setCommentText(prev => ({ ...prev, [entry.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && addComment(entry.id)}
                                        />
                                        <button onClick={() => addComment(entry.id)}><Send size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default PersonalJournal;
