import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Clock, Flame } from 'lucide-react';

const ArticleCard = ({ article, viewMode = 'grid' }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(article.saved || false);
    const [likeCount, setLikeCount] = useState(article.likes);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    return (
        <article className={`article-card ${viewMode === 'list' ? 'list-mode' : ''}`} aria-label={article.title}>
            <Link to={`/community/article/${article.id}`} className="article-cover-link" aria-hidden="true">
                <div className="article-cover" style={{ backgroundImage: `url(${article.cover})` }}>
                    {article.trending && (
                        <span className="trending-tag">
                            <Flame size={12} /> Trending
                        </span>
                    )}
                    {article.category && (
                        <span className="category-tag">{article.category}</span>
                    )}
                </div>
            </Link>
            <div className="article-content">
                <div className="article-meta">
                    <Link to={`/user/${article.author.username}`} className="author-info">
                        <div className="avatar-sm">{article.author.initials}</div>
                        <span className="author-name">
                            {article.author.name}
                            {article.author.verified && (
                                <span className="verified-badge" title="Verified">✓</span>
                            )}
                        </span>
                    </Link>
                    <div className="meta-right">
                        {article.readTime && (
                            <span className="read-time">
                                <Clock size={12} /> {article.readTime}
                            </span>
                        )}
                        <span className="publish-date">{article.date}</span>
                    </div>
                </div>

                <Link to={`/community/article/${article.id}`} className="article-title-link">
                    <h3>{article.title}</h3>
                </Link>
                <p className="article-excerpt">{article.excerpt}</p>

                <div className="article-footer">
                    <div className="footer-stats">
                        <button 
                            className={`stat-btn ${isLiked ? 'liked' : ''}`} 
                            onClick={handleLike}
                        >
                            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> 
                            <span>{likeCount}</span>
                        </button>
                        <button className="stat-btn">
                            <MessageCircle size={16} /> <span>{article.comments}</span>
                        </button>
                    </div>
                    <button 
                        className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                        onClick={handleSave}
                    >
                        <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
