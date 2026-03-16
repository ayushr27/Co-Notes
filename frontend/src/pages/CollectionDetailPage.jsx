import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Share2, Star, MoreHorizontal, Settings,
    Briefcase, Plane, GraduationCap, Lightbulb, BookOpen, Folder, Loader2
} from 'lucide-react';
import api from '../services/api';
import MemberStack from '../components/MemberStack';
import InviteModal from '../components/InviteModal';
import ProjectHub from '../components/templates/ProjectHub';
import TravelPlanner from '../components/templates/TravelPlanner';
import LearningPath from '../components/templates/LearningPath';
import IdeaBoard from '../components/templates/IdeaBoard';
import PersonalJournal from '../components/templates/PersonalJournal';
import BlankCollection from '../components/templates/BlankCollection';

const TEMPLATE_INFO = {
    project: { label: 'Project Hub', icon: <Briefcase size={20} />, color: '#667eea' },
    travel: { label: 'Travel Planner', icon: <Plane size={20} />, color: '#43e97b' },
    learning: { label: 'Learning Path', icon: <GraduationCap size={20} />, color: '#4facfe' },
    ideas: { label: 'Idea Board', icon: <Lightbulb size={20} />, color: '#fee140' },
    journal: { label: 'Personal Journal', icon: <BookOpen size={20} />, color: '#f093fb' },
    blank: { label: 'Blank Collection', icon: <Folder size={20} />, color: '#a8edea' },
};

const DEFAULT_COLLECTIONS = {
    '1': { id: '1', name: 'Work Projects', icon: '💼', color: '#667eea', template: 'project', isPrivate: false },
    '2': { id: '2', name: 'Personal Notes', icon: '📝', color: '#f093fb', template: 'journal', isPrivate: true },
    '3': { id: '3', name: 'Learning Resources', icon: '📚', color: '#4facfe', template: 'learning', isPrivate: false },
    '4': { id: '4', name: 'Travel Plans', icon: '✈️', color: '#43e97b', template: 'travel', isPrivate: true },
};

const CollectionDetailPage = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const res = await api.get(`/collections/${collectionId}`);
                setCollection(res.data);
                setStarred(res.data.starred || false);
            } catch (error) {
                console.error('Failed to load collection:', error);
                // Fallback / error handling
                setCollection(DEFAULT_COLLECTIONS[collectionId] || {
                    id: collectionId,
                    name: 'Untitled Collection',
                    icon: '📁',
                    color: '#667eea',
                    template: 'blank',
                    isPrivate: false
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [collectionId]);

    // Active members state (collaboration)
    const [activeMembers, setActiveMembers] = useState([
        { id: 'owner', name: 'Jane (You)' }
    ]);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [starred, setStarred] = useState(false);

    const handleAddMember = (user) => {
        setActiveMembers(prev => [...prev, user]);
    };

    const handleRemoveMember = (userId) => {
        setActiveMembers(prev => prev.filter(m => m.id !== userId));
    };

    const templateType = collection?.template || 'blank';
    const templateInfo = TEMPLATE_INFO[templateType] || TEMPLATE_INFO.blank;
    const isShared = activeMembers.length > 1;

    const handleStarToggle = async () => {
        setStarred(!starred);
        // Assuming we can star it via a direct call
        try {
            await api.patch(`/collections/${collectionId}/star`);
        } catch (error) {
            console.error('Failed to star collection', error);
            setStarred(starred); // revert on failure
        }
    };

    const renderTemplate = () => {
        switch (templateType) {
            case 'project':
                return <ProjectHub activeMembers={activeMembers} />;
            case 'travel':
                return <TravelPlanner activeMembers={activeMembers} />;
            case 'learning':
                return <LearningPath activeMembers={activeMembers} />;
            case 'ideas':
                return <IdeaBoard activeMembers={activeMembers} />;
            case 'journal':
                return <PersonalJournal activeMembers={activeMembers} isShared={isShared} />;
            case 'blank':
            default:
                return <BlankCollection activeMembers={activeMembers} />;
        }
    };

    if (loading) {
        return (
            <div className="collection-detail-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    if (!collection) {
        return <div className="collection-detail-page">Collection not found</div>;
    }

    return (
        <div className="collection-detail-page">
            {/* Header */}
            <header className="collection-detail-header">
                <div className="collection-detail-left">
                    <button className="cd-back-btn" onClick={() => navigate('/collections')}>
                        <ArrowLeft size={18} />
                    </button>
                    <span className="cd-collection-icon">{collection.icon}</span>
                    <div className="cd-title-group">
                        <h1>{collection.name}</h1>
                        <div className="cd-template-badge" style={{ color: templateInfo.color }}>
                            {templateInfo.icon}
                            <span>{templateInfo.label}</span>
                        </div>
                    </div>
                </div>
                <div className="collection-detail-right">
                    <MemberStack members={activeMembers} />
                    <button
                        className={`cd-star-btn ${starred ? 'starred' : ''}`}
                        onClick={handleStarToggle}
                    >
                        <Star size={18} fill={starred ? 'currentColor' : 'none'} />
                    </button>
                    <button className="cd-share-btn" onClick={() => setShowInviteModal(true)}>
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                </div>
            </header>

            {/* Template Content */}
            <div className="collection-detail-body">
                {renderTemplate()}
            </div>

            {/* Invite Modal */}
            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                activeMembers={activeMembers}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
            />
        </div>
    );
};

export default CollectionDetailPage;
