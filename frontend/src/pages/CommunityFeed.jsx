import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { 
    TrendingUp, Sparkles, Search, Plus, Globe, Grid, List, 
    Users, BookOpen, Award, Clock, Heart, MessageCircle, 
    Bookmark, ChevronRight, Flame, Crown, Zap, Coffee,
    Hash, ArrowUpRight
} from 'lucide-react';

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

    // Mock Data - Extended
    const articles = [
        {
            id: 1,
            title: "The Future of Personal Knowledge Management",
            excerpt: "Why we need better tools to think, not just tools to write. Exploring the graph-based approach to note-taking.",
            cover: "https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=600&q=80",
            date: "Oct 24",
            readTime: "8 min read",
            author: { name: "Sarah Lin", initials: "SL", username: "sarahlin", avatar: null, verified: true },
            likes: 124,
            comments: 18,
            trending: true,
            category: 'productivity',
            saved: false
        },
        {
            id: 2,
            title: "Building a Design System in 2024",
            excerpt: "A comprehensive guide to tokens, variables, and component architecture for modern web apps.",
            cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
            date: "Oct 22",
            readTime: "12 min read",
            author: { name: "Mark Davis", initials: "MD", username: "markd", avatar: null, verified: false },
            likes: 89,
            comments: 5,
            trending: false,
            category: 'design',
            saved: true
        },
        {
            id: 3,
            title: "React Server Components: A Practical Guide",
            excerpt: "Understanding the paradigm shift in React data fetching and rendering patterns.",
            cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
            date: "Oct 20",
            readTime: "15 min read",
            author: { name: "David Chen", initials: "DC", username: "davidc", avatar: null, verified: true },
            likes: 256,
            comments: 42,
            trending: true,
            category: 'development',
            saved: false
        },
        {
            id: 4,
            title: "Mastering Productivity with Second Brain",
            excerpt: "How I organize my digital life using the PARA method and connected note-taking.",
            cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
            date: "Oct 18",
            readTime: "10 min read",
            author: { name: "Emily Rose", initials: "ER", username: "emilyrose", avatar: null, verified: true },
            likes: 312,
            comments: 28,
            trending: true,
            category: 'productivity',
            saved: true
        },
        {
            id: 5,
            title: "The Art of Minimal Note-Taking",
            excerpt: "Less is more. Why simplicity wins in personal knowledge management.",
            cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
            date: "Oct 15",
            readTime: "6 min read",
            author: { name: "Alex Kim", initials: "AK", username: "alexkim", avatar: null, verified: false },
            likes: 145,
            comments: 12,
            trending: false,
            category: 'writing',
            saved: false
        },
        {
            id: 6,
            title: "Collaborative Writing: Best Practices",
            excerpt: "Tips for effective team documentation and knowledge sharing.",
            cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
            date: "Oct 12",
            readTime: "9 min read",
            author: { name: "Jordan Lee", initials: "JL", username: "jordanlee", avatar: null, verified: false },
            likes: 98,
            comments: 8,
            trending: false,
            category: 'writing',
            saved: false
        }
    ];

    const trendingArticles = articles.filter(a => a.trending);
    let displayedArticles = activeTab === 'trending' ? trendingArticles : articles;
    
    // Filter by category
    if (activeCategory !== 'all') {
        displayedArticles = displayedArticles.filter(a => a.category === activeCategory);
    }

    const filteredArticles = searchQuery
        ? displayedArticles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : displayedArticles;

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
