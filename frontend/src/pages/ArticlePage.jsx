import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';

const ArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        // Mock data fetch
        setArticle({
            id,
            title: "The Future of Personal Knowledge Management",
            content: `
                <h2>Introduction</h2>
                <p>We are living in an information age where the ability to manage personal knowledge is more critical than ever.</p>
                <p>This article explores the evolution of note-taking tools, from simple text editors to graph-based knowledge networks.</p>
                <h3>The Block-Based Revolution</h3>
                <p>Tools like Notion introduced the concept of "blocks," transforming documents into LEGO-like structures that can be rearranged and transformed.</p>
                <blockquote>"The tool you use shapes the way you think."</blockquote>
            `,
            cover: "https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=1200",
            date: "Oct 24, 2024",
            readTime: "5 min read",
            author: { name: "Sarah Lin", initials: "SL" }
        });
    }, [id]);

    if (!article) return <div className="loading-state">Loading article...</div>;

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
