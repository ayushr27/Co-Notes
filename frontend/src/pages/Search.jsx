import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, Clock, ArrowLeft, X } from 'lucide-react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Mock search data
    const allDocs = [
        { id: 'project-vision', title: 'Project Vision', icon: '📄', type: 'document', lastEdited: '2h ago' },
        { id: 'meeting-notes', title: 'Meeting Notes', icon: '📝', type: 'document', lastEdited: '5h ago' },
        { id: 'launch-plan', title: 'Launch Plan', icon: '🚀', type: 'document', lastEdited: 'yesterday' },
        { id: 'product-roadmap', title: 'Product Roadmap', icon: '📊', type: 'document', lastEdited: '3 days ago' },
        { id: 'quarterly-goals', title: 'Quarterly Goals', icon: '🎯', type: 'document', lastEdited: '1 week ago' },
        { id: 'getting-started', title: 'Getting Started', icon: '📖', type: 'document', lastEdited: '2 weeks ago' },
        { id: 'personal-home', title: 'Personal Home', icon: '🏠', type: 'document', lastEdited: '1 month ago' },
        { id: 'journal', title: 'Journal', icon: '📓', type: 'document', lastEdited: 'today' },
    ];

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = allDocs.filter(doc =>
            doc.title.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="search-page">
            <div className="search-container">
                <Link to="/dashboard" className="search-back-link">
                    <ArrowLeft size={20} />
                </Link>

                <div className="search-input-wrapper">
                    <SearchIcon size={20} className="search-input-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search notes, documents, and more..."
                        value={query}
                        onChange={handleSearch}
                        autoFocus
                    />
                    {query && (
                        <button className="search-clear-btn" onClick={clearSearch}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className="search-results">
                    {query === '' ? (
                        <div className="search-recent">
                            <h3><Clock size={14} /> Recent Searches</h3>
                            <div className="recent-list">
                                <Link to="/doc/project-vision" className="recent-item">
                                    <FileText size={16} />
                                    <span>Project Vision</span>
                                </Link>
                                <Link to="/doc/meeting-notes" className="recent-item">
                                    <FileText size={16} />
                                    <span>Meeting Notes</span>
                                </Link>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="search-results-list">
                            <h3>Results ({results.length})</h3>
                            {results.map((doc) => (
                                <Link to={`/doc/${doc.id}`} key={doc.id} className="search-result-item">
                                    <span className="result-icon">{doc.icon}</span>
                                    <div className="result-info">
                                        <span className="result-title">{doc.title}</span>
                                        <span className="result-meta">Edited {doc.lastEdited}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <p>No results found for "{query}"</p>
                            <span>Try a different search term</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
