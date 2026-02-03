import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Edit2, Trash2, MoreHorizontal, Plus, Globe, Lock } from 'lucide-react';

const MyArticles = () => {
    const [activeTab, setActiveTab] = useState('published');

    // Mock articles
    const articles = {
        published: [
            {
                id: 'future-pkm',
                title: 'The Future of Personal Knowledge Management',
                excerpt: 'Exploring how modern tools are changing the way we think and learn...',
                publishedAt: 'Oct 24, 2024',
                views: 1234,
                likes: 89
            },
            {
                id: 'productivity-tips',
                title: '10 Productivity Tips for Developers',
                excerpt: 'Simple habits that can transform your workday...',
                publishedAt: 'Oct 18, 2024',
                views: 856,
                likes: 52
            },
        ],
        drafts: [
            {
                id: 'draft-1',
                title: 'Building a Second Brain',
                excerpt: 'How to organize your digital life effectively...',
                lastEdited: '2 hours ago',
            },
            {
                id: 'draft-2',
                title: 'Untitled Draft',
                excerpt: 'Started working on something new...',
                lastEdited: 'yesterday',
            },
        ]
    };

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
                                        <p className="article-excerpt">{article.excerpt}</p>
                                        <div className="article-stats">
                                            <span>Published {article.publishedAt}</span>
                                            <span>•</span>
                                            <span>{article.views} views</span>
                                            <span>•</span>
                                            <span>{article.likes} likes</span>
                                        </div>
                                    </div>
                                    <div className="article-actions">
                                        <Link to={`/community/article/${article.id}`} className="btn btn-sm btn-outline">
                                            <Eye size={14} /> View
                                        </Link>
                                        <button className="btn btn-sm btn-outline">
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button className="btn btn-sm btn-outline danger">
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
                                        <p className="article-excerpt">{draft.excerpt}</p>
                                        <div className="article-stats">
                                            <span>Last edited {draft.lastEdited}</span>
                                        </div>
                                    </div>
                                    <div className="article-actions">
                                        <Link to={`/write?draft=${draft.id}`} className="btn btn-sm btn-primary">
                                            <Edit2 size={14} /> Continue
                                        </Link>
                                        <button className="btn btn-sm btn-outline danger">
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
