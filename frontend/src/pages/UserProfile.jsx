import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Link as LinkIcon, Calendar, Mail,
    FileText, Heart, MessageCircle, Eye,
    Settings, Edit3, MoreHorizontal, Grid, List,
    Award, TrendingUp, Users, Star, Clock, ExternalLink,
    PenTool, Folder, CheckCircle
} from 'lucide-react';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('articles');
    const [viewMode, setViewMode] = useState('grid');

    // User data
    const user = {
        name: "Jane Doe",
        username: "jane",
        initials: "JD",
        bio: "Product Designer & Thinker. Writing about design systems, productivity, and the future of work. Building tools that help people think better.",
        location: "San Francisco, CA",
        website: "janedoe.com",
        email: "jane@example.com",
        joinedDate: "September 2024",
        followers: 1247,
        following: 45,
        isOwnProfile: true // This would come from auth context
    };

    // Stats
    const stats = [
        { label: 'Articles', value: 12, icon: <FileText size={18} /> },
        { label: 'Total Views', value: '24.5k', icon: <Eye size={18} /> },
        { label: 'Likes Received', value: 892, icon: <Heart size={18} /> },
        { label: 'Collections', value: 8, icon: <Folder size={18} /> }
    ];

    // Articles by user
    const articles = [
        {
            id: 1,
            title: "Building a Second Brain: My Complete System",
            excerpt: "How I organize my digital life using linked notes, daily reviews, and progressive summarization.",
            cover: "https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=400&q=80",
            date: "Oct 24",
            readTime: "8 min",
            likes: 234,
            comments: 18,
            views: 4521,
            published: true
        },
        {
            id: 2,
            title: "The Design System That Scales",
            excerpt: "Lessons from building a component library used by 50+ developers.",
            cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
            date: "Oct 18",
            readTime: "12 min",
            likes: 189,
            comments: 24,
            views: 3892,
            published: true
        },
        {
            id: 3,
            title: "Why I Switched to Local-First Apps",
            excerpt: "The case for owning your data and working offline-first.",
            cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80",
            date: "Oct 10",
            readTime: "6 min",
            likes: 156,
            comments: 12,
            views: 2845,
            published: true
        },
        {
            id: 4,
            title: "My Morning Routine for Deep Work",
            excerpt: "A practical guide to protecting your most creative hours.",
            cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80",
            date: "Sep 28",
            readTime: "5 min",
            likes: 312,
            comments: 42,
            views: 6234,
            published: true
        }
    ];

    // Collections
    const collections = [
        { id: 1, name: "Design Resources", count: 24, icon: "🎨" },
        { id: 2, name: "Productivity", count: 18, icon: "⚡" },
        { id: 3, name: "Reading List", count: 45, icon: "📚" },
        { id: 4, name: "Project Ideas", count: 12, icon: "💡" }
    ];

    // Achievements
    const achievements = [
        { id: 1, name: "First Article", icon: "✍️", earned: true },
        { id: 2, name: "100 Likes", icon: "❤️", earned: true },
        { id: 3, name: "Trending Writer", icon: "🔥", earned: true },
        { id: 4, name: "1K Followers", icon: "👥", earned: true },
        { id: 5, name: "Weekly Streak", icon: "📆", earned: false },
        { id: 6, name: "Top 10 Writer", icon: "🏆", earned: false }
    ];

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <div className="profile-page-v2">
            {/* Banner */}
            <div className="profile-banner">
                <div className="banner-pattern"></div>
            </div>

            {/* Profile Header */}
            <div className="profile-container">
                <div className="profile-header-card">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-lg">{user.initials}</div>
                        {user.isOwnProfile && (
                            <button className="avatar-edit-btn" title="Change avatar">
                                <Edit3 size={14} />
                            </button>
                        )}
                    </div>

                    <div className="profile-header-content">
                        <div className="profile-name-row">
                            <div>
                                <h1>{user.name}</h1>
                                <span className="profile-username">@{user.username}</span>
                            </div>
                            <div className="profile-actions">
                                {user.isOwnProfile ? (
                                    <>
                                        <Link to="/settings" className="btn-profile-action">
                                            <Settings size={18} />
                                            Edit Profile
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-profile-primary">
                                            <Users size={18} />
                                            Follow
                                        </button>
                                        <button className="btn-icon-action">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="profile-bio">{user.bio}</p>

                        <div className="profile-meta-row">
                            <span className="meta-item">
                                <MapPin size={14} />
                                {user.location}
                            </span>
                            <span className="meta-item">
                                <LinkIcon size={14} />
                                <a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a>
                            </span>
                            <span className="meta-item">
                                <Calendar size={14} />
                                Joined {user.joinedDate}
                            </span>
                        </div>

                        <div className="profile-follow-stats">
                            <span><strong>{formatNumber(user.followers)}</strong> Followers</span>
                            <span><strong>{user.following}</strong> Following</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="profile-stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="profile-stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="profile-tabs-bar">
                    <div className="tabs-left">
                        <button
                            className={`profile-tab ${activeTab === 'articles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('articles')}
                        >
                            <FileText size={16} />
                            Articles
                        </button>
                        <button
                            className={`profile-tab ${activeTab === 'collections' ? 'active' : ''}`}
                            onClick={() => setActiveTab('collections')}
                        >
                            <Folder size={16} />
                            Collections
                        </button>
                        <button
                            className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
                            onClick={() => setActiveTab('achievements')}
                        >
                            <Award size={16} />
                            Achievements
                        </button>
                    </div>
                    {activeTab === 'articles' && (
                        <div className="view-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                title="Grid view"
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                title="List view"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                    <div className={`profile-articles-grid ${viewMode}`}>
                        {articles.map(article => (
                            <Link to={`/community/article/${article.id}`} key={article.id} className="profile-article-card">
                                <div
                                    className="article-cover"
                                    style={{ backgroundImage: `url(${article.cover})` }}
                                />
                                <div className="article-content">
                                    <h3>{article.title}</h3>
                                    <p>{article.excerpt}</p>
                                    <div className="article-meta">
                                        <span className="meta-date">{article.date}</span>
                                        <span className="meta-dot">•</span>
                                        <span><Clock size={12} /> {article.readTime}</span>
                                    </div>
                                    <div className="article-stats">
                                        <span><Eye size={14} /> {formatNumber(article.views)}</span>
                                        <span><Heart size={14} /> {article.likes}</span>
                                        <span><MessageCircle size={14} /> {article.comments}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {user.isOwnProfile && (
                            <Link to="/write" className="profile-article-card new-article">
                                <PenTool size={32} />
                                <span>Write New Article</span>
                            </Link>
                        )}
                    </div>
                )}

                {/* Collections Tab */}
                {activeTab === 'collections' && (
                    <div className="profile-collections-grid">
                        {collections.map(collection => (
                            <Link to={`/collections/${collection.id}`} key={collection.id} className="profile-collection-card">
                                <span className="collection-icon">{collection.icon}</span>
                                <div className="collection-info">
                                    <h4>{collection.name}</h4>
                                    <span>{collection.count} items</span>
                                </div>
                                <ExternalLink size={16} className="collection-arrow" />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="profile-achievements-grid">
                        {achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                            >
                                <span className="achievement-icon">{achievement.icon}</span>
                                <span className="achievement-name">{achievement.name}</span>
                                {achievement.earned && <CheckCircle size={14} className="earned-check" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
