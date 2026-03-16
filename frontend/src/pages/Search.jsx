import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, Clock, ArrowLeft, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
                // Backend returns: [{ id, title, type, icon, lastEdited }, ...]
                setResults(res.data);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    const getLinkForType = (type, id) => {
        switch (type) {
            case 'document': return `/doc/${id}`;
            case 'collection': return `/collection/${id}`;
            case 'article': return `/community/article/${id}`;
            case 'idea': return `/ideas`;
            default: return '/dashboard';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                                <span className="recent-item" style={{ opacity: 0.5 }}>No recent searches...</span>
                            </div>
                        </div>
                    ) : loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Loader2 size={24} className="spin" style={{ color: 'var(--primary.main)' }} />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="search-results-list">
                            <h3>Results ({results.length})</h3>
                            {results.map((item) => (
                                <Link to={getLinkForType(item.type, item.id)} key={`${item.type}-${item.id}`} className="search-result-item">
                                    <span className="result-icon">{item.icon || '📄'}</span>
                                    <div className="result-info">
                                        <span className="result-title">{item.title}</span>
                                        <span className="result-meta">
                                            {item.type} • Edited {formatDate(item.lastEdited)}
                                        </span>
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
