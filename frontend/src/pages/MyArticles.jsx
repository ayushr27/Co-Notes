import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Edit2, Trash2, MoreHorizontal, Plus, Globe, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';

const MyArticles = () => {
    const [activeTab, setActiveTab] = useState('published');
    const [articles, setArticles] = useState({ published: [], drafts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await api.get('/articles/my');

            // Assuming res.data is an array of articles
            const published = res.data.filter(a => a.published)
                .sort((a, b) => new Date(b.publishedAt || b.updatedAt) - new Date(a.publishedAt || a.updatedAt));
            const drafts = res.data.filter(a => !a.published)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            setArticles({ published, drafts });
        } catch (error) {
            console.error('Failed to load articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.delete(`/articles/${id}`);
            fetchArticles();
        } catch (error) {
            console.error('Failed to delete article:', error);
            alert('Failed to delete article');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="my-articles-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="my-articles-page">
            <div className="my-articles-container">
                <header className="my-articles-header">
                    <div>
                        <h1>My Articles</h1>
                        <p>Manage your published articles and drafts</p>
                    </div>
                    <Link to="/write" className="btn btn-primary">
                        <Plus size={18} /> Write New
                    </Link>
                </header>

                <div className="articles-tabs">
                    <button
                        className={`tab ${activeTab === 'published' ? 'active' : ''}`}
                        onClick={() => setActiveTab('published')}
                    >
                        <Globe size={16} /> Published ({articles.published.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('drafts')}
                    >
                        <Lock size={16} /> Drafts ({articles.drafts.length})
                    </button>
                </div>

                <div className="articles-content">
                    {activeTab === 'published' && (
                        <div className="articles-list">
                            {articles.published.map((article) => (
                                <div key={article.id} className="article-row">
                                    <div className="article-main">
                                        <Link to={`/community/article/${article.id}`} className="article-title-link">
                                            <h3>{article.title}</h3>
                                        </Link>
                                        <p className="article-excerpt">{article.subtitle || article.excerpt}</p>
                                        <div className="article-stats">
                                            <span>Published {formatDate(article.publishedAt)}</span>
                                            <span>•</span>
                                            <span>{article.views || 0} views</span>
                                            <span>•</span>
                                            <span>{article.likes?.length || 0} likes</span>
                                        </div>
                                    </div>
                                    <div className="article-actions">
                                        <Link to={`/community/article/${article.id}`} className="btn btn-sm btn-outline">
                                            <Eye size={14} /> View
                                        </Link>
                                        <Link to={`/write?draft=${article.id}`} className="btn btn-sm btn-outline">
                                            <Edit2 size={14} /> Edit
                                        </Link>
                                        <button className="btn btn-sm btn-outline danger" onClick={() => handleDelete(article.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'drafts' && (
                        <div className="articles-list">
                            {articles.drafts.map((draft) => (
                                <div key={draft.id} className="article-row draft">
                                    <div className="article-main">
                                        <h3>{draft.title}</h3>
                                        <p className="article-excerpt">{draft.subtitle || draft.excerpt}</p>
                                        <div className="article-stats">
                                            <span>Last edited {formatDate(draft.updatedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="article-actions">
                                        <Link to={`/write?draft=${draft.id}`} className="btn btn-sm btn-primary">
                                            <Edit2 size={14} /> Continue
                                        </Link>
                                        <button className="btn btn-sm btn-outline danger" onClick={() => handleDelete(draft.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {((activeTab === 'published' && articles.published.length === 0) ||
                        (activeTab === 'drafts' && articles.drafts.length === 0)) && (
                            <div className="empty-state">
                                <FileText size={48} />
                                <h2>No {activeTab} articles</h2>
                                <p>Start writing to see your articles here</p>
                                <Link to="/write" className="btn btn-primary">
                                    <Plus size={18} /> Write Article
                                </Link>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default MyArticles;
