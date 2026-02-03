import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { TrendingUp, Sparkles, Search, Filter, Plus } from 'lucide-react';

const CommunityFeed = () => {
    const [activeTab, setActiveTab] = useState('foryou');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data - Extended
    const articles = [
        {
            id: 1,
            title: "The Future of Personal Knowledge Management",
            excerpt: "Why we need better tools to think, not just tools to write. Exploring the graph-based approach to note-taking.",
            cover: "https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=600&q=80",
            date: "Oct 24",
            author: { name: "Sarah Lin", initials: "SL", username: "sarahlin" },
            likes: 124,
            comments: 18,
            trending: true
        },
        {
            id: 2,
            title: "Building a Design System in 2024",
            excerpt: "A comprehensive guide to tokens, variables, and component architecture for modern web apps.",
            cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
            date: "Oct 22",
            author: { name: "Mark Davis", initials: "MD", username: "markd" },
            likes: 89,
            comments: 5,
            trending: false
        },
        {
            id: 3,
            title: "React Server Components: A Practical Guide",
            excerpt: "Understanding the paradigm shift in React data fetching and rendering patterns.",
            cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
            date: "Oct 20",
            author: { name: "David Chen", initials: "DC", username: "davidc" },
            likes: 256,
            comments: 42,
            trending: true
        },
        {
            id: 4,
            title: "Mastering Productivity with Second Brain",
            excerpt: "How I organize my digital life using the PARA method and connected note-taking.",
            cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
            date: "Oct 18",
            author: { name: "Emily Rose", initials: "ER", username: "emilyrose" },
            likes: 312,
            comments: 28,
            trending: true
        },
        {
            id: 5,
            title: "The Art of Minimal Note-Taking",
            excerpt: "Less is more. Why simplicity wins in personal knowledge management.",
            cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
            date: "Oct 15",
            author: { name: "Alex Kim", initials: "AK", username: "alexkim" },
            likes: 145,
            comments: 12,
            trending: false
        },
        {
            id: 6,
            title: "Collaborative Writing: Best Practices",
            excerpt: "Tips for effective team documentation and knowledge sharing.",
            cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
            date: "Oct 12",
            author: { name: "Jordan Lee", initials: "JL", username: "jordanlee" },
            likes: 98,
            comments: 8,
            trending: false
        }
    ];

    const trendingArticles = articles.filter(a => a.trending);
    const displayedArticles = activeTab === 'trending' ? trendingArticles : articles;

    const filteredArticles = searchQuery
        ? displayedArticles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.author.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : displayedArticles;

    return (
        <div className="community-page">
            <header className="community-header">
                <div className="community-title-section">
                    <h1>Discover</h1>
                    <p>Explore articles from the community</p>
                </div>
                <Link to="/write" className="btn btn-primary">
                    <Plus size={18} /> Write Article
                </Link>
            </header>

            {/* Search and Filter Bar */}
            <div className="community-toolbar">
                <div className="community-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="feed-tabs">
                    <button
                        className={`feed-tab ${activeTab === 'foryou' ? 'active' : ''}`}
                        onClick={() => setActiveTab('foryou')}
                    >
                        <Sparkles size={16} /> For You
                    </button>
                    <button
                        className={`feed-tab ${activeTab === 'trending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trending')}
                    >
                        <TrendingUp size={16} /> Trending
                    </button>
                </div>
            </div>

            {/* Featured Article (only on For You tab) */}
            {activeTab === 'foryou' && (
                <div className="featured-article">
                    <div
                        className="featured-cover"
                        style={{ backgroundImage: `url(${articles[0].cover})` }}
                    >
                        <div className="featured-overlay">
                            <span className="featured-badge">Featured</span>
                            <h2>{articles[0].title}</h2>
                            <p>{articles[0].excerpt}</p>
                            <div className="featured-meta">
                                <span className="author">{articles[0].author.name}</span>
                                <span>•</span>
                                <span>{articles[0].date}</span>
                                <span>•</span>
                                <span>{articles[0].likes} likes</span>
                            </div>
                            <Link to={`/community/article/${articles[0].id}`} className="btn btn-primary">
                                Read Article
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles Grid */}
            <div className="articles-section">
                <h2 className="section-label">
                    {activeTab === 'trending' ? 'Trending Now 🔥' : 'Latest Articles'}
                </h2>
                {filteredArticles.length > 0 ? (
                    <div className="articles-grid">
                        {filteredArticles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <Search size={48} />
                        <h3>No articles found</h3>
                        <p>Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityFeed;
