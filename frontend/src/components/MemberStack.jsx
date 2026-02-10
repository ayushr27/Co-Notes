import React from 'react';

const AVATAR_COLORS = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a',
    '#fee140', '#a8edea', '#ff9a9e', '#fbc2eb', '#84fab0'
];

const getAvatarColor = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const MemberStack = ({ members = [], maxVisible = 4, onlineIds = [] }) => {
    const visible = members.slice(0, maxVisible);
    const overflow = members.length - maxVisible;

    return (
        <div className="member-stack">
            {visible.map((member, index) => (
                <div
                    key={member.id}
                    className={`member-avatar ${onlineIds.includes(member.id) ? 'online' : ''}`}
                    style={{
                        backgroundColor: getAvatarColor(member.id),
                        zIndex: members.length - index
                    }}
                    title={member.name}
                >
                    {member.name.charAt(0).toUpperCase()}
                </div>
            ))}
            {overflow > 0 && (
                <div className="member-avatar member-overflow" style={{ zIndex: 0 }}>
                    +{overflow}
                </div>
            )}
        </div>
    );
};

export { getAvatarColor, AVATAR_COLORS };
export default MemberStack;
