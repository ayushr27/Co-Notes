import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import { Image as ImageIcon, Eye, Save, Send, ArrowLeft, X } from 'lucide-react';

const WriteArticle = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        // Mock save
        setTimeout(() => {
            setIsSaving(false);
            alert('Draft saved!');
        }, 1000);
    };

    const handlePublish = () => {
        if (!title.trim()) {
            alert('Please add a title');
            return;
        }
        // Mock publish
        alert('Article published!');
        navigate('/my-articles');
    };

    const handlePreview = () => {
        // Mock preview - would open in new tab
        alert('Preview functionality coming soon!');
    };

    return (
        <div className="write-article-page">
            <header className="write-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="write-actions">
                    <button className="btn btn-outline" onClick={handlePreview}>
                        <Eye size={16} /> Preview
                    </button>
                    <button className="btn btn-outline" onClick={handleSaveDraft} disabled={isSaving}>
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button className="btn btn-primary" onClick={handlePublish}>
                        <Send size={16} /> Publish
                    </button>
                </div>
            </header>

            <div className="write-container">
                {/* Cover Image */}
                <div className="cover-upload">
                    {coverImage ? (
                        <div className="cover-preview" style={{ backgroundImage: `url(${coverImage})` }}>
                            <button className="remove-cover" onClick={() => setCoverImage('')}>
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="cover-placeholder"
                            onClick={() => setCoverImage('https://images.unsplash.com/photo-1499750310159-5b5f87e8e195?w=1200')}
                        >
                            <ImageIcon size={24} />
                            <span>Add cover image</span>
                        </button>
                    )}
                </div>

                {/* Title */}
                <input
                    type="text"
                    className="article-title-input"
                    placeholder="Article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Tags */}
                <div className="tags-section">
                    <div className="tags-container">
                        {tags.map((tag) => (
                            <span key={tag} className="tag">
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                            </span>
                        ))}
                        <input
                            type="text"
                            placeholder="Add tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="tag-input"
                        />
                    </div>
                </div>

                {/* Editor */}
                <div className="article-editor">
                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your article..."
                    />
                </div>
            </div>
        </div>
    );
};

export default WriteArticle;
