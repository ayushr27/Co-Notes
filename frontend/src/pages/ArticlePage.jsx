import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import { Clock, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';

const ArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                const data = res.data;
                setArticle({
                    ...data,
                    cover: data.coverImage,
                    date: new Date(data.publishedAt || data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    readTime: `${data.estimatedReadTime || 5} min read`,
                    author: data.author || { name: 'Unknown', initials: 'U' },
                    content: data.content || ''
                });
            } catch (error) {
                console.error('Failed to fetch article:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="article-read-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    if (!article) return <div className="loading-state">Article not found</div>;

    return (
        <div className="article-read-page">
            <header className="article-navbar">
                <div className="container-limit nav-inner">
                    <Link to="/community" className="back-link">
                        <ArrowLeft size={20} /> Back to Feed
                    </Link>
                    <div className="article-nav-actions">
                        <span className="author-name-nav">{article.author.name}</span>
                        <button className="btn btn-primary btn-sm">Follow</button>
                    </div>
                </div>
            </header>

            <div className="article-hero-image" style={{ backgroundImage: `url(${article.cover})` }}></div>

            <article className="article-container">
                <div className="article-header">
                    <h1>{article.title}</h1>
                    <div className="article-meta-row">
                        <div className="author-block">
                            <div className="avatar-sm">{article.author.initials}</div>
                            <div className="author-text">
                                <span className="name">{article.author.name}</span>
                                <span className="meta-sub">Author</span>
                            </div>
                        </div>
                        <div className="meta-divider"></div>
                        <div className="meta-item">
                            <Calendar size={16} /> {article.date}
                        </div>
                        <div className="meta-item">
                            <Clock size={16} /> {article.readTime}
                        </div>
                    </div>
                </div>

                <div className="article-body">
                    <TiptapEditor content={article.content} editable={false} />
                </div>
            </article>
        </div>
    );
};

export default ArticlePage;
