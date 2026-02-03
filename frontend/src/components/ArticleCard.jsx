import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const ArticleCard = ({ article }) => {
    return (
        <div className="article-card">
            <div className="article-cover" style={{ backgroundImage: `url(${article.cover})` }}></div>
            <div className="article-content">
                <div className="article-meta">
                    <div className="author-info">
                        <div className="avatar-sm">{article.author.initials}</div>
                        <span className="author-name">{article.author.name}</span>
                    </div>
                    <span className="publish-date">{article.date}</span>
                </div>

                <Link to={`/community/article/${article.id}`} className="article-title-link">
                    <h3>{article.title}</h3>
                </Link>
                <p className="article-excerpt">{article.excerpt}</p>

                <div className="article-footer">
                    <div className="footer-stats">
                        <button className="stat-btn">
                            <Heart size={16} /> <span>{article.likes}</span>
                        </button>
                        <button className="stat-btn">
                            <MessageCircle size={16} /> <span>{article.comments}</span>
                        </button>
                    </div>
                    <button className="bookmark-btn">
                        <Bookmark size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
