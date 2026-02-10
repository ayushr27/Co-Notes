import React, { useState } from 'react';
import { X, UserPlus, Trash2, Users, Search } from 'lucide-react';
import { getAvatarColor } from './MemberStack';

const MOCK_USERS = {
    'user_1': { id: 'user_1', name: 'Alice Johnson' },
    'user_2': { id: 'user_2', name: 'Bob Smith' },
    'user_3': { id: 'user_3', name: 'Charlie Brown' },
    'user_4': { id: 'user_4', name: 'Diana Ross' },
    'user_5': { id: 'user_5', name: 'Eve Martinez' },
    'user_6': { id: 'user_6', name: 'Frank Wilson' },
    'user_7': { id: 'user_7', name: 'Grace Lee' },
    'user_8': { id: 'user_8', name: 'Henry Davis' },
};

const InviteModal = ({ isOpen, onClose, activeMembers, onAddMember, onRemoveMember }) => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const trimmedId = userId.trim();
        if (!trimmedId) {
            setError('Please enter a User ID');
            return;
        }

        if (activeMembers.some(m => m.id === trimmedId)) {
            setError('This user is already a member');
            return;
        }

        const user = MOCK_USERS[trimmedId];
        if (!user) {
            setError(`User "${trimmedId}" not found. Try: user_1 through user_8`);
            return;
        }

        onAddMember(user);
        setSuccess(`${user.name} has been added!`);
        setUserId('');
        setTimeout(() => setSuccess(''), 2000);
    };

    return (
        <div className="modal-overlay invite-modal-overlay" onClick={onClose}>
            <div className="invite-modal" onClick={e => e.stopPropagation()}>
                <div className="invite-modal-header">
                    <div className="invite-modal-title">
                        <Users size={20} />
                        <h2>Share Collection</h2>
                    </div>
                    <button className="invite-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="invite-form" onSubmit={handleSubmit}>
                    <div className="invite-input-row">
                        <div className="invite-input-wrapper">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Enter User ID (e.g. user_2)"
                                value={userId}
                                onChange={(e) => { setUserId(e.target.value); setError(''); }}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="invite-send-btn">
                            <UserPlus size={16} />
                            Invite
                        </button>
                    </div>
                    {error && <p className="invite-error">{error}</p>}
                    {success && <p className="invite-success">{success}</p>}
                </form>

                <div className="invite-members-section">
                    <h3>Members ({activeMembers.length})</h3>
                    <div className="invite-members-list">
                        {activeMembers.map(member => (
                            <div key={member.id} className="invite-member-row">
                                <div className="invite-member-info">
                                    <div
                                        className="invite-member-avatar"
                                        style={{ backgroundColor: getAvatarColor(member.id) }}
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="invite-member-name">{member.name}</span>
                                        <span className="invite-member-id">{member.id}</span>
                                    </div>
                                </div>
                                {member.id !== 'owner' && (
                                    <button
                                        className="invite-remove-btn"
                                        onClick={() => onRemoveMember(member.id)}
                                        title="Remove member"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                {member.id === 'owner' && (
                                    <span className="invite-owner-badge">Owner</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="invite-hint">
                    <p>Available test IDs: user_1 through user_8</p>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
