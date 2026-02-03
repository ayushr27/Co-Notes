import React, { useState } from 'react';
import {
    Lock,
    Globe,
    Users,
    ChevronDown,
    Link as LinkIcon,
    Check
} from 'lucide-react';

const SharePopover = ({ currentPermission, onPermissionChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const permissions = [
        { id: 'private', label: 'Private', icon: Lock, desc: 'Only you can view and edit' },
        { id: 'public', label: 'Public', icon: Globe, desc: 'Anyone can view, only you can edit' },
        { id: 'collaborative', label: 'Collaborative', icon: Users, desc: 'Anyone with the link can edit' }
    ];

    const handleSelect = (id) => {
        onPermissionChange(id);
        setIsOpen(false);
    };

    const copyLink = () => {
        // Mock copy
        alert("Link copied to clipboard!");
    };

    const activePerm = permissions.find(p => p.id === currentPermission) || permissions[0];

    return (
        <div className="share-popover-container" style={{ position: 'relative', display: 'inline-block' }}>
            <button className="btn btn-sm btn-outline share-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
                {currentPermission === 'private' && <Lock size={14} />}
                {currentPermission === 'public' && <Globe size={14} />}
                {currentPermission === 'collaborative' && <Users size={14} />}
                <span>Share</span>
            </button>

            {isOpen && (
                <>
                    <div className="popover-backdrop" onClick={() => setIsOpen(false)}></div>
                    <div className="share-popover-content">
                        <div className="popover-header">
                            <h3>Share to web</h3>
                            <p>Publish and share link with others</p>
                        </div>

                        <div className="permission-selector">
                            {permissions.map((perm) => (
                                <button
                                    key={perm.id}
                                    className={`perm-item ${currentPermission === perm.id ? 'active' : ''}`}
                                    onClick={() => handleSelect(perm.id)}
                                >
                                    <div className="perm-icon">
                                        <perm.icon size={16} />
                                    </div>
                                    <div className="perm-details">
                                        <span className="perm-label">{perm.label}</span>
                                        <span className="perm-desc">{perm.desc}</span>
                                    </div>
                                    {currentPermission === perm.id && <Check size={16} className="check-icon" />}
                                </button>
                            ))}
                        </div>

                        <div className="popover-footer">
                            <button className="copy-link-btn" onClick={copyLink}>
                                <LinkIcon size={14} /> Copy link
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SharePopover;
