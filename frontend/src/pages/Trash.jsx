import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, RotateCcw, Clock, AlertTriangle, Search } from 'lucide-react';

const Trash = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock deleted items
    const [trashedItems, setTrashedItems] = useState([
        {
            id: 'old-notes',
            title: 'Old Meeting Notes',
            icon: '📝',
            deletedAt: '2 hours ago',
            type: 'document'
        },
        {
            id: 'draft-article',
            title: 'Draft Article v1',
            icon: '📄',
            deletedAt: 'yesterday',
            type: 'document'
        },
        {
            id: 'temp-folder',
            title: 'Temp Folder',
            icon: '📁',
            deletedAt: '3 days ago',
            type: 'folder'
        },
        {
            id: 'unused-doc',
            title: 'Unused Document',
            icon: '📋',
            deletedAt: '1 week ago',
            type: 'document'
        },
    ]);

    const handleRestore = (id) => {
        setTrashedItems(trashedItems.filter(item => item.id !== id));
        // In real app, would call API to restore
    };

    const handleDeletePermanently = (id) => {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            setTrashedItems(trashedItems.filter(item => item.id !== id));
        }
    };

    const handleEmptyTrash = () => {
        if (window.confirm('Empty trash? All items will be permanently deleted.')) {
            setTrashedItems([]);
        }
    };

    const filteredItems = trashedItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="trash-page">
            <div className="trash-container">
                <header className="trash-header">
                    <div>
                        <h1><Trash2 size={28} /> Trash</h1>
                        <p>Items in trash will be automatically deleted after 30 days</p>
                    </div>
                    {trashedItems.length > 0 && (
                        <button className="btn btn-outline danger" onClick={handleEmptyTrash}>
                            <Trash2 size={16} /> Empty Trash
                        </button>
                    )}
                </header>

                {trashedItems.length > 0 && (
                    <div className="trash-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search in trash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}

                <div className="trash-content">
                    {filteredItems.length === 0 ? (
                        <div className="trash-empty">
                            <Trash2 size={48} />
                            <h2>Trash is empty</h2>
                            <p>Deleted documents will appear here</p>
                        </div>
                    ) : (
                        <div className="trash-list">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="trash-item">
                                    <div className="trash-item-icon">{item.icon}</div>
                                    <div className="trash-item-info">
                                        <span className="trash-item-title">{item.title}</span>
                                        <span className="trash-item-meta">
                                            <Clock size={12} /> Deleted {item.deletedAt}
                                        </span>
                                    </div>
                                    <div className="trash-item-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleRestore(item.id)}
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline danger"
                                            onClick={() => handleDeletePermanently(item.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="trash-warning">
                    <AlertTriangle size={16} />
                    <span>Items older than 30 days are automatically deleted</span>
                </div>
            </div>
        </div>
    );
};

export default Trash;
