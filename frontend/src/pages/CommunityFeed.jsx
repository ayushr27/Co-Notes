import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import {
    TrendingUp, Sparkles, Search, Plus, Globe, Grid, List,
    Users, BookOpen, Award, Clock, Heart, MessageCircle,
    Bookmark, ChevronRight, Flame, Crown, Zap, Coffee,
    Hash, ArrowUpRight, Loader2
} from 'lucide-react';
import api from '../services/api';

const CommunityFeed = () => {
    const [activeTab, setActiveTab] = useState('foryou');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('all');

    // Categories for filtering
    const categories = [
        { id: 'all', label: 'All', icon: Globe },
        { id: 'productivity', label: 'Productivity', icon: Zap },
        { id: 'design', label: 'Design', icon: Sparkles },
        { id: 'development', label: 'Development', icon: Hash },
        { id: 'writing', label: 'Writing', icon: BookOpen },
        { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
    ];

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await api.get('/articles/feed');
                // Format the API data to match the component's expected structure
                const formatted = res.data.map(a => ({
                    ...a,
                    cover: a.coverImage,
                    date: new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    readTime: `${a.estimatedReadTime || 5} min read`,
                    likes: a.likes?.length || 0,
                    comments: a._count?.comments || 0,
                    // If no author, provide a fallback
                    author: a.author || { name: 'Unknown', initials: 'U', username: 'unknown' }
                }));
                setArticles(formatted);
            } catch (error) {
                console.error('Failed to fetch community feed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const trendingArticles = articles.filter(a => a.trending);
    let displayedArticles = activeTab === 'trending' ? trendingArticles : articles;

    // Filter by category
    if (activeCategory !== 'all') {
        displayedArticles = displayedArticles.filter(a => a.category === activeCategory);
    }

    const filteredArticles = searchQuery
        ? displayedArticles.filter(a =>
            a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : displayedArticles;

    if (loading) {
        return (
            <div className="community-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="community-page" role="main">
            {/* Header */}
            <header className="community-header" aria-label="Discover feed header">
                <div className="header-title">
                    <div>
                        <h1>Discover</h1>
                        <p>Explore articles and ideas from the community</p>
                    </div>
                </div>
                <Link to="/write" className="btn-create-collection">
                    <Plus size={18} /> Write Article
                </Link>
            </header>

            {/* Main Content Layout */}
            <div className="community-layout">
                {/* Main Feed */}
                <div className="community-main">
                    {/* Search and Filter Bar */}
                    <div className="collections-toolbar">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search articles, topics, or authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="toolbar-actions">
                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid view"
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                    title="List view"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="category-pills">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <cat.icon size={14} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Articles Grid */}
                    <div className="articles-section">
                        {filteredArticles.length > 0 ? (
                            <div className={`articles-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                {filteredArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Search size={48} />
                                <h2>No articles found</h2>
                                <p>Try a different search term or category</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;
