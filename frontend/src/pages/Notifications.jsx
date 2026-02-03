import React, { useState } from 'react';
import { Bell, MessageSquare, Users, FileText, Heart, Clock, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
    const [filter, setFilter] = useState('all');

    // Mock notifications
    const notifications = [
        {
            id: 1,
            type: 'mention',
            icon: MessageSquare,
            title: 'Sarah mentioned you',
            message: 'in "Project Vision" document',
            time: '2 minutes ago',
            read: false
        },
        {
            id: 2,
            type: 'share',
            icon: Users,
            title: 'New collaborator',
            message: 'John joined "Marketing Campaign" document',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'edit',
            icon: FileText,
            title: 'Document updated',
            message: '"Sprint Planning" was edited by Alex',
            time: '3 hours ago',
            read: true
        },
        {
            id: 4,
            type: 'like',
            icon: Heart,
            title: 'Your article was liked',
            message: '"The Future of PKM" received 12 new likes',
            time: '5 hours ago',
            read: true
        },
        {
            id: 5,
            type: 'comment',
            icon: MessageSquare,
            title: 'New comment',
            message: 'Lisa commented on your article',
            time: 'yesterday',
            read: true
        },
    ];

    // Activity log
    const activityLog = [
        { id: 1, action: 'Created', item: 'Meeting Notes', time: 'Today, 2:30 PM' },
        { id: 2, action: 'Edited', item: 'Project Vision', time: 'Today, 11:00 AM' },
        { id: 3, action: 'Shared', item: 'Launch Plan', time: 'Yesterday, 4:15 PM' },
        { id: 4, action: 'Published', item: 'The Future of PKM', time: 'Yesterday, 10:00 AM' },
        { id: 5, action: 'Commented on', item: 'Product Roadmap', time: '2 days ago' },
    ];

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.read);

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <header className="notifications-header">
                    <h1>Notifications & Activity</h1>
                    <button className="btn btn-outline btn-sm">
                        <Check size={16} /> Mark all as read
                    </button>
                </header>

                <div className="notifications-layout">
                    {/* Notifications Panel */}
                    <div className="notifications-panel">
                        <div className="panel-header">
                            <h2><Bell size={18} /> Notifications</h2>
                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >All</button>
                                <button
                                    className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                                    onClick={() => setFilter('unread')}
                                >Unread</button>
                            </div>
                        </div>

                        <div className="notifications-list">
                            {filteredNotifications.map((notif) => (
                                <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                    <div className="notif-icon">
                                        <notif.icon size={18} />
                                    </div>
                                    <div className="notif-content">
                                        <p className="notif-title">{notif.title}</p>
                                        <p className="notif-message">{notif.message}</p>
                                        <span className="notif-time">{notif.time}</span>
                                    </div>
                                    {!notif.read && <div className="unread-dot"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Log Panel */}
                    <div className="activity-panel">
                        <div className="panel-header">
                            <h2><Clock size={18} /> Activity Log</h2>
                        </div>

                        <div className="activity-list">
                            {activityLog.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-dot"></div>
                                    <div className="activity-content">
                                        <p><strong>{activity.action}</strong> {activity.item}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
